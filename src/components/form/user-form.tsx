'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import {Permission, Department, Role, PermissionList, DepartmentList} from "@/types/auth";
import type {UserDto, BrandDto, CreateUserRequest, UpdateUserRequest, CreateUserRequestAuthoritySetItem, CreateUserRequestDepartmentSetItem, CreateUserRequestRoleSetItem} from "@/api/generated/model";
import {departmentConverter, permissionConverter, roleConverter} from "@/utils/name-converter";

interface UserFormErrors {
    username?: string;
    password?: string;
    email?: string;
    name?: string;
    lastName?: string;
    mobilePhone?: string;
    identityNumber?: string;
    authoritySet?: string;
    departmentSet?: string;
    brandSet?: string;
    roleSet?: string;
}

interface UserFormProps {
    onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
    user?: UserDto | null;
    loading?: boolean;
    brands: BrandDto[];
    onUsernameCheck?: (username: string) => Promise<boolean>; // true if available
    onPasswordReset?: (userId: string) => Promise<void>; // şifre yenileme fonksiyonu
}

const generateActivationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const UserForm: React.FC<UserFormProps> = ({
                                               onSubmit,
                                               user,
                                               loading = false,
                                               brands,
                                               onUsernameCheck,
                                               onPasswordReset
                                           }) => {
    // Use ORVAL Request types - but keep local arrays for Permission[], Department[], Role[]
    // These will be converted to Request types on submit
    const [formData, setFormData] = useState<CreateUserRequest>({
        username: '',
        password: '',
        email: '',
        name: '',
        lastName: '',
        mobilePhone: '',
        identityNumber: '',
        brandSet: [],
        departmentSet: [],
        roleSet: [],
        authoritySet: [],
        enabled: true,
        credentialsNonExpired: true,
        accountNonLocked: true,
        accountNonExpired: true,
        activationCode: generateActivationCode()
    });
    
    // Local state for arrays that need conversion
    const [authoritySet, setAuthoritySet] = useState<Permission[]>([]);
    const [departmentSet, setDepartmentSet] = useState<Department[]>([]);
    const [roleSet, setRoleSet] = useState<Role[]>([]);

    const [errors, setErrors] = useState<UserFormErrors>({});
    const [usernameChecking, setUsernameChecking] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                password: '', // Always empty for edit
                email: user.email || '',
                name: user.name || '',
                lastName: user.lastName || '',
                mobilePhone: user.mobilePhone || '',
                identityNumber: user.identityNumber || '',
                brandSet: user.brandSet || [],
                departmentSet: [],
                roleSet: [],
                authoritySet: [],
                enabled: user.enabled ?? true,
                credentialsNonExpired: user.credentialsNonExpired ?? true,
                accountNonLocked: user.accountNonLocked ?? true,
                accountNonExpired: user.accountNonExpired ?? true,
                activationCode: user.activationCode || generateActivationCode()
            });
            setAuthoritySet((user.authoritySet || []) as unknown as Permission[]);
            setDepartmentSet((user.departmentSet || []) as unknown as Department[]);
            setRoleSet((user.roleSet || []) as unknown as Role[]);
        }
    }, [user]);

    const handleChange = <T extends keyof CreateUserRequest>(
        name: T,
        value: CreateUserRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (
        name: 'authoritySet' | 'departmentSet' | 'roleSet',
        value: string,
        checked: boolean
    ) => {
        if (name === 'authoritySet') {
            const currentArray = authoritySet;
            if (checked) {
                setAuthoritySet([...currentArray.filter(item => item !== value), value as Permission]);
            } else {
                setAuthoritySet(currentArray.filter(item => item !== value));
            }
        } else if (name === 'departmentSet') {
            const currentArray = departmentSet;
            if (checked) {
                setDepartmentSet([...currentArray.filter(item => item !== value), value as Department]);
            } else {
                setDepartmentSet(currentArray.filter(item => item !== value));
            }
        } else if (name === 'roleSet') {
            const currentArray = roleSet;
            if (checked) {
                setRoleSet([...currentArray.filter(item => item !== value), value as Role]);
            } else {
                setRoleSet(currentArray.filter(item => item !== value));
            }
        }
    };

    const checkUsername = async (username: string) => {
        if (!onUsernameCheck || !username.trim() || username === user?.username) return;

        setUsernameChecking(true);
        try {
            const isAvailable = await onUsernameCheck(username.trim());
            if (!isAvailable) {
                setErrors(prev => ({
                    ...prev,
                    username: 'Bu kullanıcı adı zaten kullanılıyor'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    username: undefined
                }));
            }
        } catch (error) {
            console.error('Username check failed:', error);
        } finally {
            setUsernameChecking(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: UserFormErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Kullanıcı adı zorunludur';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
        } else if (!/^[a-zA-Z0-9._@-]+$/.test(formData.username.trim())) {
            newErrors.username = 'Kullanıcı adı sadece harf, rakam, @, nokta, tire ve alt çizgi içerebilir';
        }


        // Password validation (required for new users)
        if (!user && !formData.password.trim()) {
            newErrors.password = 'Şifre zorunludur';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Şifre en az 6 karakter olmalıdır';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'E-posta zorunludur';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçersiz e-posta formatı';
        }

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'İsim zorunludur';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'İsim en az 2 karakter olmalıdır';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyisim zorunludur';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Soyisim en az 2 karakter olmalıdır';
        }

        // Mobile phone validation
        if (!formData.mobilePhone || !formData.mobilePhone.trim()) {
            newErrors.mobilePhone = 'Telefon numarası zorunludur';
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.mobilePhone)) {
            newErrors.mobilePhone = 'Geçersiz telefon formatı';
        }

        // Identity number validation
        if (formData.identityNumber && !/^\d{11}$/.test(formData.identityNumber.replace(/\s/g, ''))) {
            newErrors.identityNumber = 'TC Kimlik numarası 11 haneli olmalıdır';
        }

        // Multi-select validations
        if (authoritySet.length === 0) {
            newErrors.authoritySet = 'En az bir yetki seçmelisiniz';
        }

        if (departmentSet.length === 0) {
            newErrors.departmentSet = 'En az bir departman seçmelisiniz';
        }

        if (!formData.brandSet || formData.brandSet.length === 0) {
            newErrors.brandSet = 'En az bir marka seçmelisiniz';
        }

        if (roleSet.length === 0) {
            newErrors.roleSet = 'En az bir rol seçmelisiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert local arrays to Request types
            const submitData: CreateUserRequest | UpdateUserRequest = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                name: formData.name.trim(),
                lastName: formData.lastName.trim(),
                mobilePhone: formData.mobilePhone?.trim() || '',
                identityNumber: formData.identityNumber?.trim(),
                brandSet: formData.brandSet,
                departmentSet: departmentSet as CreateUserRequestDepartmentSetItem[],
                roleSet: roleSet as CreateUserRequestRoleSetItem[],
                authoritySet: authoritySet as CreateUserRequestAuthoritySetItem[]
            };

            // Add password only for create
            if (!user && formData.password) {
                (submitData as CreateUserRequest).password = formData.password;
            }

            onSubmit(submitData);
        }
    };

    const regenerateActivationCode = () => {
        setFormData(prev => ({
            ...prev,
            activationCode: generateActivationCode()
        }));
    };

    const roles: Role[] = ['ADMIN', 'USER', 'LEARNER', 'INSTRUCTOR', 'OBSERVER', 'COMPANY'];
    const permissions = Object.keys(PermissionList) as Permission[];
    const departments = Object.keys(DepartmentList) as Department[];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {user ? "Kullanıcı Güncelle" : "Yeni Kullanıcı Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı *</Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    onBlur={(e) => checkUsername(e.target.value)}
                                    className={errors.username ? 'border-red-500' : ''}
                                    placeholder="Kullanıcı adını giriniz"
                                />
                                {usernameChecking && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                    </div>
                                )}
                            </div>
                            {errors.username && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.username}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Şifre {!user && '*'}
                            </Label>
                            {user ? (
                                <div className="flex gap-2">
                                    <Input
                                        id="password"
                                        type="password"
                                        value="********"
                                        readOnly
                                        className="bg-gray-50"
                                        placeholder="Mevcut şifre"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            if (onPasswordReset && user?.id) {
                                                onPasswordReset(user.id);
                                            }
                                        }}
                                        disabled={!onPasswordReset}
                                    >
                                        Şifre Yenile
                                    </Button>
                                </div>
                            ) : (
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={errors.password ? 'border-red-500' : ''}
                                    placeholder="Şifre giriniz"
                                />
                            )}
                            {errors.password && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.password}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">İsim *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="İsim giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Soyisim *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className={errors.lastName ? 'border-red-500' : ''}
                                placeholder="Soyisim giriniz"
                            />
                            {errors.lastName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.lastName}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                                placeholder="ornek@firma.com"
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Mobile Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="mobilePhone">Telefon *</Label>
                            <Input
                                id="mobilePhone"
                                value={formData.mobilePhone}
                                onChange={(e) => handleChange('mobilePhone', e.target.value)}
                                className={errors.mobilePhone ? 'border-red-500' : ''}
                                placeholder="+90 535 123 45 67"
                            />
                            {errors.mobilePhone && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.mobilePhone}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Identity Number */}
                        <div className="space-y-2">
                            <Label htmlFor="identityNumber">TC Kimlik No</Label>
                            <Input
                                id="identityNumber"
                                value={formData.identityNumber || ''}
                                onChange={(e) => handleChange('identityNumber', e.target.value)}
                                className={errors.identityNumber ? 'border-red-500' : ''}
                                placeholder="12345678901"
                            />
                            {errors.identityNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.identityNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Activation Code */}
                        <div className="space-y-2">
                            <Label htmlFor="activationCode">Aktivasyon Kodu</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="activationCode"
                                    value={formData.activationCode}
                                    readOnly
                                    className="bg-gray-50"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={regenerateActivationCode}
                                >
                                    Yenile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label>Roller *</Label>
                        <div className="grid grid-cols-3 gap-2 p-4 border rounded-md">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${role}`}
                                        checked={roleSet.includes(role)}
                                        onChange={(checked) =>
                                            handleMultiSelectChange('roleSet', role, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`role-${role}`} className="text-sm">
                                        {roleConverter(role)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.roleSet && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.roleSet}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-2">
                        <Label>Departmanlar *</Label>
                        <div className="grid grid-cols-3 gap-2 p-4 border rounded-md">
                            {departments.map((dept) => (
                                <div key={dept} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`dept-${dept}`}
                                        checked={departmentSet.includes(dept)}
                                        onChange={(checked) =>
                                            handleMultiSelectChange('departmentSet', dept, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`dept-${dept}`} className="text-sm">
                                        {departmentConverter(DepartmentList[dept] as Department)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.departmentSet && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.departmentSet}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Permission Selection */}
                    <div className="space-y-2">
                        <Label>Yetkiler *</Label>
                        <div className="grid grid-cols-3 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                            {permissions.map((permission) => (
                                <div key={permission} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`perm-${permission}`}
                                        checked={authoritySet.includes(permission)}
                                        onChange={(checked) =>
                                            handleMultiSelectChange('authoritySet', permission, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`perm-${permission}`} className="text-sm">
                                        {permissionConverter(PermissionList[permission] as Permission)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.authoritySet && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.authoritySet}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Brand Selection */}
                    <div className="space-y-2">
                        <Label>Markalar *</Label>
                        <div className="grid grid-cols-2 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                            {brands && brands.map((brand) => (
                                <div key={brand.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`brand-${brand.id}`}
                                        checked={formData.brandSet?.some(b => b.id === brand.id) || false}
                                        onChange={(checked) => {
                                            if (checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    brandSet: [...(prev.brandSet || []).filter(b => b.id !== brand.id), brand]
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    brandSet: (prev.brandSet || []).filter(b => b.id !== brand.id)
                                                }));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`brand-${brand.id}`} className="text-sm">
                                        {brand.name} ({brand.code})
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.brandSet && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.brandSet}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Account Status Checkboxes (only show in edit mode) */}
                    {user && (
                        <div className="space-y-4">
                            <Label>Hesap Durumu</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="enabled"
                                        checked={formData.enabled}
                                        onChange={(checked) => handleChange('enabled', checked as boolean)}
                                    />
                                    <Label htmlFor="enabled">Hesap Aktif</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="accountNonLocked"
                                        checked={formData.accountNonLocked}
                                        onChange={(checked) => handleChange('accountNonLocked', checked as boolean)}
                                    />
                                    <Label htmlFor="accountNonLocked">Hesap Kilitli Değil</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="accountNonExpired"
                                        checked={formData.accountNonExpired}
                                        onChange={(checked) => handleChange('accountNonExpired', checked as boolean)}
                                    />
                                    <Label htmlFor="accountNonExpired">Hesap Süresi Dolmamış</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="credentialsNonExpired"
                                        checked={formData.credentialsNonExpired}
                                        onChange={(checked) => handleChange('credentialsNonExpired', checked as boolean)}
                                    />
                                    <Label htmlFor="credentialsNonExpired">Şifre Süresi Dolmamış</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading || usernameChecking}
                        >
                            {loading ? "İşleniyor..." : user ? "Kullanıcı Güncelle" : "Kullanıcı Oluştur"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UserForm;
