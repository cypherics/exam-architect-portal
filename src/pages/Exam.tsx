import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import ExamHeader from "@/components/Exam/ExamHeader";
import ExamMain from "@/components/Exam/ExamMain";
import LanguageSelectionDialog from "@/dialogs/LanguageSelectionDialog";
import QuestionDialog from "@/dialogs/QuestionDialog";

import { useExamHandlers } from "@/hooks/use-exam-handlers";
import { Question, Section } from "@/types/exam";

const Exam = () => {
    const location = useLocation();
    const { examDetails, sections: initialSections } = location.state;

    const {
        state: { sections, currentExam, pendingChanges },
        actions: { addSection, deleteSection, updateSection, toggleSectionExpand },
        setters: { setSections, setPendingChanges, setCurrentExam, },
    } = useExamHandlers(initialSections, examDetails);

    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
    const { toast } = useToast();

    const handleAddQuestion = (sectionId: string) => {
        setSelectedSection(sectionId);
        setShowLanguageDialog(true);
    };

    const handleLanguageSelected = (language: "english" | "arabic") => {
        setSelectedLanguage(language);
        setShowLanguageDialog(false);
        setShowQuestionDialog(true);
    };

    const handleDeleteQuestion = (questionId: string, section: Section) => {
        const updatedQuestions = section.questions.filter(q => q.id !== questionId);
        updateSection({ ...section, questions: updatedQuestions });
    };


    const handleQuestionAdded = (question: Question) => {
        if (!selectedSection) return;

        const updatedSections = sections.map((section) =>
            section.id === selectedSection
                ? { ...section, questions: [...section.questions, question] }
                : section
        );

        setSections(updatedSections);
        setPendingChanges(true);
        setShowQuestionDialog(false);
        setSelectedSection(null);
        setSelectedLanguage(null);

        toast({
            title: "Question Added",
            description: "Your question has been successfully added to the section.",
        });
    };

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
