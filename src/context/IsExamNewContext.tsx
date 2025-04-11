import React, { createContext, useContext, useState, ReactNode } from 'react';

type IsExamNewContextType = {
    isExamNew: boolean;
    setIsNewExam: (value: boolean) => void;
};

const IsExamNewContext = createContext<IsExamNewContextType | undefined>(undefined);

export const IsExamNewProvider = ({ children }: { children: ReactNode }) => {
    const [isExamNew, setIsNewExam] = useState<boolean>(true);

    return (
        <IsExamNewContext.Provider value={{ isExamNew, setIsNewExam }}>
            {children}
        </IsExamNewContext.Provider>
    );
};

export const useIsExamNew = (): IsExamNewContextType => {
    const context = useContext(IsExamNewContext);
    if (!context) {
        throw new Error('useIsExamNew must be used within an IsExamNewProvider');
    }
    return context;
};
