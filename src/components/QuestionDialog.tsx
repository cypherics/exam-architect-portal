
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Check } from "lucide-react";
import { Question } from "./ExamBuilder";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuestion: (question: Question) => void;
  language: "english" | "arabic";
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onOpenChange,
  onAddQuestion,
  language,
}) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [marks, setMarks] = useState("1");
  const [options, setOptions] = useState<{id: string; text: string; isCorrect: boolean}[]>([
    { id: "opt1", text: "", isCorrect: false },
    { id: "opt2", text: "", isCorrect: false }
  ]);

  const handleAddOption = () => {
    setOptions([
      ...options, 
      { 
        id: `opt${options.length + 1}-${Date.now()}`, 
        text: "", 
        isCorrect: false 
      }
    ]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSetCorrect = (id: string) => {
    setOptions(options.map(option => 
      ({ ...option, isCorrect: option.id === id })
    ));
  };

  const handleSubmit = () => {
    // Validation
    if (!text.trim()) {
      return;
    }
    
    if (!options.some(opt => opt.isCorrect)) {
      return;
    }
    
    if (options.some(opt => !opt.text.trim())) {
      return;
    }
    
    const question: Question = {
      id: `question-${Date.now()}`,
      language,
      text,
      description,
      marks: parseInt(marks) || 1,
      options: [...options]
    };
    
    onAddQuestion(question);
    
    // Reset form
    setText("");
    setDescription("");
    setMarks("1");
    setOptions([
      { id: "opt1", text: "", isCorrect: false },
      { id: "opt2", text: "", isCorrect: false }
    ]);
  };

  const isRtl = language === "arabic";
  const dirClass = isRtl ? "rtl" : "";
  const fontClass = isRtl ? "font-noto" : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-2xl ${dirClass} ${fontClass}`}>
        <DialogHeader>
          <DialogTitle>
            {language === "english" ? "Add New Question" : "إضافة سؤال جديد"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="question">
              {language === "english" ? "Question" : "السؤال"}
            </Label>
            <Textarea 
              id="question" 
              placeholder={language === "english" ? "Enter your question here" : "أدخل سؤالك هنا"} 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`min-h-24 ${dirClass} ${fontClass}`}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">
              {language === "english" ? "Description (Optional)" : "الوصف (اختياري)"}
            </Label>
            <Textarea 
              id="description" 
              placeholder={language === "english" ? "Additional information about the question" : "معلومات إضافية عن السؤال"} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-h-16 ${dirClass} ${fontClass}`}
            />
          </div>
          
          <div>
            <Label className="mb-2 block">
              {language === "english" ? "Answer Options" : "خيارات الإجابة"}
            </Label>
            
            <div className="space-y-3 mb-4">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-center">
                  <Button
                    type="button"
                    variant={option.isCorrect ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 flex-shrink-0"
                    onClick={() => handleSetCorrect(option.id)}
                  >
                    {option.isCorrect ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + index)}
                  </Button>
                  
                  <Input 
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={language === "english" ? `Option ${index + 1}` : `الخيار ${index + 1}`}
                    className={dirClass + " " + fontClass}
                  />
                  
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAddOption}
              disabled={options.length >= 6}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {language === "english" ? "Add Option" : "إضافة خيار"}
            </Button>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="marks">
              {language === "english" ? "Marks" : "الدرجات"}
            </Label>
            <Input 
              id="marks" 
              type="number"
              min="1"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className={`w-24 ${dirClass} ${fontClass}`}
            />
          </div>
        </div>
        
        <DialogFooter className={isRtl ? "flex-row-reverse" : ""}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {language === "english" ? "Cancel" : "إلغاء"}
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {language === "english" ? "Add Question" : "إضافة السؤال"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
