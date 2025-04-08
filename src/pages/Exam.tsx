
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import { ExamHeader, ExamMain } from "@/components/Exam";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

import { useExamHandlers } from "@/hooks/use-exam-handlers";
import { Question, Section, ExamDescription } from "@/types/exam";

const Exam = () => {
    const location = useLocation();
    const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};
    
    // Use localStorage for persistent storage of exam state
    const [savedExamDetails, setSavedExamDetails] = useLocalStorage<ExamDescription | null>(
        "currentExamDetails",
        locationExamDetails || null
    );
    
    const [savedSections, setSavedSections] = useLocalStorage<Section[]>(
        "currentExamSections",
        locationSections || []
    );
    
    // Initialize with either location state or saved state
    const initialExamDetails = locationExamDetails || savedExamDetails;
    const initialSections = locationSections || savedSections;

    const {
        state: { sections, currentExam, pendingChanges },
        actions: { addSection, deleteSection, updateSection, toggleSectionExpand },
        setters: { setSections: setLocalSections, setPendingChanges, setCurrentExam },
    } = useExamHandlers(initialSections, initialExamDetails);

    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
    const { toast } = useToast();

    // Sync state with localStorage when it changes
    useEffect(() => {
        if (sections.length > 0) {
            setSavedSections(sections);
        }
    }, [sections, setSavedSections]);

    useEffect(() => {
        if (currentExam) {
            setSavedExamDetails(currentExam);
        }
    }, [currentExam, setSavedExamDetails]);

    const handleAddQuestion = (sectionId: string) => {
        try {
            setSelectedSection(sectionId);
            setShowLanguageDialog(true);
        } catch (error) {
            console.error("Error adding question:", error);
            toast({
                title: "Error",
                description: "Failed to add question. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleLanguageSelected = (language: "english" | "arabic") => {
        setSelectedLanguage(language);
        setShowLanguageDialog(false);
        setShowQuestionDialog(true);
    };

    const handleDeleteQuestion = (questionId: string, section: Section) => {
        try {
            const updatedQuestions = section.questions.filter(q => q.id !== questionId);
            updateSection({ ...section, questions: updatedQuestions });
            
            toast({
                title: "Question Deleted",
                description: "The question has been successfully removed.",
            });
        } catch (error) {
            console.error("Error deleting question:", error);
            toast({
                title: "Error",
                description: "Failed to delete question. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleQuestionAdded = (question: Question) => {
        if (!selectedSection) return;

        try {
            const updatedSections = sections.map((section) =>
                section.id === selectedSection
                    ? { ...section, questions: [...section.questions, question] }
                    : section
            );

            setLocalSections(updatedSections);
            setPendingChanges(true);
            setShowQuestionDialog(false);
            setSelectedSection(null);
            setSelectedLanguage(null);

            toast({
                title: "Question Added",
                description: "Your question has been successfully added to the section.",
            });
        } catch (error) {
            console.error("Error adding question:", error);
            toast({
                title: "Error",
                description: "Failed to add question. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (!currentExam) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Exam Not Found</h2>
                    <p className="text-muted-foreground mb-6">The exam you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="bg-white shadow-sm sticky top-0 z-10 transition-all duration-300">
                <ExamHeader exam={currentExam} />
            </header>

            <ExamMain
                exam={currentExam}
                sections={sections}
                addSection={addSection}
                deleteSection={deleteSection}
                updateSection={updateSection}
                toggleSectionExpand={toggleSectionExpand}
                handleAddQuestion={handleAddQuestion}
            />

            <LanguageSelectionDialog
                open={showLanguageDialog}
                onOpenChange={setShowLanguageDialog}
                onLanguageSelect={handleLanguageSelected}
            />

            <QuestionDialog
                open={showQuestionDialog}
                onOpenChange={setShowQuestionDialog}
                onAddQuestion={handleQuestionAdded}
                language={selectedLanguage || "english"}
            />
        </div>
    );
};

export default Exam;
