import { useState, useCallback } from "react";
import { Section } from "@/types/exam";

export interface useSectionManagerProps {
    sectionStates: {
        sections: Section[];
        isEditing: boolean;
        editedTitle: string;
        totalMarks: number;
        questionCount: number;
    };
    sectionActions: {
        addSection: () => void;
        deleteSection: (sectionId: string) => void;
        updateSection: (updatedSection: Section) => void;
        toggleSectionExpand: (sectionId: string) => void;
        handleTotalMarksChange: (section: Section) => void;
        handleQuestionCountChange: (section: Section) => void;
        handleStartEditing: () => void;
        handleSaveTitle: (section: Section) => void;
        handleCancelEdit: (section: Section) => void;
        handleTitleChange: (value: string) => void;
    };
    sectionSetters: {
        setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    };
}

/**
 * Custom hook to manage the state and actions for exam sections.
 * 
 * @param initialSections - The initial array of sections to populate the state.
 * @returns The state and actions to manage sections.
 */
export const useSectionManager = (
    initialSections: Section[],
): useSectionManagerProps => {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [questionCount, setQuestionCount] = useState<number>(0);

    /**
     * Updates the total marks based on the questions in a section.
     * 
     * @param section - The section whose questions' marks are summed up.
     */
    const handleTotalMarksChange = (section: Section): void => {
        setTotalMarks(section.questions.reduce((sum, q) => sum + q.marks, 0));
    };

    /**
     * Updates the question count based on the questions in a section.
     * 
     * @param section - The section whose question count is updated.
     */
    const handleQuestionCountChange = (section: Section): void => {
        setQuestionCount(section.questions.length);
    };

    /**
     * Starts editing the section title.
     */
    const handleStartEditing = (): void => setIsEditing(true);

    /**
     * Saves the edited title if it is non-empty and updates the section.
     * 
     * @param section - The section whose title is being updated.
     */
    const handleSaveTitle = (section: Section): void => {
        if (editedTitle.trim()) {
            updateSection({ ...section, title: editedTitle });
            setIsEditing(false);
        }
    };

    /**
     * Cancels the edit and restores the section's title to its original.
     * 
     * @param section - The section whose title is being canceled.
     */
    const handleCancelEdit = (section: Section): void => {
        setEditedTitle(section.title);
        setIsEditing(false);
    };

    /**
     * Updates the edited title state.
     * 
     * @param value - The new value for the edited title.
     */
    const handleTitleChange = (value: string): void => setEditedTitle(value);

    /**
     * Adds a new section with a unique ID and default properties.
     */
    const addSection = useCallback((): void => {
        const newSection: Section = {
            id: `${Math.floor(1000 + Math.random() * 9000)}`,
            title: `Section ${sections.length + 1}`,
            questions: [],
            isExpanded: true,
        };
        setSections((prev) => [...prev, newSection]);
    }, [sections]);

    /**
     * Deletes a section by its ID.
     * 
     * @param sectionId - The ID of the section to delete.
     */
    const deleteSection = useCallback((sectionId: string): void => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    }, []);

    /**
     * Updates an existing section.
     * 
     * @param updatedSection - The updated section to replace the old one.
     */
    const updateSection = useCallback((updatedSection: Section): void => {
        setSections((prev) =>
            prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
        );
    }, []);

    /**
     * Toggles the expanded state of a section.
     * 
     * @param sectionId - The ID of the section to toggle.
     */
    const toggleSectionExpand = useCallback((sectionId: string): void => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
            )
        );
    }, []);

    return {
        sectionStates: {
            sections,
            isEditing,
            editedTitle,
            totalMarks,
            questionCount,
        },
        sectionActions: {
            addSection,
            deleteSection,
            updateSection,
            toggleSectionExpand,
            handleTotalMarksChange,
            handleQuestionCountChange,
            handleStartEditing,
            handleSaveTitle,
            handleCancelEdit,
            handleTitleChange,
        },
        sectionSetters: {
            setSections,
        },
    };
};
