'use client';
import FullscreenLock from "@/components/take/FullscreenLock";
import {ExamProvider} from '@/contexts/ExamContext';

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    return (
        <ExamProvider>
            <FullscreenLock>
                {children}
            </FullscreenLock>
        </ExamProvider>
    );
}