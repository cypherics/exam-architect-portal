import { useState, useCallback, useEffect } from "react";
import { Section } from "@/types/exam";
import { generateNumericId } from "@/utils/idGenerator";


export const defaultSection = () => ({
    id: generateNumericId(4),
    title: "Section 1",
    questions: [],
    isExpanded: true,
    isSectionEdited: false,
    isSectionNew: true,
});


export interface useSectionManagerProps {
    sectionStates: {
        sections: Section[];
        isEditing: boolean;
        editedTitle: string;
        totalMarks: number;
        questionCount: number;
        deletedSectionId: string[];
    };
    sectionActions: {
        addSection: () => void;
        deleteSection: (section: Section) => void;
        updateSection: (updatedSection: Section) => void;
        toggleSectionExpand: (sectionId: string) => void;
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
    const [deletedSectionId, setDeletedSectionId] = useState<string[]>([]);

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
            updateSection({ ...section, title: editedTitle, isSectionEdited: true });
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
            id: generateNumericId(4),
            title: `Section ${sections.length + 1}`,
            questions: [],
            isExpanded: true,
            isSectionEdited: false,
            isSectionNew: true,
        };
        setSections((prev) => [...prev, newSection]);
    }, [sections]);

    /**
     * Deletes a section by its ID.
     * 
     * @param sectionId - The ID of the section to delete.
     */
    const deleteSection = useCallback((section: Section): void => {
        setSections((prev) => prev.filter((s) => s.id !== section.id));
        setDeletedSectionId(prev => [...prev, section.id]);
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
            deletedSectionId
        },
        sectionActions: {
            addSection,
            deleteSection,
            updateSection,
            toggleSectionExpand,
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
