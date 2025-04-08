
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    Clock,
    CheckCircle2,
} from "lucide-react";

import { ExamDescription } from "@/types/exam";



interface ExamBuilderProps {
    exam: ExamDescription;
}


const ExamHeader: React.FC<ExamBuilderProps> = ({ exam }) => {
    return (

        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
                        <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{exam.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Passing score: {exam.passingScore}%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default ExamHeader;
