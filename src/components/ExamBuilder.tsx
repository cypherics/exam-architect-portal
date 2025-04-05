
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  PlusCircle,
  Save,
  ArrowLeft,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SectionComponent from "./SectionComponent";
import LanguageSelectionDialog from "./LanguageSelectionDialog";
import QuestionDialog from "./QuestionDialog";
import { convertAppDataToExportFormat, convertImportedExamToAppFormat, validateExamData, ExportableExam } from "@/utils/examConverter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: string;
  passingScore: string;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  language: "english" | "arabic";
  text: string;
  description: string;
  options: Option[];
  marks: number;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
  isExpanded: boolean;
}

interface ExamBuilderProps {
  exam: Exam;
  imported_sections: Section[];
  onBack: () => void;
  onExamUpdated?: (exam: Exam) => void;
}

// Storage key for localStorage
const EXAM_BUILDER_STORAGE_KEY = "exam_builder_state";

const ExamBuilder: React.FC<ExamBuilderProps> = ({ exam, imported_sections, onBack, onExamUpdated }) => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      title: "Section 1",
      questions: [],
      isExpanded: true
    }
  ]);

  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
  const [currentExam, setCurrentExam] = useState<Exam>(exam);
  const [importError, setImportError] = useState<string | null>(null);
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore saved state from localStorage when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem(EXAM_BUILDER_STORAGE_KEY);
    
    if (savedState) {
      try {
        const { exam: savedExam, sections: savedSections } = JSON.parse(savedState);
        
        // Only restore if we're working on the same exam (by ID)
        if (savedExam.id === exam.id) {
          setCurrentExam(savedExam);
          setSections(savedSections);
          toast({
            title: "Progress Restored",
            description: "Your previous work has been restored.",
          });
        }
      } catch (error) {
        console.error("Error restoring saved state:", error);
      }
    }
  }, [exam.id]);

  // Save state to localStorage whenever sections or exam are updated
  useEffect(() => {
    if (pendingChanges) {
      const stateToSave = {
        exam: currentExam,
        sections: sections
      };
      localStorage.setItem(EXAM_BUILDER_STORAGE_KEY, JSON.stringify(stateToSave));
      setPendingChanges(false);
    }
  }, [pendingChanges, currentExam, sections]);

  // Set up auto-save on a timer
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (pendingChanges) {
        const stateToSave = {
          exam: currentExam,
          sections: sections
        };
        localStorage.setItem(EXAM_BUILDER_STORAGE_KEY, JSON.stringify(stateToSave));
        setPendingChanges(false);
      }
    }, 5000); // Auto-save every 5 seconds if there are pending changes
    
    return () => clearInterval(autoSaveInterval);
  }, [pendingChanges, currentExam, sections]);

  // Setup beforeunload event to warn users about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingChanges) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingChanges]);

  // Use useEffect to assign imported_sections to sections if imported_sections is available
  useEffect(() => {
    if (imported_sections && imported_sections.length > 0) {
      setSections(imported_sections);
      setPendingChanges(true);
    }
  }, [imported_sections]);

  const addSection = () => {
    const newSection = {
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Section ${sections.length + 1}`,
      questions: [],
      isExpanded: true
    };

    setSections([...sections, newSection]);
    setPendingChanges(true);

    // Use setTimeout to give the DOM time to update before adding the animation class
    setTimeout(() => {
      const sectionElements = document.querySelectorAll('.section-container');
      const newSectionElement = sectionElements[sectionElements.length - 1];
      newSectionElement?.classList.add('bounce');
    }, 100);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    setPendingChanges(true);
  };

  const updateSection = (updatedSection: Section) => {
    setSections(sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    ));
    setPendingChanges(true);
  };

  const toggleSectionExpand = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handleAddQuestion = (sectionId: string) => {
    setSelectedSection(sectionId);
    setShowLanguageDialog(true);
  };

  const handleLanguageSelected = (language: "english" | "arabic") => {
    setSelectedLanguage(language);
    setShowLanguageDialog(false);
    setShowQuestionDialog(true);
  };

  const handleQuestionAdded = (question: Question) => {
    if (!selectedSection) return;

    setSections(sections.map(section =>
      section.id === selectedSection
        ? { ...section, questions: [...section.questions, question] }
        : section
    ));
    setPendingChanges(true);

    setShowQuestionDialog(false);
    setSelectedSection(null);
    setSelectedLanguage(null);

    toast({
      title: "Question Added",
      description: "Your question has been successfully added to the section.",
    });
  };

  const saveExam = () => {
    // Create JSON representation of the exam using our converter utility
    const exportData = convertAppDataToExportFormat(currentExam, sections);

    // Convert to JSON string
    const jsonStr = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentExam.title.replace(/\s+/g, '_').toLowerCase()}_exam.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clear the pending changes flag
    setPendingChanges(false);

    // Show success message
    toast({
      title: "Exam Saved",
      description: "Your exam has been successfully exported as JSON.",
      variant: "default",
    });

    // If there's an onExamUpdated callback, call it
    if (onExamUpdated) {
      onExamUpdated(currentExam);
    }
  };

  const handleImportClick = () => {
    setImportError(null);
    setShowImportDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);

        // Validate the imported data
        if (!validateExamData(jsonData)) {
          setImportError("Invalid exam format. Please check your JSON file structure.");
          return;
        }

        // Convert the data to our app's format
        const { exam: importedExam, sections: importedSections } = convertImportedExamToAppFormat(jsonData);

        // Update the state
        setCurrentExam(importedExam);
        setSections(importedSections);
        setPendingChanges(true);

        // Close the dialog and show success message
        setShowImportDialog(false);

        toast({
          title: "Exam Imported",
          description: `Successfully imported ${importedExam.title} with ${importedSections.length} sections.`,
          variant: "default",
        });

        // If there's an onExamUpdated callback, call it
        if (onExamUpdated) {
          onExamUpdated(importedExam);
        }
      } catch (error) {
        console.error("Error importing exam:", error);
        setImportError("Failed to parse the JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 transition-all duration-300">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (pendingChanges) {
                    if (window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
                      onBack();
                    }
                  } else {
                    onBack();
                  }
                }}
                className="rounded-full h-9 w-9 transition-transform hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{currentExam.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{currentExam.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Passing score: {currentExam.passingScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="flex items-center gap-2 btn-hover shadow-sm"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                onClick={saveExam}
                className="flex items-center gap-2 btn-hover shadow-sm"
              >
                <Download className="h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/50 backdrop-blur-sm border border-blue-100 rounded-xl p-6 mb-8 fade-in shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Exam Description</h2>
          <p className="text-muted-foreground">{currentExam.description}</p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Exam Sections</h2>
            <p className="text-sm text-muted-foreground">
              {sections.length} section{sections.length !== 1 ? 's' : ''} •
              {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={addSection}
            variant="outline"
            className="flex items-center gap-2 btn-hover"
          >
            <PlusCircle className="h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <SectionComponent
              key={section.id}
              section={section}
              onUpdate={updateSection}
              onDelete={deleteSection}
              onAddQuestion={() => handleAddQuestion(section.id)}
              onToggleExpand={() => toggleSectionExpand(section.id)}
            />
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-xl">
            <p className="text-muted-foreground mb-4">No sections added yet.</p>
            <Button
              onClick={addSection}
              variant="outline"
              className="flex items-center gap-2 mx-auto btn-hover"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Section
            </Button>
          </div>
        )}
      </main>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md dialog-animation rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Import Exam</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="examFile" className="text-sm font-medium">
                  Upload Exam JSON File
                </Label>
                <Input
                  id="examFile"
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="input-underline rounded-lg"
                />
                {importError && (
                  <p className="text-sm text-red-500 mt-1">{importError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a JSON file with the exam structure
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LanguageSelectionDialog
        open={showLanguageDialog}
        onOpenChange={setShowLanguageDialog}
        onLanguageSelect={handleLanguageSelected}
      />

      <QuestionDialog
        open={showQuestionDialog}
        onOpenChange={setShowQuestionDialog}
        onAddQuestion={handleQuestionAdded}
        language={selectedLanguage || "english"}
      />
    </div>
  );
};

export default ExamBuilder;
