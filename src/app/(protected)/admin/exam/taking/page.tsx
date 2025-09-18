// components/exam/ExamLoginPage.tsx

'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Loader2} from 'lucide-react';
import {useExamTaking} from "@/hooks/exam/use-exam-taking";

export default function ExamLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

    const validateFields = () => {
        const errors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            errors.username = 'Kullanıcı adı gereklidir';
        }

        if (!password.trim()) {
            errors.password = 'Şifre gereklidir';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const {
        loginWithCredentials,
        application
    } = useExamTaking();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }
        setLoading(true);
        loginWithCredentials({
            username: username.trim(),
            password: password.trim()
        })
        setLoading(false);

    };



    useEffect(() => {
        if (application) {
            router.push('/admin/exam/taking/welcome');
        }
    }, [application]);


    console.log(application)

    const handleInputChange = (field: 'username' | 'password', value: string) => {
        if (field === 'username') {
            setUsername(value);
            if (fieldErrors.username) {
                setFieldErrors(prev => ({...prev, username: undefined}));
            }
        } else {
            setPassword(value);
            if (fieldErrors.password) {
                setFieldErrors(prev => ({...prev, password: undefined}));
            }
        }

        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Sınav Sistemi
                    </CardTitle>
                    <p className="text-gray-600">
                        Giriş yapmak için bilgilerinizi giriniz
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Kullanıcı Adı
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                placeholder="Kullanıcı adınızı giriniz"
                                className={fieldErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                disabled={loading}
                                autoComplete="username"
                                autoFocus
                            />
                            {fieldErrors.username && (
                                <p className="text-sm text-red-600">{fieldErrors.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Şifrenizi giriniz"
                                className={fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            {fieldErrors.password && (
                                <p className="text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Sınav sistemi güvenli bir ortamda çalışmaktadır.
                            <br/>
                            Giriş bilgilerinizi kimseyle paylaşmayınız.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}