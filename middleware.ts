import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {isPathAllowed} from '@/config/routes';
import {jwtDecode} from 'jwt-decode';
import {Department, Role, User} from "@/types/auth";
import {Brand} from "@/types/brand";

interface DecodedToken {
    user: User;
    departments: Department[];
    roles: Role[];
    authorities: Permissions[];
    brands: Brand[];
    user_id: string;
    email: string;
    exp: number;
}

// Korunmayan path'leri bir array'de toparlayalım
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/api/auth/login',  // Auth API endpoint'leri için izin ver
    '/api/auth/refresh'  // Token yenileme için izin ver
];

// Path'in public olup olmadığını kontrol eden helper fonksiyon
const isPublicPath = (path: string): boolean => {
    return PUBLIC_PATHS.includes(path) ||
        path.startsWith('/_next') ||
        path.startsWith('/static') ||
        path.startsWith('/api/auth/');
};

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    console.log('Middleware - Checking path:', pathname);

    // Public path kontrolü
    if (isPublicPath(pathname)) {
        console.log('Middleware - Public path, allowing access:', pathname);
        return NextResponse.next();
    }

    const token = request.cookies.get('accessToken')?.value;

    // Token yoksa login'e yönlendir
    if (!token) {
        console.log('Middleware - No token, redirecting to login from', pathname);
        const loginUrl = new URL('/login', request.url);

        // Orijinal hedef URL'i parametre olarak ekle, giriş yaptıktan sonra kullanıcıyı geri yönlendirmek için
        loginUrl.searchParams.set('redirectTo', pathname);

        return NextResponse.redirect(loginUrl);
    }

    try {
        // Token'ı decode et
        const decoded = jwtDecode<DecodedToken>(token);

        // Token expired kontrolü
        if (decoded.exp * 1000 < Date.now()) {
            console.log('Middleware - Token expired, redirecting to login');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const user = decoded.user;
        const brands = decoded.brands;
        const departments = decoded.departments;
        const roles = decoded.roles;
        const authorities = decoded.authorities;

        // Yetki kontrolü
        if (!isPathAllowed(pathname, roles)) {
            console.log('Middleware - Unauthorized access attempt:', {
                path: pathname,
                departments: departments,
                brands: brands,
                roles: roles,
                authorities: authorities,
                user: user
            });

            // Kullanıcının rolüne göre yönlendirme yap


            const redirectPath = roles.includes('ADMIN') ? '/admin' :
                roles.includes('USER') ? '/admin' :
                    roles.includes('LEARNER') ? '/learner' :
                        roles.includes('INSTRUCTOR') ? '/instructor' :
                            roles.includes('OBSERVER') ? '/observer' :
                        roles.includes('COMPANY') ? '/company' :
                            '/app';

            console.log(`Middleware - Redirecting to proper role path: ${redirectPath}`);
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // Tüm kontroller geçti, erişim izni ver
        console.log('Middleware - Access granted to:', pathname);
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware - Token validation failed:', error);

        // Token doğrulaması başarısız, oturumu temizle ve login'e yönlendir
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        return response;
    }
}

export const config = {
    // Middleware'ın çalışacağı path'leri belirle
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};