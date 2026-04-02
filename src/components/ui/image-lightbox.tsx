import React from "react";
import ModalPanel from "@/components/ui/ModalPanel";

type ImageLightboxProps = {
  src?: string | null;
  alt?: string;
  title?: string;
  children: React.ReactNode;
};

export default function ImageLightbox({
  src,
  alt = "image",
  title = "Görsel Önizleme",
  children,
}: ImageLightboxProps) {
  const [open, setOpen] = React.useState(false);

  if (!src) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        className="block text-left"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <ModalPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        cancelText={null}
        confirmText={null}
        size="large"
      >
        <div className="w-full">
          <div className="flex items-center justify-end mb-3">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Yeni sekmede aç
            </a>
          </div>

          <div className="w-full flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg border bg-white"
            />
          </div>
        </div>
      </ModalPanel>
    </>
  );
}

