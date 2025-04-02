
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Question Language</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          <Button 
            onClick={() => onLanguageSelect("english")} 
            variant="outline" 
            className="h-24 text-lg"
          >
            English
          </Button>
          <Button 
            onClick={() => onLanguageSelect("arabic")} 
            variant="outline" 
            className="h-24 text-lg font-noto"
          >
            العربية
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionDialog;
