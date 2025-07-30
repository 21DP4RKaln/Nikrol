'use client';

import { useState, useEffect } from 'react';
import { Star, Calendar, Edit, Trash2, Film, Tv } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UserMediaEntry {
  id: string;
  status: string;
  userRating: number | null;
  personalNotes: string | null;
  watchedAt: string | null;
  startedAt: string | null;
  createdAt: string;
  updatedAt: string;
  globalMedia: {
    id: string;
    title: string;
    originalTitle: string;
    description: string;
    releaseYear: number;
    genres: string;
    posterUrl: string;
    type: 'MOVIE' | 'TV_SERIES';
    imdbRating: number;
    duration: number;
  };
}

const statusLabels = {
  WANT_TO_WATCH: 'Хочу посмотреть',
  WATCHING: 'Смотрю сейчас',
  WATCHED: 'Просмотрено',
  ON_HOLD: 'Приостановлено',
  DROPPED: 'Брошено',
  REWATCHING: 'Пересматриваю'
};

const statusColors = {
  WANT_TO_WATCH: 'bg-blue-100 text-blue-800',
  WATCHING: 'bg-green-100 text-green-800',
  WATCHED: 'bg-gray-100 text-gray-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
  DROPPED: 'bg-red-100 text-red-800',
  REWATCHING: 'bg-purple-100 text-purple-800'
};

export default function UserMediaList() {
  const [entries, setEntries] = useState<UserMediaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingEntry, setEditingEntry] = useState<UserMediaEntry | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    userRating: '',
    personalNotes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserMedia();
  }, [filter, typeFilter]);

  const fetchUserMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/user-media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setEntries(data.entries);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить ваш список',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: UserMediaEntry) => {
    setEditingEntry(entry);
    setEditForm({
      status: entry.status,
      userRating: entry.userRating?.toString() || '',
      personalNotes: entry.personalNotes || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingEntry) return;

    try {
      const response = await fetch(`/api/user-media/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editForm.status,
          userRating: editForm.userRating ? parseFloat(editForm.userRating) : null,
          personalNotes: editForm.personalNotes
        })
      });

      if (!response.ok) throw new Error('Update failed');

      await fetchUserMedia();
      setEditingEntry(null);
      toast({
        title: 'Успешно обновлено',
        description: 'Запись обновлена в вашем списке'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить запись',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      const response = await fetch(`/api/user-media/${entryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete failed');

      await fetchUserMedia();
      toast({
        title: 'Успешно удалено',
        description: 'Запись удалена из вашего списка'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить запись',
        variant: 'destructive'
      });
    }
  };

  const MediaCard = ({ entry }: { entry: UserMediaEntry }) => {
    const genres = entry.globalMedia.genres ? JSON.parse(entry.globalMedia.genres) : [];

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="w-24 flex-shrink-0">
            {entry.globalMedia.posterUrl ? (
              <img
                src={entry.globalMedia.posterUrl}
                alt={entry.globalMedia.title}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                {entry.globalMedia.type === 'MOVIE' ? 
                  <Film className="w-6 h-6 text-gray-400" /> : 
                  <Tv className="w-6 h-6 text-gray-400" />
                }
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{entry.globalMedia.title}</h3>
                <p className="text-xs text-gray-500">{entry.globalMedia.releaseYear}</p>
              </div>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(entry)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать запись</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status">Статус</Label>
                        <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rating">Ваша оценка (1-10)</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="10"
                          step="0.1"
                          value={editForm.userRating}
                          onChange={(e) => setEditForm({...editForm, userRating: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Личные заметки</Label>
                        <Textarea
                          id="notes"
                          value={editForm.personalNotes}
                          onChange={(e) => setEditForm({...editForm, personalNotes: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleUpdate} className="w-full">
                        Сохранить изменения
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[entry.status as keyof typeof statusColors]}>
                {statusLabels[entry.status as keyof typeof statusLabels]}
              </Badge>
              {entry.userRating && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {entry.userRating}
                </div>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genres.slice(0, 3).map((genre: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {entry.personalNotes && (
              <p className="text-xs text-gray-600 line-clamp-2">{entry.personalNotes}</p>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка вашего списка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Фильтр по типу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="movie">Фильмы</SelectItem>
            <SelectItem value="tv_series">Сериалы</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Ваш список пуст. Начните добавлять фильмы и сериалы!
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
