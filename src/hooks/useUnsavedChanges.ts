import { useState, useCallback } from 'react';

/**
 * Custom hook to track unsaved changes
 * It manages the state of unsaved changes and provides a callback to notify the parent.
 */
export const useUnsavedChanges = (onUnsavedChanges: (hasChanges: boolean) => void) => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const setUnsaved = useCallback((hasChanges: boolean) => {
        setUnsavedChanges(hasChanges);
        onUnsavedChanges(hasChanges); // Notify parent about changes
    }, [onUnsavedChanges]);

    return {
        unsavedChanges,
        setUnsaved,
    };
};
