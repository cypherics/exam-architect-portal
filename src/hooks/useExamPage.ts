
import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useExamHandlers } from "@/hooks/use-exam-handlers";
import { Question, Section, ExamDescription } from "@/types/exam";
import { useWindowEvents } from "@/hooks/use-window-events";

interface ExamPageState {
  sections: Section[];
  currentExam: ExamDescription | null;
  showLanguageDialog: boolean;
  showQuestionDialog: boolean;
  selectedLanguage: "english" | "arabic" | null;
  selectedSection: string | null;
  stateRestored: boolean;
}

/**
 * Custom hook to manage the Exam page state and handlers
 * Handles state persistence, dialogs, and question/section operations
 */
export const useExamPage = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};
  const { toast } = useToast();
  
  // Use localStorage for persistent storage of exam state
  const [savedExamDetails, setSavedExamDetails] = useLocalStorage<ExamDescription | null>(
    `currentExamDetails_${id}`,
    locationExamDetails || null
  );
  
  const [savedSections, setSavedSections] = useLocalStorage<Section[]>(
    `currentExamSections_${id}`,
    locationSections || []
  );
  
  const [stateRestored, setStateRestored] = useState<boolean>(false);
  
  // Initialize with either location state or saved state
  const initialExamDetails = locationExamDetails || savedExamDetails;
  const initialSections = locationSections || savedSections;

  // Track window closed state to reset on full closure (not just refresh)
  const [windowWasClosed, setWindowWasClosed] = useLocalStorage<boolean>("windowWasClosed", false);

  // Initialize section and exam handlers
  const {
    state: { sections, currentExam, pendingChanges },
    actions: { addSection, deleteSection, updateSection, toggleSectionExpand },
    setters: { setSections: setLocalSections, setPendingChanges, setCurrentExam },
  } = useExamHandlers(initialSections, initialExamDetails);

  // Dialog and selection state
  const [showLanguageDialog, setShowLanguageDialog] = useState<boolean>(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);

  // Check if there was a closed window and if we should reset state
  useEffect(() => {
    const checkForStateReset = async () => {
      if (windowWasClosed) {
        console.log("Window was previously closed - resetting exam state");
        // Reset window closed flag
        setWindowWasClosed(false);
        
        // Clear any saved state after window closure
        // We don't clear here because we want to show the user their data
        // Just notify them that they're viewing a recovered session
        if (savedExamDetails && savedSections.length > 0) {
          setStateRestored(true);
          
          toast({
            title: "Session Recovered",
            description: "Your previous unsaved work has been restored."
          });
        }
      }
    };
    
    checkForStateReset();
  }, [windowWasClosed, setWindowWasClosed, savedExamDetails, savedSections, toast]);

  // Handle window unload events to detect browser/tab closure
  useWindowEvents({
    onBeforeUnload: () => {
      console.log("Window is closing during exam edit, setting window closed flag");
      setWindowWasClosed(true);
    }
  });
  
  // Sync state with localStorage when it changes
  useEffect(() => {
    if (sections.length > 0) {
      setSavedSections(sections);
    }
  }, [sections, setSavedSections]);

  useEffect(() => {
    if (currentExam) {
      setSavedExamDetails(currentExam);
    }
  }, [currentExam, setSavedExamDetails]);

  /**
   * Initiates the question addition flow by showing the language selection dialog
   * @param sectionId - The section to add the question to
   */
  const handleAddQuestion = useCallback((sectionId: string) => {
    try {
      setSelectedSection(sectionId);
      setShowLanguageDialog(true);
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  /**
   * Handles language selection for a new question
   * @param language - The selected language
   */
  const handleLanguageSelected = useCallback((language: "english" | "arabic") => {
    setSelectedLanguage(language);
    setShowLanguageDialog(false);
    setShowQuestionDialog(true);
  }, []);

  /**
   * Deletes a question from a section
   * @param questionId - The ID of the question to delete
   * @param section - The section containing the question
   */
  const handleDeleteQuestion = useCallback((questionId: string, section: Section) => {
    try {
      const updatedQuestions = section.questions.filter(q => q.id !== questionId);
      updateSection({ ...section, questions: updatedQuestions });
      
      toast({
        title: "Question Deleted",
        description: "The question has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, updateSection]);

  /**
   * Adds a new question to the selected section
   * @param question - The question to add
   */
  const handleQuestionAdded = useCallback((question: Question) => {
    if (!selectedSection) return;

    try {
      const updatedSections = sections.map((section) =>
        section.id === selectedSection
          ? { ...section, questions: [...section.questions, question] }
          : section
      );

      setLocalSections(updatedSections);
      setPendingChanges(true);
      setShowQuestionDialog(false);
      setSelectedSection(null);
      setSelectedLanguage(null);

      toast({
        title: "Question Added",
        description: "Your question has been successfully added to the section.",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedSection, sections, setLocalSections, setPendingChanges, toast]);

  /**
   * Clears the recovered state notification
   */
  const dismissStateRestoredNotification = useCallback(() => {
    setStateRestored(false);
  }, []);

  return {
    state: {
      sections,
      currentExam,
      showLanguageDialog,
      showQuestionDialog,
      selectedLanguage,
      stateRestored
    },
    actions: {
      addSection,
      deleteSection,
      updateSection,
      toggleSectionExpand,
      handleAddQuestion,
      handleLanguageSelected,
      handleDeleteQuestion,
      handleQuestionAdded,
      dismissStateRestoredNotification
    },
    setters: {
      setShowLanguageDialog,
      setShowQuestionDialog
    }
  };
};
