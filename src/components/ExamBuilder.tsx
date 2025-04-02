
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Save, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SectionComponent from "./SectionComponent";
import LanguageSelectionDialog from "./LanguageSelectionDialog";
import QuestionDialog from "./QuestionDialog";

interface Exam {
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
  onBack: () => void;
}

const ExamBuilder: React.FC<ExamBuilderProps> = ({ exam, onBack }) => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "section1",
      title: "Section 1",
      questions: [],
      isExpanded: true
    }
  ]);
  
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);
  const { toast } = useToast();

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section${sections.length + 1}-${Date.now()}`,
        title: `Section ${sections.length + 1}`,
        questions: [],
        isExpanded: true
      }
    ]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const updateSection = (updatedSection: Section) => {
    setSections(sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    ));
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
    
    setShowQuestionDialog(false);
    setSelectedSection(null);
    setSelectedLanguage(null);
    
    toast({
      title: "Question Added",
      description: "Your question has been successfully added to the section.",
    });
  };

  const saveExam = () => {
    // Create JSON representation of the exam
    const examData = {
      ...exam,
      sections: sections.map(section => ({
        id: section.id,
        title: section.title,
        questions: section.questions.map(q => ({
          id: q.id,
          language: q.language,
          text: q.text,
          description: q.description,
          marks: q.marks,
          options: q.options
        }))
      }))
    };
    
    // For demo purposes, we're showing the JSON
    const jsonStr = JSON.stringify(examData, null, 2);
    
    // Show success message with data
    toast({
      title: "Exam Saved",
      description: "Your exam has been successfully saved.",
    });
    
    // Open a new dialog to display the JSON
    const jsonWindow = window.open("", "_blank");
    if (jsonWindow) {
      jsonWindow.document.write(`
        <html>
          <head>
            <title>Exam JSON Data</title>
            <style>
              body { 
                font-family: monospace;
                padding: 20px;
                background-color: #f5f5f5;
              }
              pre {
                background-color: white;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: auto;
              }
            </style>
          </head>
          <body>
            <h2>Exam JSON Data</h2>
            <pre>${jsonStr}</pre>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                {exam.duration} minutes • Passing score: {exam.passingScore}%
              </p>
            </div>
          </div>
          <Button onClick={saveExam} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Exam
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Exam Description</h2>
          <p className="text-muted-foreground">{exam.description}</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Exam Sections</h2>
          <Button onClick={addSection} variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map(section => (
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
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No sections added yet.</p>
            <Button onClick={addSection} variant="outline" className="flex items-center gap-2 mx-auto">
              <PlusCircle className="h-4 w-4" />
              Add First Section
            </Button>
          </div>
        )}
      </main>
      
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
