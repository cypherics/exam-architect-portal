import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ExamDescription } from "@/types/exam";
import { useSectionManager } from "@/hooks/useSections";
import { useQuestionDialog } from "@/hooks/useQuestions";
import { useSectionManagerProps } from "@/hooks/useSections";
import { useQuestionDialogProps } from "@/hooks/useQuestions";
import { useOptionProps } from "@/hooks/useOptions";
import { useOption } from "@/hooks/useOptions";

export interface useExamPageProps {
  state: {
    currentExam: ExamDescription | null;
    sectionStates: useSectionManagerProps["sectionStates"];
    questionStates: useQuestionDialogProps["questionStates"];
    optionStates: useOptionProps["optionStates"];
    pendingChanges: boolean;
  };
  actions: {
    sectionActions: useSectionManagerProps["sectionActions"];
    questionActions: useQuestionDialogProps["questionActions"];
    optionActions: useOptionProps["optionActions"];
  };
  setters: {
    sectionSetters: useSectionManagerProps["sectionSetters"];
    questionSetters: useQuestionDialogProps["questionSetters"];
    optionSetters: useOptionProps["optionSetters"];
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
    sectionStates, sectionActions, sectionSetters,
  } = useSectionManager(locationSections || []);

  // Dialog logic
  const { questionStates, questionActions, questionSetters,
  } = useQuestionDialog(sectionStates.sections, sectionActions.updateSection);

  const { optionStates, optionSetters, optionActions
  } = useOption(questionActions.handleGenerateQuestionWithOption);

  // Update}
  // Return combined state, actions, and setters
  return {
    state: {
      currentExam,
      sectionStates,
      questionStates,
      optionStates,
      pendingChanges,
    },
    actions: {
      sectionActions,
      questionActions,
      optionActions,
    },
    setters: {
      sectionSetters,
      questionSetters,
      optionSetters
    },
  };
};
