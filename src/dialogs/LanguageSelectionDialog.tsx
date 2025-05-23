
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LanguagesIcon } from "lucide-react";
import { useExamPageContext } from "@/context/ExamPageContext";

interface LanguageSelectionDialogProps {
}

const LanguageSelectionDialog: React.FC<LanguageSelectionDialogProps> = ({
}) => {
  const { state, actions, setters } = useExamPageContext();

  return (
    <Dialog open={state.questionStates.showLanguageDialog} onOpenChange={setters.questionSetters.setShowLanguageDialog}>
      <DialogContent className="sm:max-w-md dialog-animation rounded-xl shadow-elevation">
        <DialogHeader className="text-center mb-4">
          <div className="mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 mb-5 shadow-soft animate-pulse-soft">
            <LanguagesIcon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-center gradient-text">Select Question Language</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          <Button
            onClick={() => actions.questionActions.handleLanguageSelected("english")}
            variant="outline"
            className="h-28 text-lg transition-all duration-300 hover:bg-blue-50 hover:border-primary/60 card-hover rounded-xl flex flex-col justify-center"
          >
            <span className="text-xl font-medium">English</span>
            <span className="text-sm text-muted-foreground mt-2">Content in English</span>
          </Button>
          <Button
            onClick={() => actions.questionActions.handleLanguageSelected("arabic")}
            variant="outline"
            className="h-28 text-lg font-noto transition-all duration-300 hover:bg-blue-50 hover:border-primary/60 card-hover rounded-xl flex flex-col justify-center"
          >
            <span className="text-xl font-medium">العربية</span>
            <span className="text-sm text-muted-foreground mt-2">المحتوى باللغة العربية</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionDialog;
