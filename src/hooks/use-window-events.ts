
import { useEffect } from 'react';

interface UseWindowEventsOptions {
  onBeforeUnload?: (event: BeforeUnloadEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

export function useWindowEvents({
  onBeforeUnload,
  onFocus,
  onBlur
}: UseWindowEventsOptions) {
  useEffect(() => {
    if (onBeforeUnload) {
      window.addEventListener('beforeunload', onBeforeUnload);
    }
    
    if (onFocus) {
      window.addEventListener('focus', onFocus);
    }
    
    if (onBlur) {
      window.addEventListener('blur', onBlur);
    }
    
    return () => {
      if (onBeforeUnload) {
        window.removeEventListener('beforeunload', onBeforeUnload);
      }
      
      if (onFocus) {
        window.removeEventListener('focus', onFocus);
      }
      
      if (onBlur) {
        window.removeEventListener('blur', onBlur);
      }
    };
  }, [onBeforeUnload, onFocus, onBlur]);
}
