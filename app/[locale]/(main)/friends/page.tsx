'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';
import Loading from '@/app/components/ui/Loading';
import {
  Search,
  UserPlus,
  Users,
  Check,
  X,
  ArrowLeft,
  Film,
  Tv,
  User,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FriendshipStatus, MediaType } from '@prisma/client';
import Image from 'next/image';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  createdAt: string;
}

interface Friendship {
  id: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  isCurrentUserSender: boolean;
  otherUser: User;
}

interface UserStats {
  totalMovies: number;
  totalSeries: number;
  commonMovies?: number;
  commonSeries?: number;
}

export default function FriendsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
  const [dataLoading, setDataLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchFriendships();
    }
  }, [loading, isAuthenticated, router]);

  const fetchFriendships = async () => {
    setDataLoading(true);
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriendships(data);

        // Получаем статистику для каждого друга
        const acceptedFriends = data.filter(
          (f: Friendship) => f.status === FriendshipStatus.ACCEPTED
        );
        for (const friendship of acceptedFriends) {
          await fetchUserStats(friendship.otherUser.id);
        }
      } else {
        throw new Error('Failed to fetch friendships');
      }
    } catch (error) {
      console.error('Error fetching friendships:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список друзей',
        variant: 'destructive',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      const [moviesResponse, friendMoviesResponse] = await Promise.all([
        fetch(`/api/movies?userId=${userId}`),
        fetch(`/api/movies?userId=${user?.id}`),
      ]);

      if (moviesResponse.ok && friendMoviesResponse.ok) {
        const friendMovies = await moviesResponse.json();
        const myMovies = await friendMoviesResponse.json();

        const friendMovieTitles = new Set(
          friendMovies.map((m: any) => m.title.toLowerCase())
        );
        const friendSerieTitles = new Set(
          friendMovies
            .filter((m: any) => m.type === MediaType.TV_SERIES)
            .map((m: any) => m.title.toLowerCase())
        );

        const commonMovies = myMovies.filter(
          (m: any) =>
            m.type === MediaType.MOVIE &&
            friendMovieTitles.has(m.title.toLowerCase())
        ).length;

        const commonSeries = myMovies.filter(
          (m: any) =>
            m.type === MediaType.TV_SERIES &&
            friendSerieTitles.has(m.title.toLowerCase())
        ).length;

        setUserStats(prev => ({
          ...prev,
          [userId]: {
            totalMovies: friendMovies.filter(
              (m: any) => m.type === MediaType.MOVIE
            ).length,
            totalSeries: friendMovies.filter(
              (m: any) => m.type === MediaType.TV_SERIES
            ).length,
            commonMovies,
            commonSeries,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        throw new Error('Failed to search users');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось найти пользователей',
        variant: 'destructive',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        const newFriendship = await response.json();
        setFriendships(prev => [
          ...prev,
          {
            ...newFriendship,
            isCurrentUserSender: true,
            otherUser: searchResults.find(u => u.id === friendId)!,
          },
        ]);
        toast({
          title: 'Успешно!',
          description: 'Запрос в друзья отправлен',
        });
        setSearchQuery('');
        setSearchResults([]);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось отправить запрос',
        variant: 'destructive',
      });
    }
  };

  const handleFriendshipAction = async (
    friendshipId: string,
    action: 'accept' | 'decline' | 'block'
  ) => {
    try {
      const statusMap = {
        accept: FriendshipStatus.ACCEPTED,
        decline: FriendshipStatus.DECLINED,
        block: FriendshipStatus.BLOCKED,
      };

      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusMap[action] }),
      });

      if (response.ok) {
        const updatedFriendship = await response.json();
        setFriendships(prev =>
          prev.map(f =>
            f.id === friendshipId ? { ...f, status: statusMap[action] } : f
          )
        );

        if (action === 'accept') {
          // Получаем статистику для нового друга
          const friendship = friendships.find(f => f.id === friendshipId);
          if (friendship) {
            await fetchUserStats(friendship.otherUser.id);
          }
        }

        toast({
          title: 'Успешно!',
          description:
            action === 'accept'
              ? 'Запрос принят'
              : action === 'decline'
                ? 'Запрос отклонён'
                : 'Пользователь заблокирован',
        });
      } else {
        throw new Error('Failed to update friendship');
      }
    } catch (error) {
      console.error('Error updating friendship:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус дружбы',
        variant: 'destructive',
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого друга?')) return;

    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFriendships(prev => prev.filter(f => f.id !== friendshipId));
        toast({
          title: 'Успешно!',
          description: 'Друг удалён',
        });
      } else {
        throw new Error('Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить друга',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const acceptedFriends = friendships.filter(
    f => f.status === FriendshipStatus.ACCEPTED
  );
  const pendingRequests = friendships.filter(
    f => f.status === FriendshipStatus.PENDING && !f.isCurrentUserSender
  );
  const sentRequests = friendships.filter(
    f => f.status === FriendshipStatus.PENDING && f.isCurrentUserSender
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Друзья</h1>
          <p className="text-gray-600">
            {acceptedFriends.length} друзей, {pendingRequests.length} входящих
            запросов
          </p>
        </div>
      </div>

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="friends">
            Друзья ({acceptedFriends.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Запросы ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Отправленные ({sentRequests.length})
          </TabsTrigger>
          <TabsTrigger value="search">Поиск</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {dataLoading ? (
            <Loading />
          ) : acceptedFriends.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Нет друзей</h3>
              <p className="text-gray-600">
                Найдите и добавьте друзей, чтобы делиться фильмами
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedFriends.map(friendship => {
                const stats = userStats[friendship.otherUser.id];
                return (
                  <Card key={friendship.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        {friendship.otherUser.profileImageUrl ? (
                          <Image
                            src={friendship.otherUser.profileImageUrl}
                            alt={`${friendship.otherUser.firstName} ${friendship.otherUser.lastName}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {friendship.otherUser.firstName}{' '}
                            {friendship.otherUser.lastName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {friendship.otherUser.email}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {stats && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Film className="h-4 w-4" />
                              <span className="text-sm">Фильмы:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {stats.totalMovies}
                              </Badge>
                              {stats.commonMovies !== undefined &&
                                stats.commonMovies > 0 && (
                                  <Badge>{stats.commonMovies} общих</Badge>
                                )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Tv className="h-4 w-4" />
                              <span className="text-sm">Сериалы:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {stats.totalSeries}
                              </Badge>
                              {stats.commonSeries !== undefined &&
                                stats.commonSeries > 0 && (
                                  <Badge>{stats.commonSeries} общих</Badge>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => removeFriend(friendship.id)}
                        >
                          Удалить из друзей
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Нет входящих запросов
              </h3>
              <p className="text-gray-600">
                Здесь будут отображаться запросы в друзья
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(friendship => (
                <Card key={friendship.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {friendship.otherUser.profileImageUrl ? (
                          <Image
                            src={friendship.otherUser.profileImageUrl}
                            alt={`${friendship.otherUser.firstName} ${friendship.otherUser.lastName}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {friendship.otherUser.firstName}{' '}
                            {friendship.otherUser.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {friendship.otherUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleFriendshipAction(friendship.id, 'accept')
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Принять
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleFriendshipAction(friendship.id, 'decline')
                          }
                        >
                          <X className="h-4 w-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Нет отправленных запросов
              </h3>
              <p className="text-gray-600">
                Здесь будут отображаться ваши запросы в друзья
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentRequests.map(friendship => (
                <Card key={friendship.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {friendship.otherUser.profileImageUrl ? (
                          <Image
                            src={friendship.otherUser.profileImageUrl}
                            alt={`${friendship.otherUser.firstName} ${friendship.otherUser.lastName}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {friendship.otherUser.firstName}{' '}
                            {friendship.otherUser.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {friendship.otherUser.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Ожидает ответа</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {searchLoading ? (
            <Loading />
          ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Пользователи не найдены</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(searchUser => {
                const existingFriendship = friendships.find(
                  f => f.otherUser.id === searchUser.id
                );
                const canAddFriend = !existingFriendship;

                return (
                  <Card key={searchUser.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {searchUser.profileImageUrl ? (
                            <Image
                              src={searchUser.profileImageUrl}
                              alt={`${searchUser.firstName} ${searchUser.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">
                              {searchUser.firstName} {searchUser.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {searchUser.email}
                            </p>
                          </div>
                        </div>

                        {canAddFriend ? (
                          <Button
                            size="sm"
                            onClick={() => sendFriendRequest(searchUser.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Добавить
                          </Button>
                        ) : (
                          <Badge variant="outline">
                            {existingFriendship?.status ===
                            FriendshipStatus.PENDING
                              ? existingFriendship.isCurrentUserSender
                                ? 'Запрос отправлен'
                                : 'Входящий запрос'
                              : existingFriendship?.status ===
                                  FriendshipStatus.ACCEPTED
                                ? 'Уже друг'
                                : 'Недоступен'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
