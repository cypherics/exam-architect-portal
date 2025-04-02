
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LanguagesIcon } from "lucide-react";

interface LanguageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLanguageSelect: (language: "english" | "arabic") => void;
}

const LanguageSelectionDialog: React.FC<LanguageSelectionDialogProps> = ({
  open,
  onOpenChange,
  onLanguageSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dialog-animation">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full p-3 mb-4">
            <LanguagesIcon className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">Select Question Language</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          <Button 
            onClick={() => onLanguageSelect("english")} 
            variant="outline" 
            className="h-24 text-lg transition-all duration-300 hover:bg-blue-50 hover:border-primary card-hover"
          >
            English
          </Button>
          <Button 
            onClick={() => onLanguageSelect("arabic")} 
            variant="outline" 
            className="h-24 text-lg font-noto transition-all duration-300 hover:bg-blue-50 hover:border-primary card-hover"
          >
            العربية
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionDialog;
