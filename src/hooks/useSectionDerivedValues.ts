
import { useMemo } from "react";
import { ExamDescription, Section } from "@/types/exam";

interface UseSectionDerivedValuesProps {
    exam: ExamDescription;
    sections: Section[];
}

interface UseSectionValuesProps {
    section: Section;
}

/**
 * Custom hook to manage ExamMain component state and computations
 * Calculates derived values from sections and exam data
 */
export const useSectionDerivedValues = ({ sections }: UseSectionDerivedValuesProps) => {
    // Calculate derived values using useMemo to optimize performance
    const computedValues = useMemo(() => {
        // Calculate total number of questions across all sections
        const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);

        // Calculate total marks across all questions
        const totalMarks = sections.reduce(
            (sum, section) => sum + section.questions.reduce(
                (secSum, question) => secSum + question.marks, 0
            ), 0
        );

        return {
            totalQuestions,
            totalMarks,
            sectionCount: sections.length
        };
    }, [sections]);

    return {
        computedValues
    };
};



/**
 * Custom hook to manage ExamMain component state and computations
 * Calculates derived values from sections and exam data
 */
export const useSectionValues = ({ section }: UseSectionValuesProps) => {
    // Calculate derived values using useMemo to optimize performance
    const computedValues = useMemo(() => {
        if (!section) {
            return { totalMarks: 0, totalQuestions: 0 };
        }

        const marks = section.questions.reduce((sum, question) => sum + question.marks, 0);
        const questionCount = section.questions.length;

        return {
            totalMarks: marks || 0,
            totalQuestions: questionCount || 0,
        };
    }, [section]);

    return {
        computedValues
    };
};

