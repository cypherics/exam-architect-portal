
import { ExamDescription, Section } from "@/types/exam";

interface UseExamMainProps {
  exam: ExamDescription;
  sections: Section[];
  addSection?: () => void;
}

/**
 * Custom hook to manage ExamMain component state and computations
 */
export const useExamMain = ({ sections }: UseExamMainProps) => {
  // Calculate total number of questions across all sections
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  
  return {
    computedValues: {
      totalQuestions,
      sectionCount: sections.length
    }
  };
};
