import {Montserrat} from 'next/font/google';
import './globals.css';
import Providers from "@/components/providers/providers";
import {LanguageProvider} from '@/contexts/language-context';
import ToastifyProvider from '@/components/ToastifyProvider';

const inter = Montserrat({subsets: ['latin']});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {



    return (
        <html lang="tr" translate="no">
            <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="content-language" content="tr" />
      </head>
        <body className={inter.className}>
        <LanguageProvider>
            <Providers>
                <ToastifyProvider>
                    {children}
                </ToastifyProvider>
            </Providers>
        </LanguageProvider>
        </body>
        </html>
    );
}