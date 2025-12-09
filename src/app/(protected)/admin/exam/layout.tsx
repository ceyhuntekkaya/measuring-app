'use client';
import FullscreenLock from "@/components/take/FullscreenLock";
import {ExamProvider} from '@/contexts/ExamContext';
import siteConfig from "@/config/config.json";

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const isFullScreenRequired = siteConfig.api.fullScreenExam ?? true;

    return (
        <ExamProvider>
            {isFullScreenRequired ? (
                <FullscreenLock>
                    {children}
                </FullscreenLock>
            ) : (
                children
            )}
        </ExamProvider>
    );
}