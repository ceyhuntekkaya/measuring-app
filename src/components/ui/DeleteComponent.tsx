'use client';

import { useState } from 'react';

interface DeleteComponentProps {
    itemName: string;
    onDelete: () => void | Promise<void>;
}

export default function DeleteComponent({ itemName, onDelete }: DeleteComponentProps) {
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await Promise.resolve(onDelete());
            setShowModal(false);
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
        } finally {
            setIsDeleting(false);
        }
    };


    console.log("showModal", showModal)
    console.log("isDeleting", isDeleting)

    return (
        <>
            {/* Silme Butonu */}
            <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
                Sil
            </button>

            {/* Onay Modalı */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Silme İşlemini Onayla
                        </h3>
                        <p className="text-gray-600 mb-6">
                            <strong>{itemName}</strong> öğesini silmek istediğinizden emin misiniz?
                            Bu işlem geri alınamaz.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Siliniyor...
                                    </>
                                ) : (
                                    'Sil'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Kullanım örneği:
/*
function MyPage() {
  const handleDeleteItem = async () => {
    // API çağrısı veya silme işlemi
    await fetch('/api/items/123', { method: 'DELETE' });
    // Başarılı silme sonrası işlemler (örn: state güncelleme)
  };

  return (
    <div>
      <DeleteComponent
        itemName="Kullanıcı Hesabı"
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
*/