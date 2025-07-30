'use client';

import { useState } from 'react';
import { Film, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaSearch from '@/components/MediaSearch';
import UserMediaList from '@/components/UserMediaList';
import { useToast } from '@/hooks/use-toast';

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState('search');
  const { toast } = useToast();

  const handleAddToList = async (media: any, type: 'movie' | 'tv') => {
    try {
      const response = await fetch('/api/user-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: media.id,
          type,
          status: 'WANT_TO_WATCH',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to list');
      }

      toast({
        title: 'Успешно добавлено',
        description: `${type === 'movie' ? 'Фильм' : 'Сериал'} "${type === 'movie' ? media.title : media.name}" добавлен в ваш список`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить в список. Возможно, он уже добавлен.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Film className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Фильмы и Сериалы</h1>
          <p className="text-gray-600">
            Найдите и добавьте фильмы и сериалы в свой список просмотра
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Поиск
          </TabsTrigger>
          <TabsTrigger value="mylist" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Мой список
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Поиск фильмов и сериалов
            </h2>
            <p className="text-gray-600 mb-6">
              Используйте поиск, чтобы найти фильмы и сериалы из базы данных
              TMDb и добавить их в свой список просмотра.
            </p>
            <MediaSearch onAddToList={handleAddToList} />
          </div>
        </TabsContent>{' '}
        <TabsContent value="mylist" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Мой список просмотра</h2>
            <p className="text-gray-600 mb-6">
              Управляйте своим списком фильмов и сериалов, отмечайте статус
              просмотра и оставляйте заметки.
            </p>
            <UserMediaList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
