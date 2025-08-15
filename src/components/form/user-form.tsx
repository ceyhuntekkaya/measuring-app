'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Permission, Department, Role, UserFormData, User} from "@/types/auth";
import {useDataContext} from "@/contexts/data-context";
import {useLanguage} from "@/contexts/language-context";
import {Brand} from "@/types/brand";
import {EStatus} from "@/types/enumeration";

interface UserFormProps {
    onSubmit: (arg0: UserFormData) => void;
    selectedUser?: User;
}

interface UserFormErrors {
    username?: string;
    name?: string;
    lastName?: string;
    mobilePhone?: string;
    status?: string;
    roleSet?: string;
    brandSte?: string;
    brandSet?: string;
    password?: string;
    email?: string;
    departmentSet?: string;
    authoritySet?: string;
    connectionId?: string;
    transportationCompanyId?: string;
    vehicleDriverId?: string;
    customerId?: string;
}

const UserForm: React.FC<UserFormProps> = ({
                                               onSubmit,
                                               selectedUser
                                           }) => {
    const {t} = useLanguage();
    const [formData, setFormData] = useState<UserFormData>({
        id: '',
        createdAt: Date.now(),
        deletedAt: null,
        status: 'ACTIVE',
        username: '',
        password: '',
        lastLoginTime: null,
        mobilePhone: '',
        activationCode: Math.random().toString(36).substring(2, 12),
        name: '',
        lastName: '',
        authoritySet: [],
        departmentSet: [],
        roleSet: [],
        enabled: true,
        credentialsNonExpired: true,
        accountNonLocked: true,
        accountNonExpired: true,
        email: '',
        identityNumber: '',
        brandSet: [],
        connectionId: null,
    });

    const [connection, setConnection] = useState({
        customerId: null,
        vehicleDriverId: null,
        transportationCompanyId: null
    });






    useEffect(() => {
        if (selectedUser) {
            setFormData({
                id: selectedUser.id,
                createdAt: Date.now(),
                deletedAt: null,
                status: selectedUser.status as EStatus | EStatus.NEW,
                username: selectedUser.username,
                password: '',
                lastLoginTime: null,
                mobilePhone: selectedUser.mobilePhone,
                activationCode: selectedUser.activationCode,
                name: selectedUser.name,
                lastName: selectedUser.lastName,
                authoritySet: selectedUser.authoritySet,
                departmentSet: selectedUser.departmentSet,
                roleSet: selectedUser.roleSet,
                enabled: selectedUser.enabled,
                credentialsNonExpired: selectedUser.credentialsNonExpired,
                accountNonLocked: selectedUser.accountNonLocked,
                accountNonExpired: selectedUser.accountNonExpired,
                email: selectedUser.email,
                identityNumber: selectedUser.identityNumber,
                brandSet: selectedUser.brandSet,
                connectionId: selectedUser.connectionId,
            });


            if (selectedUser.roleSet.includes("LEARNER") && selectedUser.connectionId) {
                if (!selectedUser.connectionId) {
                    handleConnection("transportationCompanyId", selectedUser.connectionId);
                }
            } else if (selectedUser.roleSet.includes("COMPANY") && selectedUser.connectionId) {
                if (!selectedUser.connectionId) {
                    handleConnection("customerId", selectedUser.connectionId);
                }
            } else if (selectedUser.roleSet.includes("USER") && selectedUser.connectionId) {
                if (!selectedUser.connectionId) {
                    handleConnection("vehicleDriverId", selectedUser.connectionId);
                }
            }
            toggleBrand(selectedUser.brandSet[0] || {id: '', name: ''} as Brand);


        }
    }, [selectedUser]);




    const [errors, setErrors] = useState<UserFormErrors>({});

    const {
        permissions,
        departments,
        roles,
    } = useDataContext();


    const validateForm = () => {
        const newErrors: UserFormErrors = {};

        if (!formData.username) {
            newErrors.username = 'Kullanıcı adı zorunludur';
        }

        if (!selectedUser && !formData.password) {
            newErrors.password = 'Şifre zorunludur';
        }

        if (!formData.name) {
            newErrors.name = 'Ad zorunludur';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Soyad zorunludur';
        }

        if (!formData.mobilePhone) {
            newErrors.mobilePhone = 'Telefon numarası zorunludur';
        }

        if (formData.roleSet.length === 0) {
            newErrors.roleSet = 'En az bir rol seçilmelidir';
        } else {

            if (formData.roleSet.includes("LEARNER")) {
                if (!formData.connectionId) {
                    newErrors.connectionId = 'Listeden bir nakliye firması seçimi yapmalısınız.';
                }
            } else if (formData.roleSet.includes("COMPANY")) {
                if (!formData.connectionId) {
                    newErrors.connectionId = 'Listeden bir müşteri seçimi yapmalısınız.';
                }
            } else if (formData.roleSet.includes("USER")) {
                if (!formData.connectionId) {
                    newErrors.connectionId = 'Listeden bir şoför seçimi yapmalısınız.';
                }
            }
        }


        if (formData.brandSet.length === 0) {
            newErrors.brandSet = 'En az bir marka seçilmelidir';
        }


        if (formData.roleSet.includes("ADMIN")) {
            if (formData.departmentSet.length === 0) {
                newErrors.departmentSet = 'En az bir birim seçilmelidir';
            }
            if (formData.authoritySet.length === 0) {
                newErrors.authoritySet = 'En az bir yetki seçilmelidir';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
            });
        }

    };


    const handleConnection = (name: string, value: string) => {
        setConnection(prev => ({
            ...prev,
            [name]: value
        }));


        if (formData.roleSet.includes("LEARNER")) {
            handleChange("connectionId", value);
        } else if (formData.roleSet.includes("COMPANY")) {
            handleChange("connectionId", value);
        } else if (formData.roleSet.includes("USER")) {
            handleChange("connectionId", value);
        } else {
            handleChange("connectionId", null);
        }


    };

    const handleChange = <T extends keyof UserFormData>(
        name: T,
        value: UserFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const togglePermission = (permission: Permission) => {
        setFormData(prev => {
            if (prev.authoritySet === null) return prev;
            const authoritySet = prev.authoritySet.includes(permission)
                ? prev.authoritySet.filter(p => p !== permission)
                : [...prev.authoritySet, permission];

            return {...prev, authoritySet};
        });
    };

    const toggleDepartment = (department: Department) => {
        setFormData(prev => {
            const departmentSet = prev.departmentSet.includes(department)
                ? prev.departmentSet.filter(d => d !== department)
                : [...prev.departmentSet, department];

            return {...prev, departmentSet};
        });
    };

    const toggleBrand = (brand: Brand) => {
        setFormData(prev => {
            const brandSet = prev.brandSet.includes(brand)
                ? prev.brandSet.filter(d => d !== brand)
                : [...prev.brandSet, brand];

            return {...prev, brandSet};
        });
    };

    const toggleRole = (role: Role) => {
        /*
        setFormData(prev => {
            const roleSet = prev.roleSet.includes(role)
                ? prev.roleSet.filter(r => r !== role)
                : [...prev.roleSet, role];

            return {...prev, roleSet};
        });

         */

        setFormData(prev => {
            const roleSet = prev.roleSet.includes(role)
                ? []
                : [role];

            const authoritySet: Permission[] = [];
            const departmentSet: Department[] = [];
            authoritySet.push('GENERAL')

            if (!roleSet.includes('ADMIN')) {
                departmentSet.push('EXTERNAL')
            }
            return {...prev, roleSet, authoritySet, departmentSet};
        });


        if (formData.roleSet.includes("LEARNER")) {
            handleChange("connectionId", connection.transportationCompanyId);
        } else if (formData.roleSet.includes("COMPANY")) {
            handleChange("connectionId", connection.customerId);
        } else if (formData.roleSet.includes("USER")) {
            handleChange("connectionId", connection.vehicleDriverId);
        } else {
            handleChange("connectionId", null);
        }

    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{
                    selectedUser ? "Kullanıcıyı Güncelle" : "Yeni Kullanıcı Oluştur"
                }</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Temel Bilgiler */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı *</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={(e) => handleChange('username', e.target.value)}
                                className={errors.username ? 'border-red-500' : ''}
                            />
                            {errors.username && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.username}</AlertDescription>
                                </Alert>
                            )}
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre *</Label>

                            {
                                selectedUser ?

                                    <Input
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        readOnly
                                    />
                                    :

                                    <Input
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                    />

                            }

                            {errors.password && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.password}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Ad *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Soyad *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className={errors.lastName ? 'border-red-500' : ''}
                            />
                            {errors.lastName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.lastName}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="email">Mail Adresi</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobilePhone">Telefon Numarası *</Label>
                            <Input
                                id="mobilePhone"
                                name="mobilePhone"
                                value={formData.mobilePhone}
                                onChange={(e) => handleChange('mobilePhone', e.target.value)}
                                className={errors.mobilePhone ? 'border-red-500' : ''}
                            />
                            {errors.mobilePhone && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.mobilePhone}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="identityNumber">Kimlik Numarası</Label>
                            <Input
                                id="identityNumber"
                                name="identityNumber"
                                value={formData.identityNumber || ''}
                                onChange={(e) => handleChange('identityNumber', e.target.value)}
                            />

                        </div>


                    </div>
                    <hr/>


                    {/* Markalar */}



                    {/* Roller */}
                    <div className="space-y-2">
                        <Label>Roller *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {roles.map(role => (
                                <div key={role} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`role-${role}`}
                                        checked={formData.roleSet.includes(role)}
                                        onChange={() => toggleRole(role)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label
                                        htmlFor={`role-${role}`}
                                        className="text-sm text-gray-700"
                                    >

                                        {t(`user.${role}`)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.roleSet || errors.connectionId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.roleSet} {errors.connectionId}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <hr/>

                    {
                        formData.roleSet.includes("ADMIN") && (
                            <>
                                {/* Departmanlar */}
                                <div className="space-y-2">
                                    <Label>Birimler</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {departments.map(department => (
                                            <div key={department} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`dept-${department}`}
                                                    checked={formData.departmentSet.includes(department)}
                                                    onChange={() => toggleDepartment(department)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <Label
                                                    htmlFor={`dept-${department}`}
                                                    className="text-sm text-gray-700"
                                                >
                                                    {t(`user.${department}`)}

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
                                <hr/>
                                {/* İzinler */}
                                <div className="space-y-2">
                                    <Label>İzinler</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                                        {permissions.map(permission => (
                                            <div key={permission} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`perm-${permission}`}
                                                    checked={formData.authoritySet?.includes(permission) || false}
                                                    onChange={() => togglePermission(permission)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <Label
                                                    htmlFor={`perm-${permission}`}
                                                    className="text-sm text-gray-700"
                                                >
                                                    {t(`user.${permission}`)}

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
                                <hr/>
                            </>
                        )
                    }


                    {/* Hesap Durumu Ayarları */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                disabled
                                id="enabled"
                                checked={formData.enabled}
                                onChange={(e) => handleChange('enabled', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                                htmlFor="enabled"
                                className="text-sm text-gray-700"
                            >
                                Etkin
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="accountNonExpired"
                                disabled
                                checked={formData.accountNonExpired}
                                onChange={(e) => handleChange('accountNonExpired', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                                htmlFor="accountNonExpired"
                                className="text-sm text-gray-700"
                            >
                                Hesap Süresi Dolmamış
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="accountNonLocked"
                                disabled
                                checked={formData.accountNonLocked}
                                onChange={(e) => handleChange('accountNonLocked', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                                htmlFor="accountNonLocked"
                                className="text-sm text-gray-700"
                            >
                                Hesap Kilitli Değil
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                disabled
                                id="credentialsNonExpired"
                                checked={formData.credentialsNonExpired}
                                onChange={(e) => handleChange('credentialsNonExpired', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                                htmlFor="credentialsNonExpired"
                                className="text-sm text-gray-700"
                            >
                                Kimlik Bilgileri Süresi Dolmamış
                            </Label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">

                            {
                                selectedUser ? "Kullanıcıyı Güncelle" : "Yeni Kullanıcı Oluştur"
                            }


                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UserForm;