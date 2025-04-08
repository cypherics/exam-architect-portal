import { useState } from "react";
import { Section, Question, ExamDescription } from "@/types/exam";

export const useExamHandlers = (
    initialSections: Section[],
    examDetails: ExamDescription
) => {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [pendingChanges, setPendingChanges] = useState(false);
    const [currentExam, setCurrentExam] = useState<ExamDescription | null>(examDetails);

    const addSection = () => {
        const newSection: Section = {
            id: `${Math.floor(1000 + Math.random() * 9000)}`,
            title: `Section ${sections.length + 1}`,
            questions: [],
            isExpanded: true,
        };
        setSections((prev) => [...prev, newSection]);
        setPendingChanges(true);
    };

    const deleteSection = (sectionId: string) => {
        setSections((prev) => prev.filter((section) => section.id !== sectionId));
        setPendingChanges(true);
    };

    const updateSection = (updatedSection: Section) => {
        setSections((prev) =>
            prev.map((section) => (section.id === updatedSection.id ? updatedSection : section))
        );
        setPendingChanges(true);
    };

    const toggleSectionExpand = (sectionId: string) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
            )
        );
    };

    return {
        state: {
            sections,
            pendingChanges,
            currentExam,
        },
        setters: {
            setSections,
            setPendingChanges,
            setCurrentExam,
        },
        actions: {
            addSection,
            deleteSection,
            updateSection,
            toggleSectionExpand,
        },
    };
};
