
import { ExamDescription } from "@/types/exam";

interface UseExamHeaderProps {
  exam: ExamDescription;
}

/**
 * Custom hook to manage ExamHeader component
 */
export const useExamHeader = ({ exam }: UseExamHeaderProps) => {
  return {
    examData: {
      title: exam.title,
      duration: exam.duration,
      passingScore: exam.passingScore
    }
  };
};
