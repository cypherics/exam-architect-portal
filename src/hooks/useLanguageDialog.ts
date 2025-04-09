import { useState } from "react";

export const useLanguageDialog = () => {
    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | null>(null);

    const handleLanguageSelected = (language: "english" | "arabic") => {
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
