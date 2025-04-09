import { useState, } from "react";
import { useLocation } from "react-router-dom";
import { ExamDescription } from "@/types/exam";
import { useSectionManager } from "@/hooks/useSections";
import { useQuestionDialog } from "@/hooks/useQuestions";


export const useExamPage = () => {
  const location = useLocation();
  const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};

  // State
  const [currentExam, setCurrentExam] = useState<ExamDescription | null>(locationExamDetails);
  const [pendingChanges, setPendingChanges] = useState(false);

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


  // Handle);

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
