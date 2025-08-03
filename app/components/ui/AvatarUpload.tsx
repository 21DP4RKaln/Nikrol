'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface AvatarUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string) => void;
  userName: string;
}

export default function AvatarUpload({
  currentImageUrl,
  onImageUpdate,
  userName,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const t = useTranslations();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description:
          t('profile.avatar.invalidFileType') ||
          'Invalid file type. Only JPEG, PNG, JPG, WEBP are allowed',
        variant: 'destructive',
      });
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'Error',
        description:
          t('profile.avatar.fileTooLarge') ||
          'File too large. Maximum size: 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Создаем превью
    const reader = new FileReader();
    reader.onload = e => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем файл
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onImageUpdate(data.url);
        setPreviewUrl(null);
        toast({
          title: 'Success!',
          description:
            t('profile.avatar.uploadSuccess') || 'Avatar updated successfully',
        });
      } else {
        throw new Error(data.error || 'Upload error');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          t('profile.avatar.uploadError') ||
          'Failed to upload avatar',
        variant: 'destructive',
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative cursor-pointer"
        onClick={handleButtonClick}
      >
        {displayImageUrl ? (
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-200 dark:border-purple-400/50 shadow-lg">
              <Image
                src={displayImageUrl}
                alt={userName}
                width={96}
                height={96}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-purple-800 dark:to-blue-900 rounded-full flex items-center justify-center border-4 border-amber-200 dark:border-purple-400/50 shadow-lg">
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-3 border-amber-600 dark:border-purple-400 border-t-transparent rounded-full"
              />
            ) : (
              <span className="text-2xl font-bold text-amber-700 dark:text-purple-300">
                {getInitials(userName)}
              </span>
            )}
          </div>
        )}

        {/* Overlay для наведения */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500/80 to-orange-600/80 dark:from-purple-600/80 dark:to-blue-700/80 rounded-full backdrop-blur-sm"
        >
          <div className="text-center text-white">
            <Camera className="h-6 w-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Change</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Кнопки управления */}
      <div className="absolute -bottom-2 -right-2 flex gap-1">
        {previewUrl && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full p-2 h-8 w-8 shadow-lg"
              onClick={e => {
                e.stopPropagation();
                removePreview();
              }}
              disabled={uploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            className="rounded-full p-2 h-8 w-8 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-500 dark:to-blue-600 hover:from-amber-500 hover:to-orange-600 dark:hover:from-purple-600 dark:hover:to-blue-700 text-white shadow-lg border-2 border-white dark:border-gray-800"
            onClick={e => {
              e.stopPropagation();
              handleButtonClick();
            }}
            disabled={uploading}
          >
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border border-white border-t-transparent rounded-full"
              />
            ) : (
              <Upload className="h-3 w-3" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Скрытый input для выбора файла */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
