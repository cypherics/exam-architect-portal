// components/PublishButton/PublishButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { usePublishExam } from '@/hooks/usePublishExam';
import { PublishOverlay } from '@/components/PublishOverlay'; // Assuming it's a reusable overlay component
import { Question, Section, ExamDescription } from "@/types/exam";

interface PublishButtonProps {
    exam: ExamDescription | null;
    sections: Section[];
}

const PublishButton: React.FC<PublishButtonProps> = ({ exam, sections }) => {
    const { isPublishing, handlePublish } = usePublishExam({ exam, sections });

    return (
        <>
            <Button
                onClick={handlePublish}
                disabled={isPublishing || !exam}
                aria-label="Publish exam"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white font-medium shadow-md hover:shadow-lg"
            >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                Publish
            </Button>

            {isPublishing && <PublishOverlay />}
        </>
    );
};

export default PublishButton;
