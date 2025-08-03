'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ArrowLeft,
  Edit,
  Calendar,
  UserCheck,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import AvatarUpload from '@/app/components/ui/AvatarUpload';
import LanguageSwitcher from '@/app/components/ui/LanguageSwitcher';
import FloatingParticles from '@/app/components/ui/FloatingParticles';
import SuccessAnimation from '@/app/components/ui/SuccessAnimation';
import ProfileCompletionIndicator from '@/app/components/ui/ProfileCompletionIndicator';
import { useTranslations } from 'next-intl';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const t = useTranslations();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Формы
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [loading, isAuthenticated, router]);

  const fetchProfile = async () => {
    setDataLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          profileImageUrl: userData.profileImageUrl || '',
        });
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('profile.messages.profileLoadError') || 'Error',
        description:
          t('profile.messages.profileLoadError') || 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleAvatarUpdate = (newImageUrl: string) => {
    setProfile(prev =>
      prev ? { ...prev, profileImageUrl: newImageUrl } : null
    );
    setProfileForm(prev => ({ ...prev, profileImageUrl: newImageUrl }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
        setShowSuccessAnimation(true);
        toast({
          title: t('profile.messages.profileUpdated') || 'Success!',
          description:
            t('profile.messages.profileUpdated') || 'Profile updated',
        });
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('profile.messages.profileUpdateError') || 'Error',
        description:
          error.message ||
          t('profile.messages.profileUpdateError') ||
          'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t('profile.messages.passwordMismatch') || 'Error',
        description:
          t('profile.messages.passwordMismatch') ||
          'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: t('profile.messages.passwordTooShort') || 'Error',
        description:
          t('profile.messages.passwordTooShort') ||
          'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowSuccessAnimation(true);
        toast({
          title: t('profile.messages.passwordChanged') || 'Success!',
          description:
            t('profile.messages.passwordChanged') || 'Password changed',
        });
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: t('profile.messages.passwordChangeError') || 'Error',
        description:
          error.message ||
          t('profile.messages.passwordChangeError') ||
          'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-amber-400 dark:border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Success Animation Overlay */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        message={t('profile.messages.changesSaved') || 'Changes Saved!'}
        onComplete={() => setShowSuccessAnimation(false)}
      />

      {/* Floating Particles Background */}
      <FloatingParticles count={15} />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-300/10 to-orange-400/10 dark:from-purple-500/10 dark:to-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-300/10 to-red-400/10 dark:from-blue-500/10 dark:to-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {' '}
        {/* Header */}{' '}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border-amber-200 dark:border-purple-400/50 hover:bg-amber-50 dark:hover:bg-purple-900/50 backdrop-blur-sm shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('profile.back') || 'Back'}
              </span>
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-purple-500 dark:to-blue-600 rounded-xl shadow-lg shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {t('profile.title') || 'My Profile'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 truncate">
                  {t('profile.subtitle') || 'Manage your account and settings'}
                </p>
              </div>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSwitcher variant="compact" />
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Левая колонка - информация о пользователе */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-purple-400/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-500/20 dark:to-blue-600/20 border-b border-amber-200 dark:border-purple-400/30">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-amber-400 dark:bg-purple-500 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  {t('profile.info.title') || 'Profile Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex flex-col items-center space-y-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <AvatarUpload
                      currentImageUrl={profile.profileImageUrl}
                      onImageUpdate={handleAvatarUpdate}
                      userName={`${profile.firstName} ${profile.lastName}`}
                    />
                    <div className="absolute -bottom-2 -right-2 p-1 bg-amber-400 dark:bg-purple-500 rounded-full">
                      <UserCheck className="h-4 w-4 text-white" />
                    </div>
                  </motion.div>

                  <div className="text-center">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1 mt-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Shield className="h-4 w-4 text-amber-500 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize bg-amber-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                        {profile.role.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-amber-200 dark:border-purple-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-500 dark:text-purple-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {t('profile.info.registrationDate') ||
                          'Registration Date'}
                        :
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-amber-500 dark:text-purple-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {t('profile.info.lastUpdate') || 'Last Update'}:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(profile.updatedAt).toLocaleDateString()}
                    </span>
                  </div>{' '}
                </div>
              </CardContent>
            </Card>{' '}
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-purple-500/10 dark:to-blue-600/10 border-amber-200/50 dark:border-purple-400/30 overflow-hidden relative">
                  <CardContent className="p-4 text-center relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.5,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className="text-2xl font-bold text-amber-600 dark:text-purple-400"
                    >
                      12
                    </motion.div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {t('profile.stats.moviesWatched') || 'Movies'}
                    </div>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/20 dark:bg-purple-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="bg-gradient-to-br from-orange-400/10 to-red-500/10 dark:from-blue-500/10 dark:to-indigo-600/10 border-orange-200/50 dark:border-blue-400/30 overflow-hidden relative">
                  <CardContent className="p-4 text-center relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.6,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className="text-2xl font-bold text-orange-600 dark:text-blue-400"
                    >
                      8
                    </motion.div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {t('profile.stats.tvSeries') || 'TV Series'}
                    </div>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/20 dark:bg-blue-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                </Card>{' '}
              </motion.div>
            </motion.div>
            {/* Profile Completion Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-purple-400/50 shadow-xl">
                <CardContent className="p-4">
                  <ProfileCompletionIndicator
                    profile={{
                      hasAvatar: !!profile.profileImageUrl,
                      hasFirstName: !!profile.firstName,
                      hasLastName: !!profile.lastName,
                      hasEmail: !!profile.email,
                      hasPhone: !!profile.phone,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>{' '}
          {/* Правая колонка - формы редактирования */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-amber-200 dark:border-purple-400/50">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:dark:from-purple-500 data-[state=active]:dark:to-blue-600 data-[state=active]:text-white"
                >
                  <Edit className="h-4 w-4" />
                  {t('profile.tabs.editProfile') || 'Edit Profile'}
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:dark:from-purple-500 data-[state=active]:dark:to-blue-600 data-[state=active]:text-white"
                >
                  <Lock className="h-4 w-4" />
                  {t('profile.tabs.changePassword') || 'Change Password'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-purple-400/50 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-500/20 dark:to-blue-600/20 border-b border-amber-200 dark:border-purple-400/30">
                    <CardTitle className="text-gray-900 dark:text-white">
                      {t('profile.form.basicInfo') || 'Basic Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">
                            {t('profile.form.avatar') || 'Profile Avatar'}
                          </Label>
                          <div className="flex justify-center">
                            <motion.div whileHover={{ scale: 1.02 }}>
                              <AvatarUpload
                                currentImageUrl={profileForm.profileImageUrl}
                                onImageUpdate={handleAvatarUpdate}
                                userName={`${profileForm.firstName} ${profileForm.lastName}`}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {' '}
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {t('profile.form.firstName') || 'First Name'}
                          </Label>
                          <motion.div whileFocus={{ scale: 1.01 }}>
                            <Input
                              id="firstName"
                              type="text"
                              value={profileForm.firstName}
                              onChange={e =>
                                setProfileForm({
                                  ...profileForm,
                                  firstName: e.target.value,
                                })
                              }
                              placeholder={
                                t('profile.form.firstNamePlaceholder') ||
                                'Your first name'
                              }
                              required
                              className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400 transition-all duration-200"
                            />
                          </motion.div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {t('profile.form.lastName') || 'Last Name'}
                          </Label>
                          <motion.div whileFocus={{ scale: 1.01 }}>
                            <Input
                              id="lastName"
                              type="text"
                              value={profileForm.lastName}
                              onChange={e =>
                                setProfileForm({
                                  ...profileForm,
                                  lastName: e.target.value,
                                })
                              }
                              placeholder={
                                t('profile.form.lastNamePlaceholder') ||
                                'Your last name'
                              }
                              required
                              className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400 transition-all duration-200"
                            />
                          </motion.div>
                        </div>
                      </div>{' '}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {t('profile.form.email') || 'Email'}
                        </Label>
                        <motion.div whileFocus={{ scale: 1.01 }}>
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={e =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            placeholder={
                              t('profile.form.emailPlaceholder') ||
                              'your@email.com'
                            }
                            required
                            className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400 transition-all duration-200"
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {t('profile.form.phone') || 'Phone (optional)'}
                        </Label>
                        <motion.div whileFocus={{ scale: 1.01 }}>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileForm.phone}
                            onChange={e =>
                              setProfileForm({
                                ...profileForm,
                                phone: e.target.value,
                              })
                            }
                            placeholder={
                              t('profile.form.phonePlaceholder') ||
                              '+1 (555) 123-4567'
                            }
                            className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400 transition-all duration-200"
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={saving}
                          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-500 dark:to-blue-600 hover:from-amber-500 hover:to-orange-600 dark:hover:from-purple-600 dark:hover:to-blue-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {saving ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              {t('profile.form.saving') || 'Saving...'}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Save className="h-4 w-4" />
                              {t('profile.form.save') || 'Save Changes'}
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-purple-400/50 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-500/20 dark:to-blue-600/20 border-b border-amber-200 dark:border-purple-400/30">
                    <CardTitle className="text-gray-900 dark:text-white">
                      {t('profile.tabs.changePassword') || 'Change Password'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {t('profile.form.currentPassword') ||
                            'Current Password'}
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={e =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder={
                            t('profile.form.currentPasswordPlaceholder') ||
                            'Enter current password'
                          }
                          required
                          className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {t('profile.form.newPassword') || 'New Password'}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder={
                            t('profile.form.newPasswordPlaceholder') ||
                            'Enter new password (minimum 6 characters)'
                          }
                          required
                          minLength={6}
                          className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {t('profile.form.confirmPassword') ||
                            'Confirm New Password'}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder={
                            t('profile.form.confirmPasswordPlaceholder') ||
                            'Confirm new password'
                          }
                          required
                          minLength={6}
                          className="bg-white/80 dark:bg-gray-900/80 border-amber-200 dark:border-purple-400/50 focus:border-amber-400 dark:focus:border-purple-400"
                        />
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={saving}
                          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-500 dark:to-blue-600 hover:from-amber-500 hover:to-orange-600 dark:hover:from-purple-600 dark:hover:to-blue-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {saving ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              {t('profile.form.changing') || 'Changing...'}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              {t('profile.form.changePassword') ||
                                'Change Password'}
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
