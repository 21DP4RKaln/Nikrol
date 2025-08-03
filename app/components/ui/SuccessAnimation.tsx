'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
}

export default function SuccessAnimation({
  isVisible,
  message = 'Success!',
  onComplete,
}: SuccessAnimationProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onAnimationComplete={() => {
        if (onComplete) {
          setTimeout(onComplete, 2000); // Auto hide after 2 seconds
        }
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-amber-200 dark:border-purple-400/50 text-center max-w-sm mx-4"
      >
        {/* Success Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
          className="relative mx-auto mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.3, ease: 'easeOut' }}
            >
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, Math.cos((i * 60 * Math.PI) / 180) * 30],
                y: [0, Math.sin((i * 60 * Math.PI) / 180) * 30],
              }}
              transition={{
                delay: 0.8 + i * 0.1,
                duration: 1.2,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Sparkles className="h-4 w-4 text-amber-400 dark:text-purple-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Success Message */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {message}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-gray-600 dark:text-gray-300 text-sm"
        >
          Your changes have been saved successfully!
        </motion.p>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                scale: 0,
                x: 0,
                y: 0,
                rotate: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, -100 - Math.random() * 100],
                rotate: [0, Math.random() * 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: 0.9 + Math.random() * 0.5,
                duration: 1.5,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: [
                  '#f59e0b',
                  '#f97316',
                  '#eab308',
                  '#a855f7',
                  '#3b82f6',
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
