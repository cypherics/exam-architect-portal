import { useState, useCallback } from "react";
import { Section } from "@/types/exam";

export const useSectionManager = (
    initialSections: Section[],
) => {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [totalMarks, setTotalMarks] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);

    const handleTotalMarksChange = (section: Section) => {
        setTotalMarks(section.questions.reduce((sum, q) => sum + q.marks, 0));
    };

    const handleQuestionCountChange = (section: Section) => {
        setQuestionCount(section.questions.length);
    };

    const handleStartEditing = () => setIsEditing(true);

    const handleSaveTitle = (section: Section) => {
        if (editedTitle.trim()) {
            updateSection({ ...section, title: editedTitle });
            setIsEditing(false);
        }
    };

    const handleCancelEdit = (section: Section) => {
        setEditedTitle(section.title);
        setIsEditing(false);
    };

    const handleTitleChange = (value: string) => setEditedTitle(value);


    const addSection = useCallback(() => {
        const newSection: Section = {
            id: `${Math.floor(1000 + Math.random() * 9000)}`,
            title: `Section ${sections.length + 1}`,
            questions: [],
            isExpanded: true,
        };
        setSections((prev) => [...prev, newSection]);

    }, [sections]);

    const deleteSection = useCallback((sectionId: string) => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));

    }, []);

    const updateSection = useCallback((updatedSection: Section) => {
        setSections((prev) =>
            prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
        );
    }, []);

    const toggleSectionExpand = useCallback((sectionId: string) => {
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
