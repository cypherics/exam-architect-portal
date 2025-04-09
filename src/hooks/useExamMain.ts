
import { useMemo } from "react";
import { ExamDescription, Section } from "@/types/exam";

interface UseExamMainProps {
  exam: ExamDescription;
  sections: Section[];
}

/**
 * Custom hook to manage ExamMain component state and computations
 * Calculates derived values from sections and exam data
 */
export const useExamMain = ({ sections }: UseExamMainProps) => {
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
