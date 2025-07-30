'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface VerificationCodeInputProps {
  onCodeComplete: (code: string) => void;
  onResendCode: () => void;
  isLoading: boolean;
  error: string;
  contact: string;
  type: 'email' | 'phone';
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function VerificationCodeInput({
  onCodeComplete,
  onResendCode,
  isLoading,
  error,
  contact,
  type,
}: VerificationCodeInputProps) {
  const t = useTranslations('resetPassword');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if code is complete
    const completeCode = newCode.join('');
    if (completeCode.length === 6 && completeCode.every(char => char !== '')) {
      onCodeComplete(completeCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
    
    // Check if code is complete
    const completeCode = newCode.join('');
    if (completeCode.length === 6 && completeCode.every(char => char !== '')) {
      onCodeComplete(completeCode);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60); // 60 second cooldown
    onResendCode();
  };

  const maskContact = (contact: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      const [local, domain] = contact.split('@');
      if (local.length <= 2) return contact;
      return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
    } else {
      if (contact.length <= 4) return contact;
      return `${contact.slice(0, 2)}${'*'.repeat(contact.length - 4)}${contact.slice(-2)}`;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="text-center"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-red-900/30 dark:to-red-800/30 mb-6">
          <span className="text-2xl">📧</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          {t('step2.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {t('step2.subtitle')} {maskContact(contact, type)}
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

      {/* Code Input */}
      <motion.div className="mb-8" variants={itemVariants}>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
          {t('step2.codeLabel')}
        </label>
        <div className="flex justify-center space-x-3">
          {code.map((digit, index) => (
            <motion.input
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl bg-white dark:bg-stone-950 text-neutral-900 dark:text-white transition-all ${
                error
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                  : 'border-neutral-300 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-red-500 focus:ring-blue-500 dark:focus:ring-red-500'
              } focus:outline-none focus:ring-2 disabled:opacity-50`}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Resend Code */}
      <motion.div className="text-center" variants={itemVariants}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          {t('step2.noCode')}
        </p>
        <motion.button
          type="button"
          onClick={handleResend}
          disabled={isLoading || resendCooldown > 0}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            resendCooldown > 0 || isLoading
              ? 'text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              : 'text-blue-600 dark:text-red-400 hover:text-blue-700 dark:hover:text-red-300 hover:bg-blue-50 dark:hover:bg-red-900/20'
          }`}
          whileHover={{ scale: resendCooldown > 0 || isLoading ? 1 : 1.05 }}
          whileTap={{ scale: resendCooldown > 0 || isLoading ? 1 : 0.95 }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {resendCooldown > 0
            ? `${t('step2.resendWait')} ${resendCooldown}s`
            : t('step2.resendCode')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
