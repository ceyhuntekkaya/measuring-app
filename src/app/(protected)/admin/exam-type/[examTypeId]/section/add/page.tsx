'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";

export default function ExamSectionAdd() {
    return (
        <div className="space-y-6">
            <ExamSectionForm onSubmit={() => {
            }} examTypes={[]}/>
        </div>
    )
}