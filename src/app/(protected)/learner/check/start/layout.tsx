'use client';
import FullscreenLock from "@/components/take/FullscreenLock";
import siteConfig from "@/config/config.json";

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const isFullScreenRequired = siteConfig.api.fullScreenExam ?? true;

    if (!isFullScreenRequired) {
        return <>{children}</>;
    }

    return (
        <FullscreenLock>
            {children}
        </FullscreenLock>
    );
}