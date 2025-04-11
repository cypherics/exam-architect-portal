import React, { createContext, useContext } from "react";
import { useExamPage } from "@/hooks/useExamPage"; // your existing hook

const ExamPageContext = createContext<ReturnType<typeof useExamPage> | undefined>(undefined);

export const ExamPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useExamPage();
    return (
        <ExamPageContext.Provider value={value}>
            {children}
        </ExamPageContext.Provider>
    );
};

export const useExamPageContext = () => {
    const context = useContext(ExamPageContext);
    if (!context) throw new Error("useExamPageContext must be used within ExamPageProvider");
    return context;
};
