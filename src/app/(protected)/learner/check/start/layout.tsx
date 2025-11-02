'use client';
import FullscreenLock from "@/components/take/FullscreenLock";

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    return (
        <FullscreenLock>
            {children}
        </FullscreenLock>
    );


}