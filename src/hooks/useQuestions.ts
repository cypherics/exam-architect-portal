import { useCallback, useState } from "react";
import { Section, Question } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";

export const useQuestionDialog = (
    sections: Section[],
    updateSection: (section: Section) => void,
) => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState(false);
    const { toast } = useToast();

    const handleAddQuestion = useCallback((sectionId: string) => {
        setSelectedSection(sectionId);
        setShowLanguageDialog(true);
    }, []);

    const handleLanguageSelected = useCallback((language: "english" | "arabic") => {
        setSelectedLanguage(language);
        setShowLanguageDialog(false);
        setShowQuestionDialog(true);
    }, []);

    const handleQuestionAdded = useCallback((question: Question) => {
        if (!selectedSection) return;

        const updatedSections = sections.map((s) =>
            s.id === selectedSection ? { ...s, questions: [...s.questions, question] } : s
        );

        const sectionToUpdate = updatedSections.find((s) => s.id === selectedSection);
        if (sectionToUpdate) {
            updateSection(sectionToUpdate);
            setShowQuestionDialog(false);
            setSelectedSection(null);
            setSelectedLanguage(null);
            toast({
                title: "Question Added",
                description: "Your question has been successfully added to the section.",
            });
        }
    }, [selectedSection, sections, updateSection, toast]);

    const handleDeleteQuestion = useCallback((questionId: string, section: Section) => {
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
    }, [toast, updateSection]);


    return {
        questionStates: {
            selectedSection,
            selectedLanguage,
            showLanguageDialog,
            showQuestionDialog,
        },
        questionActions: {
            handleAddQuestion,
            handleLanguageSelected,
            handleQuestionAdded,
            handleDeleteQuestion,
        },
        questionSetters: {
            setShowLanguageDialog,
            setShowQuestionDialog,
        },
    };
};
