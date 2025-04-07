
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, FileEdit, GraduationCap, Upload, Download } from "lucide-react";
import ExamBuilder from "@/components/ExamBuilder";
import { useToast } from "@/components/ui/use-toast";
import { convertImportedExamToAppFormat, validateExamData } from "@/utils/examConverter";
import { Section } from "@/components/ExamBuilder";
import { Exam } from "@/components/ExamBuilder";

// Storage keys for localStorage - explicitly named to avoid conflicts
const SAVED_EXAMS_KEY = "saved_exams_list";
const NEW_EXAM_FORM_KEY = "new_exam_form_state";
const CURRENT_EXAM_KEY = "current_exam";
const CURRENT_SECTIONS_KEY = "current_sections";
const INITIAL_VISIT_KEY = "initial_visit";

const Index = () => {
  const [showNewExamDialog, setShowNewExamDialog] = useState(false);
  const [showImportExamDialog, setShowImportExamDialog] = useState(false);
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [sections, setSections] = useState<Section[]>([
    {
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      title: "Section 1",
      questions: [],
      isExpanded: true
    }
  ]);

  const { toast } = useToast();
  const [savedExams, setSavedExams] = useState<Exam[]>([]);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: "",
    passingScore: ""
  });
  const [importError, setImportError] = useState<string | null>(null);
  const [isInitialVisit, setIsInitialVisit] = useState(true);

  // Setup beforeunload event to clear localStorage when window is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear the current exam state when window is closed
      console.log("Window closing - clearing current exam state");
      localStorage.removeItem(CURRENT_EXAM_KEY);
      localStorage.removeItem(CURRENT_SECTIONS_KEY);
      localStorage.setItem(INITIAL_VISIT_KEY, "true");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log("Index component mounted, checking localStorage");
    
    // Check if this is the initial visit after page reload/close
    const initialVisit = localStorage.getItem(INITIAL_VISIT_KEY);
    console.log("Initial visit check:", initialVisit);
    
    if (initialVisit === "true" || initialVisit === null) {
      // This is the first visit or after window close/reload - show landing page
      console.log("This is initial visit - showing landing page");
      setIsInitialVisit(true);
      localStorage.setItem(INITIAL_VISIT_KEY, "false");
      
      // Clear any existing exam state
      localStorage.removeItem(CURRENT_EXAM_KEY);
      localStorage.removeItem(CURRENT_SECTIONS_KEY);
      
      setExamDetails(null);
    } else {
      // This is a subsequent visit - try to restore state
      setIsInitialVisit(false);
      
      // Check for current exam and sections in localStorage
      try {
        const storedExam = localStorage.getItem(CURRENT_EXAM_KEY);
        const storedSections = localStorage.getItem(CURRENT_SECTIONS_KEY);
        
        if (storedExam && storedSections) {
          console.log("Found stored exam and sections", {
            exam: JSON.parse(storedExam),
            sections: JSON.parse(storedSections)
          });
          
          setExamDetails(JSON.parse(storedExam));
          setSections(JSON.parse(storedSections));
          
          toast({
            title: "Session Restored",
            description: "Your previous exam session has been restored.",
          });
        }
      } catch (e) {
        console.error("Error restoring exam state:", e);
      }
    }
    
    // Load saved exams anyway (this persists across visits)
    try {
      const storedExams = localStorage.getItem(SAVED_EXAMS_KEY);
      if (storedExams) {
        setSavedExams(JSON.parse(storedExams));
      }
    } catch (e) {
      console.error("Error loading saved exams:", e);
    }
    
    // Load new exam form data
    try {
      const storedNewExam = localStorage.getItem(NEW_EXAM_FORM_KEY);
      if (storedNewExam) {
        setNewExam(JSON.parse(storedNewExam));
      }
    } catch (e) {
      console.error("Error loading new exam form:", e);
    }
  }, []);

  // Save exams to localStorage whenever they change
  useEffect(() => {
    if (savedExams.length > 0) {
      localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(savedExams));
    }
  }, [savedExams]);

  // Save new exam form state to localStorage
  useEffect(() => {
    if (newExam.title || newExam.description || newExam.duration || newExam.passingScore) {
      localStorage.setItem(NEW_EXAM_FORM_KEY, JSON.stringify(newExam));
    }
  }, [newExam]);

  const handleCreateExam = () => {
    if (!newExam.title || !newExam.description || !newExam.duration || !newExam.passingScore) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const exam: Exam = {
      id: Date.now().toString(),
      title: newExam.title,
      description: newExam.description,
      duration: newExam.duration,
      passingScore: newExam.passingScore
    };

    // Save to list of saved exams
    setSavedExams([...savedExams, exam]);
    
    // Set as current exam
    setExamDetails(exam);
    setSections([{
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      title: "Section 1",
      questions: [],
      isExpanded: true
    }]);
    
    // Save to localStorage
    localStorage.setItem(CURRENT_EXAM_KEY, JSON.stringify(exam));
    localStorage.setItem(CURRENT_SECTIONS_KEY, JSON.stringify(sections));
    
    setShowNewExamDialog(false);

    // Clear the new exam form state
    setNewExam({
      title: "",
      description: "",
      duration: "",
      passingScore: ""
    });
    localStorage.removeItem(NEW_EXAM_FORM_KEY);

    toast({
      title: "Exam Created",
      description: "Your exam has been created successfully.",
    });
  };

  const handleExamUpdate = (updatedExam: Exam) => {
    // Update the exam in the savedExams list
    setSavedExams(savedExams.map(exam =>
      exam.id === updatedExam.id ? updatedExam : exam
    ));

    // Also update the current exam details if necessary
    if (examDetails?.id === updatedExam.id) {
      setExamDetails(updatedExam);
      
      // Save to localStorage
      localStorage.setItem(CURRENT_EXAM_KEY, JSON.stringify(updatedExam));
    }
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

        // Add the imported exam to saved exams if it doesn't exist
        if (!savedExams.some(exam => exam.title === importedExam.title)) {
          setSavedExams([...savedExams, importedExam]);
        }

        // Set as current exam and open builder
        setExamDetails(importedExam);
        setSections(importedSections);
        
        // Save to localStorage
        localStorage.setItem(CURRENT_EXAM_KEY, JSON.stringify(importedExam));
        localStorage.setItem(CURRENT_SECTIONS_KEY, JSON.stringify(importedSections));

        setShowImportExamDialog(false);

        toast({
          title: "Exam Imported",
          description: `Successfully imported ${importedExam.title}`,
          variant: "default",
        });
      } catch (error) {
        console.error("Error importing exam:", error);
        setImportError("Failed to parse the JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  // Handle back navigation from ExamBuilder
  const handleBackFromExamBuilder = () => {
    setExamDetails(null);
    // Mark as not initial visit so the state can be restored if user refreshes
    localStorage.setItem(INITIAL_VISIT_KEY, "false");
  };

  if (examDetails) {
    return <ExamBuilder
      exam={examDetails}
      imported_sections={sections}
      onBack={handleBackFromExamBuilder}
      onExamUpdated={handleExamUpdate}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-landing overflow-hidden">
      <header className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-blue-200/30 rounded-full"></div>
              <GraduationCap className="h-20 w-20 mx-auto mb-8 text-primary animate-float drop-shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 gradient-text">Exam Architect Portal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto fade-in leading-relaxed">
              Create and manage your exams with ease. Build comprehensive assessments
              with our intuitive exam creation tools.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute top-1/4 left-10 w-10 h-10 bg-blue-200/50 rounded-full blur-xl animate-pulse-soft"></div>
        <div className="hidden md:block absolute bottom-1/3 right-10 w-16 h-16 bg-blue-300/40 rounded-full blur-xl animate-pulse-soft"></div>
      </header>

      <main className="container mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-card p-8 text-center flex flex-col items-center justify-center transition-all hover:shadow-elevation card-hover scale-in">
            <div className="bg-blue-50 p-5 rounded-full mb-6 shadow-soft">
              <PlusCircle className="h-14 w-14 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Create New Exam</h2>
            <p className="text-muted-foreground mb-8 px-4 leading-relaxed">
              Start from scratch and design a new exam with custom sections and questions
            </p>
            <Button
              onClick={() => setShowNewExamDialog(true)}
              size="lg"
              className="btn-hover text-base px-8 py-6 h-auto font-medium rounded-xl"
            >
              Create Exam
            </Button>
          </div>

          <div
            className="bg-white rounded-2xl border shadow-card p-8 text-center flex flex-col items-center justify-center transition-all hover:shadow-elevation card-hover scale-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-green-50 p-5 rounded-full mb-6 shadow-soft">
              <Upload className="h-14 w-14 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Import Exam</h2>
            <p className="text-muted-foreground mb-8 px-4 leading-relaxed">
              Import an existing exam from JSON file to continue working on it
            </p>
            <Button
              onClick={() => setShowImportExamDialog(true)}
              variant="outline"
              size="lg"
              className="btn-hover text-base px-8 py-6 h-auto font-medium rounded-xl border-primary/30 hover:border-primary"
            >
              Import JSON
            </Button>
          </div>
        </div>
      </main>

      {/* New Exam Dialog */}
      <Dialog open={showNewExamDialog} onOpenChange={setShowNewExamDialog}>
        <DialogContent className="sm:max-w-md dialog-animation rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Exam Title</Label>
              <Input
                id="title"
                placeholder="e.g., Computer Science Fundamentals"
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                className="input-underline rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the exam"
                value={newExam.description}
                onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                className="input-underline rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="90"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                  className="input-underline rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passingScore" className="text-sm font-medium">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  placeholder="60"
                  min="0"
                  max="100"
                  value={newExam.passingScore}
                  onChange={(e) => setNewExam({ ...newExam, passingScore: e.target.value })}
                  className="input-underline rounded-lg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewExamDialog(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateExam}
              className="rounded-lg bg-gradient-header hover:shadow-button"
            >
              Create Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Exam Dialog */}
      <Dialog open={showImportExamDialog} onOpenChange={setShowImportExamDialog}>
        <DialogContent className="sm:max-w-md dialog-animation rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Import Exam from JSON</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="examFile" className="text-sm font-medium">
                Upload Exam JSON File
              </Label>
              <Input
                id="examFile"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="input-underline rounded-lg"
              />
              {importError && (
                <p className="text-sm text-red-500 mt-1">{importError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Upload a JSON file with the proper exam structure
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowImportExamDialog(false);
                setImportError(null);
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse-soft"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Index;
