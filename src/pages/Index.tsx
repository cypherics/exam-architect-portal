
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, FileEdit, GraduationCap } from "lucide-react";
import ExamBuilder from "@/components/ExamBuilder";
import { useToast } from "@/components/ui/use-toast";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: string;
  passingScore: string;
}

const Index = () => {
  const [showNewExamDialog, setShowNewExamDialog] = useState(false);
  const [showSelectExamDialog, setShowSelectExamDialog] = useState(false);
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const { toast } = useToast();
  const [savedExams, setSavedExams] = useState<Exam[]>([
    { id: "1", title: "Computer Science Fundamentals", description: "Basic concepts of CS", duration: "90", passingScore: "70" },
    { id: "2", title: "Data Structures", description: "Advanced data structures", duration: "120", passingScore: "65" }
  ]);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: "",
    passingScore: ""
  });

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
    
    setSavedExams([...savedExams, exam]);
    setExamDetails(exam);
    setShowNewExamDialog(false);
    
    toast({
      title: "Exam Created",
      description: "Your exam has been created successfully.",
    });
  };

  const handleSelectExam = (exam: Exam) => {
    setExamDetails(exam);
    setShowSelectExamDialog(false);
    
    toast({
      title: "Exam Selected",
      description: "You are now editing " + exam.title,
    });
  };

  if (examDetails) {
    return <ExamBuilder exam={examDetails} onBack={() => setExamDetails(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-70"></div>
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-primary animate-bounce" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4 fade-in">Exam Architect Portal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto fade-in">
              Create and manage your exams with ease. Build comprehensive assessments 
              with our intuitive exam creation tools.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border shadow-sm p-8 text-center flex flex-col items-center justify-center transition-all hover:shadow-md card-hover scale-in">
            <div className="bg-blue-50 p-4 rounded-full mb-6">
              <PlusCircle className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Create New Exam</h2>
            <p className="text-muted-foreground mb-6 px-4">
              Start from scratch and design a new exam with custom sections and questions
            </p>
            <Button 
              onClick={() => setShowNewExamDialog(true)} 
              size="lg" 
              className="btn-hover"
            >
              Create Exam
            </Button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-8 text-center flex flex-col items-center justify-center transition-all hover:shadow-md card-hover scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-indigo-50 p-4 rounded-full mb-6">
              <FileEdit className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Edit Existing Exam</h2>
            <p className="text-muted-foreground mb-6 px-4">
              Modify or update your previously created exams with new content
            </p>
            <Button 
              onClick={() => setShowSelectExamDialog(true)} 
              variant="outline" 
              size="lg"
              disabled={savedExams.length === 0}
              className="btn-hover"
            >
              Select Exam
            </Button>
            {savedExams.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">No saved exams</p>
            )}
          </div>
        </div>
      </main>

      {/* New Exam Dialog */}
      <Dialog open={showNewExamDialog} onOpenChange={setShowNewExamDialog}>
        <DialogContent className="sm:max-w-md dialog-animation">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Computer Science Fundamentals" 
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                className="input-underline"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                placeholder="Brief description of the exam" 
                value={newExam.description}
                onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                className="input-underline"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  placeholder="90" 
                  value={newExam.duration}
                  onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                  className="input-underline"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input 
                  id="passingScore" 
                  type="number" 
                  placeholder="60" 
                  min="0" 
                  max="100" 
                  value={newExam.passingScore}
                  onChange={(e) => setNewExam({...newExam, passingScore: e.target.value})}
                  className="input-underline"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewExamDialog(false)}
              className="btn-hover"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateExam}
              className="btn-hover"
            >
              Create Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Exam Dialog */}
      <Dialog open={showSelectExamDialog} onOpenChange={setShowSelectExamDialog}>
        <DialogContent className="sm:max-w-md dialog-animation">
          <DialogHeader>
            <DialogTitle className="text-xl">Select an Exam to Edit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {savedExams.map((exam, index) => (
              <div 
                key={exam.id} 
                className="flex items-center justify-between p-4 border rounded-md mb-3 hover:bg-muted/50 cursor-pointer transition-all duration-200 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleSelectExam(exam)}
              >
                <div>
                  <h3 className="font-medium">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground">{exam.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-hover"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
