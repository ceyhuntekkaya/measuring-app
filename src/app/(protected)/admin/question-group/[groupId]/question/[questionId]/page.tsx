'use client';


import PageHeader from "@/components/layout/page-header";
import React, { useState } from "react";
import {useGetQuestionById, useUpdateQuestion, useDeleteQuestion} from "@/api/generated/question-management/question-management";
import QuestionForm from "@/components/form/QuestionForm";
import {useParams, useRouter} from "next/navigation";
import type {ApiResponseQuestionDto, CreateQuestionRequest} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPage() {

    const params = useParams();
    const questionId = params.questionId as string;
    const groupId = params.groupId as string;
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const {data} = useGetQuestionById(questionId, {
        query: { enabled: !!questionId }
    });
    const selectedQuestion = (data as ApiResponseQuestionDto)?.data;
    
    const { mutate: updateQuestion, isPending: loading } = useUpdateQuestion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/questions'] });
                queryClient.invalidateQueries({ queryKey: [`/questions/${questionId}`] });
                queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}/questions`] });
                showNotification.success('Soru başarıyla güncellendi!');
                router.push(`/admin/question-group/${groupId}/question`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const { mutate: deleteQuestion, isPending: deleting } = useDeleteQuestion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/questions'] });
                queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}/questions`] });
                showNotification.success('Soru başarıyla silindi!');
                setShowDeleteDialog(false);
                router.push(`/admin/question-group/${groupId}/question`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru silinirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateQuestionRequest) => {
        updateQuestion({ id: questionId, data });
    };

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (questionId) {
            deleteQuestion({ id: questionId });
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader/>

            
            <div className="p-1">
                <QuestionForm 
                    question={selectedQuestion} 
                    onSubmit={handleSubmit} 
                    loading={loading || deleting}
                    onDelete={handleDelete}
                />
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Soruyu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve soru ile ilgili tüm veriler kalıcı olarak silinecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                        >
                            {deleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}