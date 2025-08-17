'use client';
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";

export default function QuestionGroupTypeAdd() {
    return (
        <div className="space-y-6">
            <QuestionGroupTypeForm onSubmit={() => {
            }} examSections={[]}/>
        </div>
    )
}