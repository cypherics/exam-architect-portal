import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { publishExam } from '@/utils/publishExam';
import { useExamPageProps } from "@/hooks/useExamPage";

interface UsePublishExamProps {
    state: useExamPageProps["state"];
    isExamNew: boolean;
}

export const usePublishExam = ({ state, isExamNew }: UsePublishExamProps) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const showSuccessToast = () => {
        toast({
            title: 'Exam Published',
            description: 'Your exam has been successfully published.',
        });
    };

    const showFailureToast = () => {
        toast({
            title: 'Publish Failed',
            description: 'Failed to publish your exam. Please try again.',
            variant: 'destructive',
        });
    };

    const handlePublish = useCallback(async (): Promise<void> => {
        if (!state.currentExam) return;

        setIsPublishing(true);

        try {
            const success = await publishExam({ state, isExamNew });

            if (success) {
                showSuccessToast();
                navigate('/');
            } else {
                showFailureToast();
            }
        } catch (err) {
            console.error('Unexpected error during publish:', err);
            showFailureToast();
        } finally {
            setIsPublishing(false);
        }
    }, [state, isExamNew, navigate, toast]);

    return { isPublishing, handlePublish };
};
