
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useExamHandlers } from "@/hooks/use-exam-handlers";
import { Question, Section, ExamDescription } from "@/types/exam";
import { useWindowEvents } from "@/hooks/use-window-events";

/**
 * Custom hook to manage the Exam page state and handlers
 */
export const useExamPage = () => {
  const location = useLocation();
  const { examDetails: locationExamDetails, sections: locationSections } = location.state || {};
  const { toast } = useToast();
  
  // Use localStorage for persistent storage of exam state
  const [savedExamDetails, setSavedExamDetails] = useLocalStorage<ExamDescription | null>(
    "currentExamDetails",
    locationExamDetails || null
  );
  
  const [savedSections, setSavedSections] = useLocalStorage<Section[]>(
    "currentExamSections",
    locationSections || []
  );
  
  // Check if window was previously closed
  const [windowWasClosed, setWindowWasClosed] = useLocalStorage<boolean>("windowWasClosed", false);
  
  // Initialize with either location state or saved state, but only if window wasn't closed
  const initialExamDetails = windowWasClosed ? 
    (locationExamDetails || null) : 
    (locationExamDetails || savedExamDetails);
    
  const initialSections = windowWasClosed ? 
    (locationSections || []) : 
    (locationSections || savedSections);

  const {
    state: { sections, currentExam, pendingChanges },
    actions: { addSection, deleteSection, updateSection, toggleSectionExpand },
    setters: { setSections: setLocalSections, setPendingChanges, setCurrentExam },
  } = useExamHandlers(initialSections, initialExamDetails);

  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);

  // Handle window events for state preservation
  useWindowEvents({
    onBeforeUnload: () => {
      console.log("Window is closing, setting window closed flag");
      setWindowWasClosed(true);
    }
  });

  // Reset window closed flag when component mounts
  useEffect(() => {
    if (windowWasClosed) {
      console.log("Resetting window closed flag");
      setWindowWasClosed(false);
    }
  }, [windowWasClosed, setWindowWasClosed]);

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

  const handleAddQuestion = (sectionId: string) => {
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
  };

  const handleLanguageSelected = (language: "english" | "arabic") => {
    setSelectedLanguage(language);
    setShowLanguageDialog(false);
    setShowQuestionDialog(true);
  };

  const handleDeleteQuestion = (questionId: string, section: Section) => {
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
  };

  const handleQuestionAdded = (question: Question) => {
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
  };

  return {
    state: {
      sections,
      currentExam,
      showLanguageDialog,
      showQuestionDialog,
      selectedLanguage
    },
    actions: {
      addSection,
      deleteSection,
      updateSection,
      toggleSectionExpand,
      handleAddQuestion,
      handleLanguageSelected,
      handleDeleteQuestion,
      handleQuestionAdded
    },
    setters: {
      setShowLanguageDialog,
      setShowQuestionDialog
    }
  };
};
