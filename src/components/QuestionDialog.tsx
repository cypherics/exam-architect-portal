
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Check } from "lucide-react";
import { Question } from "./ExamBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [options, setOptions] = useState<{ id: string; text: string; isCorrect: boolean }[]>([
    { id: `${Math.floor(1000 + Math.random() * 9000)}`, text: "", isCorrect: false },
    { id: `${Math.floor(1000 + Math.random() * 9000)}`, text: "", isCorrect: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference to the latest added option input
  const lastOptionRef = useRef<HTMLInputElement>(null);
  const initialInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus on the question textarea when the dialog opens
  useEffect(() => {
    if (open && initialInputRef.current) {
      setTimeout(() => {
        initialInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Focus on the last added option
  useEffect(() => {
    if (open && lastOptionRef.current) {
      lastOptionRef.current.focus();
    }
  }, [options.length, open]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: `${Math.floor(1000 + Math.random() * 9000)}`,
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

    setIsSubmitting(true);

    const question: Question = {
      id: `${Math.floor(1000 + Math.random() * 9000)}`,
      language,
      text,
      description,
      marks: parseInt(marks) || 1,
      options: [...options]
    };


    // Simulate a short delay to show loading state
    setTimeout(() => {

      onAddQuestion(question);

      // Reset form
      setText("");
      setDescription("");
      setMarks("1");
      setOptions([
        { id: `${Math.floor(1000 + Math.random() * 9000)}`, text: "", isCorrect: false },
        { id: `${Math.floor(1000 + Math.random() * 9000)}`, text: "", isCorrect: false }
      ]);
      setIsSubmitting(false);
    }, 400);
  };

  const isRtl = language === "arabic";
  const dirClass = isRtl ? "rtl" : "";
  const fontClass = isRtl ? "font-noto" : "";

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`sm:max-w-md lg:max-w-2xl ${dirClass} ${fontClass} p-6 shadow-elevation animate-in fade-in-0 zoom-in-95 data-[state=open]:slide-in-from-bottom-1 rounded-xl`}
          aria-labelledby="question-dialog-title"
        >
          <DialogHeader>
            <DialogTitle id="question-dialog-title" className="text-xl font-bold gradient-text">
              {language === "english" ? "Add New Question" : "إضافة سؤال جديد"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="grid gap-5 py-4 px-2 sm:px-6 md:px-8 lg:px-10">
              {/* Question Section */}
              <div className="grid gap-2">
                <Label htmlFor="question" className="text-base">
                  {language === "english" ? "Question" : "السؤال"}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Textarea
                  id="question"
                  ref={initialInputRef}
                  placeholder={language === "english" ? "Enter your question here" : "أدخل سؤالك هنا"}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`min-h-24 input-underline rounded-lg border-b-2 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-sm text-base ${dirClass} ${fontClass}`}
                  aria-required="true"
                />
              </div>

              {/* Description Section */}
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-base">
                  {language === "english" ? "Description (Optional)" : "الوصف (اختياري)"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={language === "english" ? "Additional information about the question" : "معلومات إضافية عن السؤال"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`min-h-16 input-underline rounded-lg border-b-2 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-sm ${dirClass} ${fontClass}`}
                />
              </div>

              {/* Answer Options Section */}
              <div>
                <Label className="mb-3 block text-base">
                  {language === "english" ? "Answer Options" : "خيارات الإجابة"}
                  <span className="text-destructive ml-1">*</span>
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center group">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={option.isCorrect ? "default" : "outline"}
                            size="sm"
                            className={`w-10 h-10 p-0 flex-shrink-0 transition-all duration-300 ${option.isCorrect
                              ? "bg-green-600 hover:bg-green-700 shadow-sm"
                              : "hover:border-red-400 hover:text-red-500"
                              }`}
                            onClick={() => handleSetCorrect(option.id)}
                            aria-label={option.isCorrect ? "Correct answer" : "Mark as correct"}
                          >
                            {option.isCorrect ? <Check className="h-5 w-5" /> : String.fromCharCode(65 + index)}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {option.isCorrect
                            ? (language === "english" ? "Correct answer" : "الإجابة الصحيحة")
                            : (language === "english" ? "Mark as correct" : "حدد كإجابة صحيحة")}
                        </TooltipContent>
                      </Tooltip>

                      <Input
                        ref={index === options.length - 1 ? lastOptionRef : null}
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        placeholder={language === "english" ? `Option ${index + 1}` : `الخيار ${index + 1}`}
                        className={`input-underline rounded-lg border-b-2 shadow-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base ${dirClass} ${fontClass}`}
                        aria-required="true"
                      />

                      {options.length > 2 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveOption(option.id)}
                              aria-label={language === "english" ? "Remove option" : "إزالة الخيار"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {language === "english" ? "Remove option" : "إزالة الخيار"}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm flex items-center justify-center"
                  onClick={handleAddOption}
                  disabled={options.length >= 6 || isSubmitting}
                  aria-label={language === "english" ? "Add option" : "إضافة خيار"}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {language === "english" ? "Add Option" : "إضافة خيار"}
                </Button>
              </div>

              {/* Marks Section */}
              <div className="grid gap-2">
                <Label htmlFor="marks" className="text-base">
                  {language === "english" ? "Marks" : "الدرجات"}
                </Label>
                <Input
                  id="marks"
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className={`w-28 rounded-lg input-underline border-b-2 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${dirClass} ${fontClass}`}
                  aria-label={language === "english" ? "Question marks" : "درجات السؤال"}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className={`mt-4 ${isRtl ? "flex-row-reverse" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-24 min-h-10 text-base transition-all duration-300 rounded-lg"
              disabled={isSubmitting}
            >
              {language === "english" ? "Cancel" : "إلغاء"}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="min-w-32 min-h-10 text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-lg bg-gradient-header"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === "english" ? "Adding..." : "جاري الإضافة..."}
                </span>
              ) : (
                language === "english" ? "Add Question" : "إضافة السؤال"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default QuestionDialog;
