// hooks/usePublishExam.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { publishExam } from '@/utils/publishExam';
import { ExamDescription, Section } from '@/types/exam';

interface UsePublishExamProps {
    exam: ExamDescription | null;
    sections: Section[];
}

export const usePublishExam = ({ exam, sections }: UsePublishExamProps) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handlePublish = useCallback(async () => {
        if (!exam) return;

        setIsPublishing(true);

        const success = await publishExam({ exam, sections });

        if (success) {
            toast({
                title: 'Exam Published',
                description: 'Your exam has been successfully published.',
            });
            navigate('/');
        } else {
            toast({
                title: 'Publish Failed',
                description: 'Failed to publish your exam. Please try again.',
                variant: 'destructive',
            });
        }

        setIsPublishing(false);
    }, [exam, sections, navigate, toast]);

    return { isPublishing, handlePublish };
};
