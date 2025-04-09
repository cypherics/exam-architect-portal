
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface NavigationDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Custom confirmation dialog shown when user attempts to navigate away from the app
 */
const NavigationDialog: React.FC<NavigationDialogProps> = ({
    open,
    onConfirm,
    onCancel
}) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-base text-gray-700">
                        Changes will be lost. Are you sure you want to leave?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Leave Page
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default NavigationDialog;