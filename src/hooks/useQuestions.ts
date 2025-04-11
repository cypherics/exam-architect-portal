import { useCallback, useState, useEffect, useRef } from "react";
import { Section, Question, Option } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";
import { generateNumericId } from "@/utils/idGenerator";
import { QuestionCard } from "@/components/Question";

export interface useQuestionDialogProps {
    questionStates: {
        text: string;
        description: string;
        marks: string;
        selectedSectionId: string | null;
        isSubmitting: boolean;
        selectedLanguage: "english" | "arabic" | null;
        showLanguageDialog: boolean;
        showQuestionDialog: boolean;
        deletedQuestionId: string[];
    };
    questionActions: {
        handleAddQuestion: (section: Section) => void;
        handleLanguageSelected: (language: "english" | "arabic") => void;
        handleQuestionAdded: (question: Question) => void;
        handleDeleteQuestion: (question: Question, section: Section) => void;
        handleGenerateQuestionWithOption: (options: Option[]) => void;
        handleEditQuestion: (section: Section, question: Question, setOptions: React.Dispatch<React.SetStateAction<Option[]>>) => void;
    };
    questionSetters: {
        setText: React.Dispatch<React.SetStateAction<string>>;
        setDescription: React.Dispatch<React.SetStateAction<string>>;
        setMarks: React.Dispatch<React.SetStateAction<string>>;
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
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
    const [showLanguageDialog, setShowLanguageDialog] = useState<boolean>(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState<boolean>(false);
    const [deletedQuestionId, setDeletedQuestionId] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [marks, setMarks] = useState("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    const { toast } = useToast();

    /**
     * Opens the language selection dialog to add a question.
     * 
     * @param sectionId - The ID of the section to which the question will be added.
     */
    const handleAddQuestion = useCallback((section: Section): void => {
        setSelectedSectionId(section.id);
        setSelectedSection(section);
        setShowLanguageDialog(true);
    }, []);

    /**
 * Opens the language selection dialog to add a question.
 * 
 * @param sectionId - The ID of the section to which the question will be added.
 */
    const handleEditQuestion = useCallback((section: Section, question: Question,
        setOptions: React.Dispatch<React.SetStateAction<Option[]>>): void => {

        setSelectedSectionId(section.id);
        setSelectedSection(section);
        setText(question.text);
        setDescription(question.description);
        setMarks(question.marks.toString());
        setSelectedLanguage(question.language);
        setOptions(question.options);
        setIsEditing(true);
        setSelectedQuestion(question);
        setShowQuestionDialog(true);
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

        const updatedQuestions = isEditing
            ? selectedSection.questions.map((q) => (q.id === question.id ? question : q)) // Replace
            : [...selectedSection.questions, question]; // Add

        const updatedSection = {
            ...selectedSection,
            questions: updatedQuestions,
        };


        updateSection(updatedSection);
        setShowQuestionDialog(false);
        setSelectedSectionId(null);
        setSelectedLanguage(null);
        toast({
            title: "Question Added",
            description: "Your question has been successfully added to the section.",
        });
    }, [selectedSection, isEditing, updateSection, toast]);

    /**
     * Deletes a question from a section.
     * 
     * @param questionId - The ID of the question to be deleted.
     * @param section - The section from which the question will be deleted.
     */
    const handleDeleteQuestion = useCallback((question: Question, section: Section): void => {
        try {
            setDeletedQuestionId(prev => [...prev, question.id]);
            const updatedQuestions = section.questions.filter(q => q.id !== question.id);
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

    /**
     * Handles the generation of a new question with options.
     * 
     * @param {string} language - The language for the question.
     * @param {string} text - The text of the question.
     * @param {string} description - A description of the question.
     * @param {number} marks - The marks for the question. Defaults to 1 if not provided.
     * @param {Option[]} options - The list of options for the question.
     * 
     * @returns {void}
     */
    const handleGenerateQuestionWithOption = useCallback(
        (options: Option[]) => {
            try {
                if (!text.trim()) {
                    resetForm();
                    return;
                }

                if (!options.some(opt => opt.isCorrect)) {
                    resetForm();
                    return;
                }

                if (options.some(opt => !opt.text.trim())) {
                    resetForm();
                    return;
                }

                const question: Question = {
                    id: isEditing ? selectedQuestion.id : generateNumericId(4),
                    section_id: selectedSectionId,
                    language: selectedLanguage,
                    text,
                    description,
                    marks: parseInt(marks) || 1,  // Default to 1 if marks is falsy
                    options: options.map(option => ({
                        ...option,
                        question_id: selectedSectionId,
                    })),
                    isQuestionEdited: isEditing ? true : false,
                    isQuestionNew: isEditing ? true : false,
                };
                setIsSubmitting(true);
                setSelectedLanguage(null);
                setIsEditing(false);


                setTimeout(() => {
                    handleQuestionAdded(question);
                    resetForm();
                }, 5);

                toast({
                    title: "Question Added",
                    description: "The question has been successfully added.",
                });
            } catch (error) {
                console.error("Error adding question:", error);
                toast({
                    title: "Error",
                    description: "There was an issue adding the question. Please try again.",
                });
            }
        },
        [text, description, marks, selectedLanguage, setIsSubmitting, toast, handleQuestionAdded]
    );

    /**
     * Resets the form fields to their initial state.
     * 
     * @returns {void}
    */
    const resetForm = useCallback(() => {
        setText("");
        setDescription("");
        setMarks("1");
        setIsSubmitting(false);
    }, []);


    return {
        questionStates: {
            text,
            description,
            marks,
            isSubmitting,
            selectedSectionId,
            selectedLanguage,
            showLanguageDialog,
            showQuestionDialog,
            deletedQuestionId
        },
        questionActions: {
            handleAddQuestion,
            handleLanguageSelected,
            handleQuestionAdded,
            handleDeleteQuestion,
            handleGenerateQuestionWithOption,
            handleEditQuestion,
        },
        questionSetters: {
            setText,
            setDescription,
            setMarks,
            setShowLanguageDialog,
            setShowQuestionDialog,
        },
    };
};
