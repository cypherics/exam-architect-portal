
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExamForm } from "@/components/Exam";
import ImportExamDialog from "@/components/Exam/ImportExamDialog";
import { PlusCircle, FileEdit, GraduationCap, Upload } from "lucide-react";
import { useIndexPage } from "@/hooks/useIndexPage";

/**
 * Landing page component for the exam creator application
 * Provides options to create new exams or import existing ones
 */
const Index: React.FC = () => {
  const {
    state: { examDetails, sections, importError, showNewExamDialog, showImportExamDialog },
    actions: { createExam, handleFileChange },
    setters: { setExamDetails, setShowNewExamDialog, setShowImportExamDialog }
  } = useIndexPage();

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

        <div className="hidden md:block absolute top-1/4 left-10 w-10 h-10 bg-blue-200/50 rounded-full blur-xl animate-pulse-soft"></div>
        <div className="hidden md:block absolute bottom-1/3 right-10 w-16 h-16 bg-blue-300/40 rounded-full blur-xl animate-pulse-soft"></div>
      </header>

      {/* Main Content */}
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

      {/* Dialogs */}
      <Dialog open={showNewExamDialog} onOpenChange={setShowNewExamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <ExamForm
            exam={examDetails}
            onChange={setExamDetails}
            onSubmit={() => createExam(examDetails)}
            onCancel={() => setShowNewExamDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <ImportExamDialog
        open={showImportExamDialog}
        onOpenChange={setShowImportExamDialog}
        onFileImport={handleFileChange}
        importError={importError}
      />
    </div>
  );
};

export default Index;
