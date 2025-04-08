
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExamDescription } from "@/types/exam";
import { useExamForm } from "@/hooks/useExamForm";

interface ExamFormProps {
    exam: ExamDescription;
    onChange: (exam: ExamDescription) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const ExamForm: React.FC<ExamFormProps> = (props) => {
    const { exam } = props;
    const { actions } = useExamForm(props);

    return (
        <div className="grid gap-5 py-4">
            <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">Exam Title</Label>
                <Input
                    id="title"
                    placeholder="e.g., Computer Science Fundamentals"
                    value={exam.title}
                    onChange={(e) => actions.handleTitleChange(e.target.value)}
                    className="input-underline rounded-lg"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Input
                    id="description"
                    placeholder="Brief description of the exam"
                    value={exam.description}
                    onChange={(e) => actions.handleDescriptionChange(e.target.value)}
                    className="input-underline rounded-lg"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                    <Input
                        id="duration"
                        type="number"
                        placeholder="90"
                        value={exam.duration}
                        onChange={(e) => actions.handleDurationChange(e.target.value)}
                        className="input-underline rounded-lg"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="passingScore" className="text-sm font-medium">Passing Score (%)</Label>
                    <Input
                        id="passingScore"
                        type="number"
                        placeholder="60"
                        min="0"
                        max="100"
                        value={exam.passingScore}
                        onChange={(e) => actions.handlePassingScoreChange(e.target.value)}
                        className="input-underline rounded-lg"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={actions.onCancel} className="rounded-lg">Cancel</Button>
                <Button type="button" onClick={actions.onSubmit} className="rounded-lg bg-gradient-header hover:shadow-button">Create Exam</Button>
            </div>
        </div>
    );
};

export default ExamForm;
