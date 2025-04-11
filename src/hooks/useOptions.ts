import { useCallback, useState, useRef, useEffect } from "react";
import { Option, Section, Question } from "@/types/exam";
import { generateNumericId } from "@/utils/idGenerator";


/**
 * Interface defining the structure for the `useOption` hook's return type.
 */
export interface useOptionProps {
    optionStates: {
        options: Option[];
        deletedOptionId: string[];
    };
    optionActions: {
        handleAddOption: () => void;
        handleRemoveOption: (option: Option) => void;
        handleOptionChange: (option: Option, text: string) => void;
        handleSetCorrect: (option: Option) => void;
        handleSubmit: () => void; // Fixed the typo `handelSubmit` -> `handleSubmit`
    };
    optionSetters: {
        setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
    };
}

/**
 * Default Option Generator
 * @returns {Option} A new default option object
 */
export const defaultOption = () => ({
    id: generateNumericId(4),
    question_id: "",
    text: "",
    isCorrect: false,
    isOptionEdited: false,
    isOptionNew: true,
});

/**
 * Custom Hook for managing options and question generation
 * @param {Function} handleGenerateQuestionWithOption - Function to handle question submission
 */
export const useOption = (
    handleGenerateQuestionWithOption: (options: Option[]) => void,
): useOptionProps => {
    const [deletedOptionId, setDeletedOptionId] = useState<string[]>([]);


    const [options, setOptions] = useState<Option[]>([
        defaultOption(),
        defaultOption(),
    ]);

    const handleAddOption = useCallback(() => {
        setOptions((prevOptions) => [
            ...prevOptions,
            defaultOption(),
        ]);
    }, []);

    const handleRemoveOption = useCallback((option: Option) => {
        setDeletedOptionId(prev => [...prev, option.id]);
        setOptions((prevOptions) => prevOptions.filter(option => option.id !== option.id));
    }, []);

    const handleOptionChange = useCallback((opt: Option, text: string) => {
        setOptions((prevOptions) =>
            prevOptions.map(option =>
                option.id === opt.id
                    ? { ...option, text: text, isOptionEdited: true }
                    : option
            )
        );
    }, []);

    const handleSetCorrect = useCallback((opt: Option) => {
        setOptions((prevOptions) =>
            prevOptions.map(option => {
                const shouldBeCorrect = option.id === opt.id;
                const isEdited = option.isCorrect !== shouldBeCorrect; // only mark as edited if value is changing
                return {
                    ...option,
                    isCorrect: shouldBeCorrect,
                    isOptionEdited: isEdited ? true : option.isOptionEdited,
                };
            })
        );
    }, []);

    const handleSubmit = useCallback(() => {
        handleGenerateQuestionWithOption(options);
        setOptions([defaultOption(), defaultOption()]);

    }, [options, setOptions, handleGenerateQuestionWithOption]);



    return {
        // STATE
        optionStates: {
            options,
            deletedOptionId
        },
        optionSetters: {
            setOptions,
        },
        // ACTIONS
        optionActions: {
            handleAddOption,
            handleRemoveOption,
            handleOptionChange,
            handleSetCorrect,
            handleSubmit,
        }
    };
};