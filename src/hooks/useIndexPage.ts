
import { useState, useEffect } from "react";
import { useExamManager } from "@/hooks/use-exam-manager";
import { ExamDescription } from "@/types/exam";

/**
 * Custom hook to manage the Index page state and handlers
 */
export const useIndexPage = () => {
  const {
    state: { savedExams, examDetails, sections, importError, windowWasClosed },
    actions: { createExam, handleExamUpdate, handleFileChange, checkWindowClosedState },
    setters: { setSections, setExamDetails, setWindowWasClosed },
  } = useExamManager();

  const [showNewExamDialog, setShowNewExamDialog] = useState(false);
  const [showImportExamDialog, setShowImportExamDialog] = useState(false);

  // Check if window was previously closed on component mount
  useEffect(() => {
    console.log("Index component mounted, checking localStorage");
    const wasWindowClosed = checkWindowClosedState();
    
    if (wasWindowClosed) {
      // Reset the window closed flag for future sessions
      setWindowWasClosed(false);
    }
  }, [checkWindowClosedState, setWindowWasClosed]);

  return {
    state: {
      savedExams,
      examDetails,
      sections,
      importError,
      windowWasClosed,
      showNewExamDialog,
      showImportExamDialog
    },
    actions: {
      createExam,
      handleExamUpdate,
      handleFileChange
    },
    setters: {
      setSections,
      setExamDetails,
      setShowNewExamDialog,
      setShowImportExamDialog
    }
  };
};
