'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProfileCompletion {
  hasAvatar: boolean;
  hasFirstName: boolean;
  hasLastName: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
}

interface ProfileCompletionIndicatorProps {
  profile: ProfileCompletion;
  className?: string;
}

export default function ProfileCompletionIndicator({
  profile,
  className = '',
}: ProfileCompletionIndicatorProps) {
  const t = useTranslations();

  const completionItems = [
    {
      key: 'avatar',
      label: t('profile.completion.avatar') || 'Profile Photo',
      completed: profile.hasAvatar,
      required: false,
    },
    {
      key: 'firstName',
      label: t('profile.completion.firstName') || 'First Name',
      completed: profile.hasFirstName,
      required: true,
    },
    {
      key: 'lastName',
      label: t('profile.completion.lastName') || 'Last Name',
      completed: profile.hasLastName,
      required: true,
    },
    {
      key: 'email',
      label: t('profile.completion.email') || 'Email Address',
      completed: profile.hasEmail,
      required: true,
    },
    {
      key: 'phone',
      label: t('profile.completion.phone') || 'Phone Number',
      completed: profile.hasPhone,
      required: false,
    },
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const totalCount = completionItems.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-400 to-emerald-500';
    if (percentage >= 60) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage === 100)
      return t('profile.completion.complete') || 'Profile Complete!';
    if (percentage >= 80)
      return t('profile.completion.almostComplete') || 'Almost Complete';
    if (percentage >= 60)
      return t('profile.completion.halfComplete') || 'Getting There';
    return t('profile.completion.justStarted') || 'Just Getting Started';
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('profile.completion.title') || 'Profile Completion'}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${getCompletionColor(percentage)} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {getCompletionMessage(percentage)}
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Completion Items */}
      <div className="space-y-2">
        {completionItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center gap-2"
          >
            {item.completed ? (
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
            )}
            <span
              className={`text-xs ${
                item.completed
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.label}
              {item.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </motion.div>
        ))}
      </div>

      {percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-3 p-2 bg-amber-50 dark:bg-purple-900/20 rounded-lg border border-amber-200 dark:border-purple-400/30"
        >
          <p className="text-xs text-amber-700 dark:text-purple-300">
            {t('profile.completion.tip') ||
              'Complete your profile to get the most out of our platform!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
