'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users, Film, Shield, User, Ban } from 'lucide-react';
import { Role } from '@prisma/client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isBlocked: boolean;
  blockReason?: string;
  createdAt: string;
  profileImageUrl?: string;
  _count: {
    movies: number;
    friendships: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: Role.USER,
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/auth');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить пользователей',
        variant: 'destructive',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newUser.email ||
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.password
    ) {
      toast({
        title: 'Ошибка',
        description: 'Все поля обязательны для заполнения',
        variant: 'destructive',
      });
      return;
    }

    if (newUser.password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers(prev => [
          { ...createdUser, _count: { movies: 0, friendships: 0 } },
          ...prev,
        ]);
        setIsCreateModalOpen(false);
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          role: Role.USER,
        });
        toast({
          title: 'Успех',
          description: 'Пользователь успешно создан',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать пользователя',
        variant: 'destructive',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Управление пользователями
          </h1>
          <p className="text-gray-600 mt-1">
            Всего пользователей: {users.length}
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Создать нового пользователя</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={e =>
                      handleInputChange('firstName', e.target.value)
                    }
                    placeholder="Иван"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={e =>
                      handleInputChange('lastName', e.target.value)
                    }
                    placeholder="Иванов"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="Минимум 6 символов"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: Role) =>
                    handleInputChange('role', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.USER}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Пользователь
                      </div>
                    </SelectItem>
                    <SelectItem value={Role.ADMIN}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Администратор
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createLoading}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Создание...
                    </div>
                  ) : (
                    'Создать'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Список пользователей */}
      {dataLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        user.role === Role.ADMIN ? 'default' : 'secondary'
                      }
                    >
                      {user.role === Role.ADMIN ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Админ
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Пользователь
                        </>
                      )}
                    </Badge>

                    {user.isBlocked && (
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Заблокирован
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Film className="h-4 w-4 text-gray-500" />
                      <span>Фильмов:</span>
                    </div>
                    <span className="font-medium">{user._count.movies}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Друзей:</span>
                    </div>
                    <span className="font-medium">
                      {user._count.friendships}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Дата регистрации:</span>
                    <span className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  {user.isBlocked && user.blockReason && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="font-medium text-red-800">
                        Причина блокировки:
                      </span>
                      <p className="text-red-700 mt-1">{user.blockReason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {users.length === 0 && !dataLoading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Нет пользователей
          </h3>
          <p className="text-gray-500">
            Создайте первого пользователя в системе
          </p>
        </div>
      )}
    </div>
  );
}
