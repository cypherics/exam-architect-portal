
import { useMemo } from "react";
import { ExamDescription } from "@/types/exam";

interface UseExamHeaderDataProps {
  exam: ExamDescription;
}

/**
 * Custom hook to manage ExamHeader component
 * Provides processed exam data for display
 */
export const useExamHeaderData = ({ exam }: UseExamHeaderDataProps) => {
  // Compute derived data using useMemo to optimize performance
  const examData = useMemo(() => ({
    title: exam.title,
    duration: exam.duration,
    passingScore: exam.passingScore,
    formattedDuration: `${exam.duration} minute${exam.duration !== "1" ? "s" : ""}`,
    formattedPassingScore: `${exam.passingScore}%`
  }), [exam]);

  return {
    examData
  };
};
