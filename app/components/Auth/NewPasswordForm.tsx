'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, AlertCircle, Check, X } from 'lucide-react';

interface NewPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  error: string;
}

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function NewPasswordForm({
  onSubmit,
  isLoading,
  error,
}: NewPasswordFormProps) {
  const t = useTranslations('resetPassword');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const password = watch('password') || '';

  const passwordRequirements = [
    {
      id: 'length',
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'uppercase',
      text: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      text: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      id: 'number',
      text: 'One number',
      met: /\d/.test(password),
    },
    {
      id: 'special',
      text: 'One special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const handleFormSubmit = (data: PasswordFormData) => {
    onSubmit(data.password);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={itemVariants}>
      {/* Header */}
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-red-900/30 dark:to-red-800/30 mb-6">
          <Lock className="h-8 w-8 text-blue-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          {t('step3.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {t('step3.subtitle')}
        </p>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle
              className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5"
              size={18}
            />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        variants={itemVariants}
      >
        <div className="space-y-6">
          {/* New Password */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              {t('step3.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                className={`block w-full px-4 py-3 pl-12 pr-12 border ${
                  errors.password
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-red-500 focus:ring-blue-500 dark:focus:ring-red-500'
                } rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 bg-white dark:bg-stone-950 text-neutral-900 dark:text-white transition-all`}
                placeholder={t('step3.passwordPlaceholder')}
              />

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${
                    errors.password
                      ? 'text-red-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <AnimatePresence>
              {password && (
                <motion.div
                  className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {passwordRequirements.map(req => (
                      <motion.div
                        key={req.id}
                        className="flex items-center text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            req.met
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }
                        >
                          {req.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              {t('step3.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                className={`block w-full px-4 py-3 pl-12 pr-12 border ${
                  errors.confirmPassword
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-red-500 focus:ring-blue-500 dark:focus:ring-red-500'
                } rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 bg-white dark:bg-stone-950 text-neutral-900 dark:text-white transition-all`}
                placeholder={t('step3.confirmPasswordPlaceholder')}
              />

              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${
                    errors.confirmPassword
                      ? 'text-red-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.p
                  className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 dark:from-red-600 dark:to-red-700 hover:from-blue-700 hover:to-blue-800 dark:hover:from-red-700 dark:hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
              isLoading ? 'cursor-wait' : ''
            }`}
            variants={itemVariants}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  {t('step3.updating')}
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('step3.updatePassword')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
