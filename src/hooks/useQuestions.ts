import { useCallback, useState } from "react";
import { Section, Question } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";

export interface useQuestionDialogProps {
    questionStates: {
        selectedSection: string | null;
        selectedLanguage: "english" | "arabic" | null;
        showLanguageDialog: boolean;
        showQuestionDialog: boolean;
    };
    questionActions: {
        handleAddQuestion: (sectionId: string) => void;
        handleLanguageSelected: (language: "english" | "arabic") => void;
        handleQuestionAdded: (question: Question) => void;
        handleDeleteQuestion: (questionId: string, section: Section) => void;
    };
    questionSetters: {
        setShowLanguageDialog: React.Dispatch<React.SetStateAction<boolean>>;
        setShowQuestionDialog: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

/**
 * Custom hook for managing the state and actions related to adding, deleting, and managing questions within sections.
 * 
 * @param sections - The array of sections to manage.
 * @param updateSection - Function to update a specific section with new data.
 * @returns The state and actions to manage questions in the dialog.
 */
export const useQuestionDialog = (
    sections: Section[],
    updateSection: (section: Section) => void,
): useQuestionDialogProps => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
    const [showLanguageDialog, setShowLanguageDialog] = useState<boolean>(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState<boolean>(false);
    const { toast } = useToast();

    /**
     * Opens the language selection dialog to add a question.
     * 
     * @param sectionId - The ID of the section to which the question will be added.
     */
    const handleAddQuestion = useCallback((sectionId: string): void => {
        setSelectedSection(sectionId);
        setShowLanguageDialog(true);
    }, []);

    /**
     * Sets the selected language and shows the question input dialog.
     * 
     * @param language - The language selected for the question, either 'english' or 'arabic'.
     */
    const handleLanguageSelected = useCallback((language: "english" | "arabic"): void => {
        setSelectedLanguage(language);
        setShowLanguageDialog(false);
        setShowQuestionDialog(true);
    }, []);

    /**
     * Adds a new question to the selected section and updates the section.
     * 
     * @param question - The question object to be added to the section.
     */
    const handleQuestionAdded = useCallback((question: Question): void => {
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

    /**
     * Deletes a question from a section.
     * 
     * @param questionId - The ID of the question to be deleted.
     * @param section - The section from which the question will be deleted.
     */
    const handleDeleteQuestion = useCallback((questionId: string, section: Section): void => {
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
