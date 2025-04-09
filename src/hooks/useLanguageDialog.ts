import { useState } from "react";

export interface useLanguageDialogProps {
    showLanguageDialog: boolean;
    selectedLanguage: "english" | "arabic" | null;
    setShowLanguageDialog: React.Dispatch<React.SetStateAction<boolean>>;
    handleLanguageSelected: (language: "english" | "arabic") => void;
}


/**
 * Custom hook to manage the state of the language selection dialog.
 * 
 * @returns An object containing state variables and actions for managing the language dialog.
 */
export const useLanguageDialog = (): useLanguageDialogProps => {
    const [showLanguageDialog, setShowLanguageDialog] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);

    /**
     * Sets the selected language and closes the language dialog.
     * 
     * @param language - The language selected by the user, either 'english' or 'arabic'.
     */
    const handleLanguageSelected = (language: "english" | "arabic"): void => {
        setSelectedLanguage(language);
        setShowLanguageDialog(false);
    };

    return {
        showLanguageDialog,
        selectedLanguage,
        setShowLanguageDialog,
        handleLanguageSelected,
    };
};
