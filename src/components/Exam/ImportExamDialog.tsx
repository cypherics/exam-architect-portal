
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useImportExamDialog } from "@/hooks/useImportExamDialog";

interface ImportExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  importError: string | null;
}

const ImportExamDialog: React.FC<ImportExamDialogProps> = ({
  open,
  onOpenChange,
  onFileImport,
  importError,
}) => {
  const { refs, actions } = useImportExamDialog({ onFileImport });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Exam</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto mb-4 bg-blue-50 p-3 rounded-full inline-flex">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag & Drop or Select a File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import a JSON file containing an exam structure
            </p>
            <input
              ref={refs.fileInputRef}
              type="file"
              accept=".json"
              onChange={actions.onFileImport}
              className="hidden"
            />
            <Button onClick={actions.handleButtonClick} className="w-full">
              Select JSON File
            </Button>
            {importError && (
              <p className="text-sm text-red-500 mt-4">{importError}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExamDialog;
