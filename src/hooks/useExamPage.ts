import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ExamDescription } from "@/types/exam";
import { useSectionManager } from "@/hooks/useSections";
import { useQuestionDialog } from "@/hooks/useQuestions";
import { useSectionManagerProps } from "@/hooks/useSections";
import { useQuestionDialogProps } from "@/hooks/useQuestions";

export interface useExamPageProps {
  state: {
    currentExam: ExamDescription | null;
    sectionStates: useSectionManagerProps["sectionStates"];
    questionStates: useQuestionDialogProps["questionStates"];
    pendingChanges: boolean;
  };
  actions: {
    sectionActions: useSectionManagerProps["sectionActions"];
    questionActions: useQuestionDialogProps["questionActions"];
  };
  setters: {
    sectionSetters: useSectionManagerProps["sectionSetters"];
    questionSetters: useQuestionDialogProps["questionSetters"];
  };

}
/**
 * Custom hook to manage the state and actions for the Exam page.
 * Provides state for the current exam, sections, questions, and pending changes,
 * as well as actions for managing sections and questions.
 * 
 * @returns An object containing the state, actions, and setters for managing the exam page.
 */
export const useExamPage = (): useExamPageProps => {
  const location = useLocation();
  const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};

  // State
  const [currentExam, setCurrentExam] = useState<ExamDescription | null>(locationExamDetails);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  // Section logic
  const {
    sectionStates,
    sectionActions,
    sectionSetters,
  } = useSectionManager(locationSections || []);

  // Dialog logic
  const {
    questionStates,
    questionActions,
    questionSetters,
  } = useQuestionDialog(sectionStates.sections, sectionActions.updateSection);

  // Return combined state, actions, and setters
  return {
    state: {
      currentExam,
      sectionStates,
      questionStates,
      pendingChanges,
    },
    actions: {
      sectionActions,
      questionActions,
    },
    setters: {
      sectionSetters,
      questionSetters,
    },
  };
};
