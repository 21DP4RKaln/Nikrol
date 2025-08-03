'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  AlertTriangle,
  User,
  Loader,
} from 'lucide-react';
import AnimatedButton from '@/app/components/ui/animated-button';
import styled from 'styled-components';
import Image from 'next/image';
import Loading from '@/app/components/ui/Loading';
import {
  useLoading,
  LoadingSpinner,
  FullPageLoading,
  ButtonLoading,
} from '@/app/hooks/useLoading';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { Checkbox } from '@/components/ui/checkbox';
import { analyzePasswordStrength } from '@/lib/auth/passwordStrength';

/*const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-apple"
    viewBox="0 0 16 16"
  >
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
  </svg>
);
*/

export default function AuthPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { login, register, socialLogin, loading } = useAuth();
  const { theme } = useTheme();
  const locale = pathname.split('/')[1];

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  // Move useEffects to the top level
  useEffect(() => {
    const containerElement = document.getElementById('container');
    setContainer(containerElement);
  }, []);

  useEffect(() => {
    if (container) {
      if (isSignUp) {
        container.classList.add('right-panel-active');
      } else {
        container.classList.remove('right-panel-active');
      }
    }
  }, [isSignUp, container]);

  useEffect(() => {
    if (searchParams.get('form') === 'register') {
      setIsSignUp(true);
    }
    const formParam = searchParams.get('form');
    if (formParam === 'login' || formParam === 'signin') {
      setIsSignUp(false);
    } else if (formParam === 'register' || formParam === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Only auto-switch between email and phone in registration form
    if (name === 'email' && value && !value.includes('@') && isSignUp) {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue) {
        setFormData(prev => ({
          ...prev,
          phone: value,
          email: '',
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading size="medium" />
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { email, phone, password } = formData;

      if ((!email && !phone) || !password) {
        throw new Error('Please enter email or phone and password');
      }

      const identifier = email || phone;

      console.log('Attempting login with:', { identifier });

      await login(identifier, password);
    } catch (error: any) {
      console.error('Login submission error:', error);
      setError(error.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        acceptTerms,
      } = formData;

      if (!firstName || !lastName || !password) {
        throw new Error('Please fill in all required fields');
      }

      if (!email && !phone) {
        throw new Error('Please provide either email or phone number');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Use password strength validation
      const passwordAnalysis = analyzePasswordStrength(password);
      if (!passwordAnalysis.isValid) {
        throw new Error(
          'Password must contain at least 3 of the following: lowercase letter, uppercase letter, number, or special character'
        );
      }

      if (!acceptTerms) {
        throw new Error(t('auth.termsRequired'));
      }

      await register(
        email || '',
        password,
        `${firstName} ${lastName}`,
        phone || ''
      );
      // Removed router.push - AuthContext now handles redirection
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  /* const handleSocialLogin = async (
    provider: 'google' | 'apple' | 'linkedin'
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await socialLogin(provider);
    } catch (error: any) {
      setError(error.message || `${provider} login failed`);
    } finally {
      setIsSubmitting(false);
    }
  };
  */

  return (
    <PageWrapper theme={theme}>
      <FloatingParticles theme={theme} />
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        {' '}
        <Link href={`/${locale}`}>
          <AnimatedButton
            title={t('buttons.back')}
            direction="left"
            className="text-gray-200"
          />
        </Link>
      </div>

      <Container
        className={isSignUp ? 'right-panel-active' : ''}
        id="container"
        theme={theme}
      >
        {/* Sign Up Form */}
        <SignUpContainer className="sign-up-container">
          {' '}
          <Form onSubmit={handleRegisterSubmit} theme={theme}>
            {' '}
            <Title theme={theme}>{t('auth.createAccount')}</Title>
            {/* Social Login Buttons 
            <SocialContainer>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('google')}
                theme={theme}
              >
                <GoogleIcon />
              </SocialButton>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('apple')}
                theme={theme}
              >
                <AppleIcon />
              </SocialButton>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('linkedin')}
                theme={theme}
              >
                <LinkedInIcon />
              </SocialButton> 
            </SocialContainer> */}
            {error && isSignUp && (
              <ErrorMessage theme={theme}>
                <AlertTriangle
                  size={18}
                  className="mr-2 mt-0.5 flex-shrink-0"
                />
                <p>{error}</p>
              </ErrorMessage>
            )}
            <FormGrid>
              <InputGroup>
                <StyledInput>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder={t('auth.firstName')}
                    autoComplete="off"
                  />
                </StyledInput>
              </InputGroup>
              <InputGroup>
                <StyledInput>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder={t('auth.lastName')}
                    autoComplete="off"
                  />
                </StyledInput>
              </InputGroup>
              <InputGroup $fullWidth>
                <StyledInput>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder={t('auth.emailOptional')}
                    autoComplete="off"
                  />
                </StyledInput>
              </InputGroup>
              <InputGroup $fullWidth>
                <StyledInput>
                  <PhoneInput
                    value={formData.phone}
                    onChange={value =>
                      handleInputChange({
                        target: { name: 'phone', value },
                      } as any)
                    }
                    className="input"
                    placeholder={t('auth.phoneOptional')}
                  />
                </StyledInput>
              </InputGroup>
              <InputGroup $fullWidth>
                <PasswordWrapper>
                  <StyledInput>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input"
                      placeholder={t('auth.password')}
                      autoComplete="off"
                    />
                  </StyledInput>
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    theme={theme}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </PasswordToggle>
                </PasswordWrapper>
              </InputGroup>
              <InputGroup $fullWidth>
                <PasswordWrapper>
                  <StyledInput>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input"
                      placeholder={t('auth.confirmPassword')}
                      autoComplete="off"
                    />
                  </StyledInput>
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    theme={theme}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}{' '}
                  </PasswordToggle>
                </PasswordWrapper>
              </InputGroup>{' '}
            </FormGrid>
            {/* Password Strength Indicator */}
            {isSignUp && formData.password && (
              <div className="space-y-3 mb-4">
                {(() => {
                  const passwordAnalysis = analyzePasswordStrength(
                    formData.password
                  );
                  const strength = passwordAnalysis.score;
                  const getStrengthText = (strength: number) => {
                    if (strength <= 2)
                      return t(
                        'auth.resetPassword.step3.passwordStrength.weak'
                      );
                    if (strength <= 3)
                      return t(
                        'auth.resetPassword.step3.passwordStrength.fair'
                      );
                    if (strength <= 4)
                      return t(
                        'auth.resetPassword.step3.passwordStrength.good'
                      );
                    return t(
                      'auth.resetPassword.step3.passwordStrength.strong'
                    );
                  };

                  return (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          {' '}
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {t('auth.passwordStrength')}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              strength <= 2
                                ? 'text-red-500'
                                : strength <= 3
                                  ? 'text-yellow-500'
                                  : strength <= 4
                                    ? 'text-blue-500'
                                    : 'text-green-500'
                            }`}
                          >
                            {getStrengthText(strength)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map(level => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                level <= strength
                                  ? strength <= 2
                                    ? 'bg-red-500'
                                    : strength <= 3
                                      ? 'bg-yellow-500'
                                      : strength <= 4
                                        ? 'bg-blue-500'
                                        : 'bg-green-500'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-2 space-y-1">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <div
                            className={`flex items-center text-xs ${
                              passwordAnalysis.requirements.minLength
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full mr-1 ${
                                passwordAnalysis.requirements.minLength
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />{' '}
                            <span>
                              {t('auth.passwordRequirements.minLength')}
                            </span>
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordAnalysis.requirements.hasLowercase
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full mr-1 ${
                                passwordAnalysis.requirements.hasLowercase
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                            <span>
                              {t('auth.passwordRequirements.lowercase')}
                            </span>
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordAnalysis.requirements.hasUppercase
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full mr-1 ${
                                passwordAnalysis.requirements.hasUppercase
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                            <span>
                              {t('auth.passwordRequirements.uppercase')}
                            </span>
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordAnalysis.requirements.hasNumber
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full mr-1 ${
                                passwordAnalysis.requirements.hasNumber
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                            <span>
                              {t('auth.passwordRequirements.numbers')}
                            </span>
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordAnalysis.requirements.hasSpecialChar
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full mr-1 ${
                                passwordAnalysis.requirements.hasSpecialChar
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                            <span>
                              {t('auth.passwordRequirements.special')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            {/* Terms and Conditions Checkbox */}
            <TermsCheckboxWrapper>
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked: boolean) => {
                  setFormData(prev => ({
                    ...prev,
                    acceptTerms: checked === true,
                  }));
                }}
              />
              <TermsLabel htmlFor="acceptTerms" theme={theme}>
                {t('auth.acceptTerms')}{' '}
                <TermsLink
                  href={`/${locale}/terms-of-service`}
                  target="_blank"
                  theme={theme}
                >
                  {t('auth.termsOfService')}
                </TermsLink>
              </TermsLabel>
            </TermsCheckboxWrapper>
            <StyledButton>
              <button
                type="submit"
                className="Btn-Container"
                disabled={isSubmitting}
              >
                <span className="text">
                  {isSubmitting ? t('auth.signingUp') : t('auth.signUp')}
                </span>
                <span className="icon-Container">
                  <svg
                    width={16}
                    height={19}
                    viewBox="0 0 16 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1.61321" cy="1.61321" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="1.61321" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="5.5566" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="5.5566" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="9.5" r="1.5" fill="white" />
                    <circle cx="13.9811" cy="9.5" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="13.4434" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="13.4434" r="1.5" fill="white" />
                    <circle cx="1.61321" cy="17.3868" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="17.3868" r="1.5" fill="white" />
                  </svg>
                </span>
              </button>
            </StyledButton>
          </Form>
        </SignUpContainer>

        {/* Sign In Form */}
        <SignInContainer className="sign-in-container">
          {' '}
          <Form onSubmit={handleLoginSubmit} theme={theme}>
            {' '}
            <Title theme={theme}>{t('buttons.login')}</Title>
            {/* Social Login Buttons 
            <SocialContainer>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('google')}
                theme={theme}
              >
                <GoogleIcon />
              </SocialButton>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('apple')}
                theme={theme}
              >
                <AppleIcon />
              </SocialButton>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('linkedin')}
                theme={theme}
              >
                <LinkedInIcon />
              </SocialButton>
            </SocialContainer> */}
            {error && !isSignUp && (
              <ErrorMessage theme={theme}>
                <AlertTriangle
                  size={18}
                  className="mr-2 mt-0.5 flex-shrink-0"
                />
                <p>{error}</p>
              </ErrorMessage>
            )}
            <StyledInput>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder={
                  t('common.email') +
                  ' ' +
                  t('common.or') +
                  ' ' +
                  t('contact.phoneLabel')
                }
                autoComplete="off"
              />
            </StyledInput>
            <PasswordWrapper>
              <StyledInput>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input"
                  placeholder={t('auth.password')}
                  autoComplete="off"
                />
              </StyledInput>
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                theme={theme}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordWrapper>
            <StyledLink href={`/${locale}/auth/forgot-password`} theme={theme}>
              {t('auth.forgotPassword')}
            </StyledLink>
            <StyledButton>
              <button
                type="submit"
                className="Btn-Container"
                disabled={isSubmitting}
              >
                <span className="text">
                  {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
                </span>
                <span className="icon-Container">
                  <svg
                    width={16}
                    height={19}
                    viewBox="0 0 16 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1.61321" cy="1.61321" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="1.61321" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="5.5566" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="5.5566" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="9.5" r="1.5" fill="white" />
                    <circle cx="13.9811" cy="9.5" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="13.4434" r="1.5" fill="white" />
                    <circle cx="9.85851" cy="13.4434" r="1.5" fill="white" />
                    <circle cx="1.61321" cy="17.3868" r="1.5" fill="white" />
                    <circle cx="5.73583" cy="17.3868" r="1.5" fill="white" />
                  </svg>
                </span>
              </button>
            </StyledButton>
          </Form>
        </SignInContainer>

        {/* Overlay */}
        <OverlayContainer className="overlay-container">
          <Overlay className="overlay" theme={theme}>
            {' '}
            <OverlayPanel className="overlay-panel overlay-left">
              <Title theme="light">{t('auth.haveProfileTitle')}</Title>
              <Paragraph>{t('auth.thenLogin')}</Paragraph>{' '}
              <AnimatedButtonWrapper>
                <button
                  type="button"
                  className="animated-button ghost"
                  onClick={toggleForm}
                >
                  <span>{t('buttons.login')}</span>
                  <span />
                </button>
              </AnimatedButtonWrapper>
            </OverlayPanel>{' '}
            <OverlayPanel className="overlay-panel overlay-right">
              <Title theme="light">{t('auth.firstTimeTitle')}</Title>
              <Paragraph>{t('auth.thenRegister')}</Paragraph>{' '}
              <AnimatedButtonWrapper>
                <button
                  type="button"
                  className="animated-button ghost"
                  onClick={toggleForm}
                >
                  <span>{t('buttons.register')}</span>
                  <span />
                </button>
              </AnimatedButtonWrapper>
            </OverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </PageWrapper>
  );
}

{
  /* Styled Components */
}
export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${props =>
    props.theme === 'dark'
      ? 'linear-gradient(135deg, #0f1419 0%, #1a237e 15%, #3949ab 30%, #5e35b1 45%, #7b1fa2 60%, #8e24aa 75%, #9c27b0 90%, #ad47d4 100%)'
      : 'linear-gradient(135deg, #ffd54f 0%, #ffb74d 15%, #ff9800 30%, #ff5722 45%, #795548 60%, #5d4037 75%, #424242 90%, #263238 100%)'};
  background-size: 400% 400%;
  animation: backgroundMove 25s ease infinite;

  /* Дополнительный слой анимированных узоров */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(
        circle at 15% 30%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(94, 53, 177, 0.4)'
              : 'rgba(255, 181, 77, 0.4)'}
          0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 85% 20%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(156, 39, 176, 0.3)'
              : 'rgba(255, 152, 0, 0.3)'}
          0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 80%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(173, 71, 212, 0.3)'
              : 'rgba(121, 85, 72, 0.3)'}
          0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 20% 90%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(57, 73, 171, 0.4)'
              : 'rgba(66, 66, 66, 0.3)'}
          0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 70% 10%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(123, 31, 162, 0.2)'
              : 'rgba(255, 87, 34, 0.2)'}
          0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 90% 70%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(26, 35, 126, 0.3)'
              : 'rgba(93, 64, 55, 0.3)'}
          0%,
        transparent 55%
      ),
      /* Добавляем движущиеся геометрические формы */
        conic-gradient(
          from 0deg at 25% 25%,
          ${props =>
              props.theme === 'dark'
                ? 'rgba(156, 39, 176, 0.1)'
                : 'rgba(255, 152, 0, 0.1)'}
            0deg,
          transparent 60deg,
          ${props =>
              props.theme === 'dark'
                ? 'rgba(94, 53, 177, 0.1)'
                : 'rgba(255, 87, 34, 0.1)'}
            120deg,
          transparent 180deg
        ),
      conic-gradient(
        from 180deg at 75% 75%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(57, 73, 171, 0.1)'
              : 'rgba(121, 85, 72, 0.1)'}
          0deg,
        transparent 90deg,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(123, 31, 162, 0.1)'
              : 'rgba(66, 66, 66, 0.1)'}
          180deg,
        transparent 270deg
      );
    animation: float 30s ease-in-out infinite;
  }

  /* Сияющий световой эффект с пульсирующими кольцами */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      /* Основной сияющий эффект */
      linear-gradient(
        45deg,
        transparent 30%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(156, 39, 176, 0.05)'
              : 'rgba(255, 181, 77, 0.1)'}
          50%,
        transparent 70%
      ),
      /* Пульсирующие световые кольца */
        radial-gradient(
          circle at 20% 30%,
          ${props =>
              props.theme === 'dark'
                ? 'rgba(156, 39, 176, 0.3)'
                : 'rgba(255, 152, 0, 0.3)'}
            20%,
          transparent 21%,
          transparent 30%,
          ${props =>
              props.theme === 'dark'
                ? 'rgba(94, 53, 177, 0.2)'
                : 'rgba(255, 87, 34, 0.2)'}
            31%,
          transparent 32%
        ),
      radial-gradient(
        circle at 80% 70%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(123, 31, 162, 0.3)'
              : 'rgba(121, 85, 72, 0.3)'}
          15%,
        transparent 16%,
        transparent 25%,
        ${props =>
            props.theme === 'dark'
              ? 'rgba(57, 73, 171, 0.2)'
              : 'rgba(66, 66, 66, 0.2)'}
          26%,
        transparent 27%
      );
    animation:
      shimmer 10s ease-in-out infinite,
      pulse-rings 8s ease-in-out infinite;
  }

  /* Звездное небо для темной темы и солнечные блики для светлой */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props =>
      props.theme === 'dark'
        ? `
          /* Звезды */
          radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
          radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.6), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.9), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.7), transparent),
          radial-gradient(1px 1px at 160px 30px, rgba(255, 255, 255, 0.5), transparent),
          radial-gradient(2px 2px at 200px 60px, rgba(156, 39, 176, 0.8), transparent),
          radial-gradient(1px 1px at 250px 90px, rgba(255, 255, 255, 0.6), transparent),
          radial-gradient(1px 1px at 300px 20px, rgba(255, 255, 255, 0.8), transparent),
          radial-gradient(2px 2px at 350px 70px, rgba(94, 53, 177, 0.7), transparent),
          radial-gradient(1px 1px at 400px 40px, rgba(255, 255, 255, 0.9), transparent)
        `
        : `
          /* Солнечные блики */
          radial-gradient(3px 3px at 20px 30px, rgba(255, 255, 255, 0.9), transparent),
          radial-gradient(2px 2px at 60px 70px, rgba(255, 215, 77, 0.8), transparent),
          radial-gradient(4px 4px at 120px 40px, rgba(255, 255, 255, 0.7), transparent),
          radial-gradient(2px 2px at 180px 80px, rgba(255, 183, 77, 0.6), transparent),
          radial-gradient(3px 3px at 240px 30px, rgba(255, 255, 255, 0.8), transparent),
          radial-gradient(2px 2px at 300px 60px, rgba(255, 152, 0, 0.7), transparent),
          radial-gradient(4px 4px at 360px 90px, rgba(255, 255, 255, 0.5), transparent),
          radial-gradient(2px 2px at 420px 20px, rgba(255, 87, 34, 0.6), transparent),
          radial-gradient(3px 3px at 480px 70px, rgba(255, 255, 255, 0.8), transparent),
          radial-gradient(2px 2px at 540px 40px, rgba(255, 152, 0, 0.7), transparent)
        `};
    background-size:
      600px 400px,
      500px 300px,
      700px 500px;
    animation: ${props =>
      props.theme === 'dark'
        ? 'twinkle 4s linear infinite'
        : 'sparkle 6s ease-in-out infinite'};
    pointer-events: none;
    z-index: 1;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(1);
    }
    25% {
      opacity: 0.8;
      transform: scale(1.1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    75% {
      opacity: 0.6;
      transform: scale(1.15);
    }
  }

  @keyframes backgroundMove {
    0%,
    100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 50%;
    }
    75% {
      background-position: 0% 100%;
    }
  }

  @keyframes float {
    0%,
    100% {
      opacity: 0.6;
      transform: translate(0px, 0px) scale(1) rotate(0deg);
    }
    25% {
      opacity: 0.8;
      transform: translate(30px, -30px) scale(1.1) rotate(5deg);
    }
    50% {
      opacity: 0.9;
      transform: translate(-10px, -40px) scale(1.05) rotate(-3deg);
    }
    75% {
      opacity: 0.7;
      transform: translate(-20px, 20px) scale(0.9) rotate(8deg);
    }
  }

  @keyframes shimmer {
    0%,
    100% {
      transform: translateX(-100%) skewX(-15deg);
      opacity: 0;
    }
    25% {
      transform: translateX(-50%) skewX(-10deg);
      opacity: 0.3;
    }
    50% {
      transform: translateX(0%) skewX(-5deg);
      opacity: 1;
    }
    75% {
      transform: translateX(50%) skewX(-10deg);
      opacity: 0.6;
    }
    100% {
      transform: translateX(100%) skewX(-15deg);
      opacity: 0;
    }
  }

  @keyframes pulse-rings {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
    25% {
      transform: scale(1.1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    75% {
      transform: scale(1.05);
      opacity: 0.7;
    }
  }

  /* Добавляем плавающие частицы */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props =>
      Array.from({ length: 12 }, (_, i) => {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const size = Math.floor(Math.random() * 3) + 1;
        return `radial-gradient(circle at ${x}% ${y}%, ${
          props.theme === 'dark'
            ? `rgba(${156 + Math.floor(Math.random() * 50)}, ${39 + Math.floor(Math.random() * 30)}, ${176 + Math.floor(Math.random() * 50)}, 0.${Math.floor(Math.random() * 3) + 1})`
            : `rgba(${255}, ${152 + Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100)}, 0.${Math.floor(Math.random() * 3) + 1})`
        } 0%, transparent ${size}px)`;
      }).join(', ')};
    animation: particles 40s linear infinite;
    pointer-events: none;
  }

  @keyframes particles {
    0% {
      transform: translateY(0px) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-50px) rotate(180deg);
      opacity: 0.5;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }
`;

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props =>
      props.theme === 'dark'
        ? `
            radial-gradient(circle at 25% 25%, rgba(94, 53, 177, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(26, 35, 126, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.08) 0%, transparent 60%),
            linear-gradient(45deg, rgba(57, 73, 171, 0.1) 0%, rgba(123, 31, 162, 0.08) 100%)
          `
        : `
            radial-gradient(circle at 25% 25%, rgba(255, 181, 77, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(93, 64, 55, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.12) 0%, transparent 60%),
            linear-gradient(45deg, rgba(255, 87, 34, 0.15) 0%, rgba(66, 66, 66, 0.2) 100%)
          `};
    animation: gradientShift 15s ease-in-out infinite;
  }

  @keyframes gradientShift {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
`;

export const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${props =>
    props.theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(1px);
`;

export const Container = styled.div`
  background: ${props =>
    props.theme === 'dark'
      ? 'linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(25, 25, 35, 0.92) 50%, rgba(35, 25, 45, 0.9) 100%)'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(240, 245, 251, 0.9) 100%)'};
  backdrop-filter: blur(25px);
  border: 1px solid
    ${props =>
      props.theme === 'dark'
        ? 'rgba(156, 39, 176, 0.25)'
        : 'rgba(255, 181, 77, 0.3)'};
  border-radius: 25px;
  box-shadow: ${props =>
    props.theme === 'dark'
      ? `
          0 35px 80px rgba(0, 0, 0, 0.7),
          0 15px 30px rgba(94, 53, 177, 0.3),
          0 0 0 1px rgba(156, 39, 176, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `
      : `
          0 35px 80px rgba(0, 0, 0, 0.2),
          0 15px 30px rgba(255, 152, 0, 0.2),
          0 0 0 1px rgba(255, 181, 77, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.7),
          inset 0 -1px 0 rgba(0, 0, 0, 0.05)
        `};
  position: relative;
  overflow: hidden;
  width: 1100px;
  max-width: 95%;
  min-height: 750px;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props =>
      props.theme === 'dark'
        ? `
          radial-gradient(circle at 30% 20%, rgba(94, 53, 177, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(156, 39, 176, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, rgba(123, 31, 162, 0.06) 0%, rgba(57, 73, 171, 0.08) 100%)
        `
        : `
          radial-gradient(circle at 30% 20%, rgba(255, 181, 77, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 152, 0, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 87, 34, 0.06) 0%, rgba(66, 66, 66, 0.08) 100%)
        `};
    border-radius: 25px;
    pointer-events: none;
    animation: innerGlow 12s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props =>
      props.theme === 'dark'
        ? 'linear-gradient(45deg, rgba(94, 53, 177, 0.4), rgba(156, 39, 176, 0.4), rgba(123, 31, 162, 0.4), rgba(57, 73, 171, 0.4))'
        : 'linear-gradient(45deg, rgba(255, 181, 77, 0.4), rgba(255, 152, 0, 0.4), rgba(255, 87, 34, 0.4), rgba(66, 66, 66, 0.4))'};
    border-radius: 27px;
    z-index: -1;
    opacity: 0;
    animation: borderGlow 8s ease-in-out infinite;
  }

  @keyframes innerGlow {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes borderGlow {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 0.6;
    }
  }

  &.right-panel-active .sign-in-container {
    transform: translateX(100%);
  }

  &.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
  }

  @keyframes show {
    0%,
    49.99% {
      opacity: 0;
      z-index: 1;
    }

    50%,
    100% {
      opacity: 1;
      z-index: 5;
    }
  }

  &.right-panel-active .overlay-container {
    transform: translateX(-100%);
  }

  &.right-panel-active .overlay {
    transform: translateX(50%);
  }

  .overlay-left {
    transform: translateX(-20%);
  }

  .overlay-right {
    transform: translateX(0);
  }

  &.right-panel-active .overlay-left {
    transform: translateX(0);
  }

  &.right-panel-active .overlay-right {
    transform: translateX(20%);
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
    border-radius: 0;
  }
`;

export const FormContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
`;

export const SignInContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SignUpContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Form = styled.form`
  background: ${props =>
    props.theme === 'dark'
      ? 'linear-gradient(145deg, rgba(20, 20, 25, 0.85) 0%, rgba(30, 30, 40, 0.7) 50%, rgba(25, 20, 35, 0.8) 100%)'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(245, 247, 250, 0.85) 100%)'};
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 60px;
  height: 100%;
  text-align: center;
  border-radius: 25px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props =>
      props.theme === 'dark'
        ? `
          radial-gradient(circle at 20% 30%, rgba(94, 53, 177, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(156, 39, 176, 0.06) 0%, transparent 60%)
        `
        : `
          radial-gradient(circle at 20% 30%, rgba(255, 181, 77, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(255, 152, 0, 0.06) 0%, transparent 60%)
        `};
    pointer-events: none;
    animation: formGlow 10s ease-in-out infinite;
  }

  @keyframes formGlow {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0 0 20px 0;
  color: ${props => (props.theme === 'dark' ? '#ffffff' : '#1f2937')};
  background: ${props =>
    props.theme === 'dark'
      ? 'linear-gradient(135deg, #e1bee7 0%, #ba68c8 50%, #9c27b0 100%)'
      : 'linear-gradient(135deg, #ffb74d 0%, #ff9800 50%, #5d4037 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  text-shadow: ${props =>
    props.theme === 'dark'
      ? '0 0 20px rgba(156, 39, 176, 0.3)'
      : '0 0 20px rgba(255, 152, 0, 0.2)'};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
`;

export const InputGroup = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${props => (props.$fullWidth ? '1 / -1' : 'span 1')};
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => (props.theme === 'dark' ? '#9ca3af' : '#666')};
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  /* Specific positioning for login form */
  .sign-in-container & {
    top: 40%;
  }

  &:hover {
    color: ${props => (props.theme === 'dark' ? '#fff' : '#333')};
  }
`;

export const SocialContainer = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 15px;
`;

export const SocialButton = styled.button`
  border: 1px solid ${props => (props.theme === 'dark' ? '#555' : '#DDDDDD')};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => (props.theme === 'dark' ? '#fff' : '#333')};

  &:hover {
    background-color: ${props => (props.theme === 'dark' ? '#333' : '#f0f0f0')};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: #ffffff;
`;

export const Span = styled.span`
  font-size: 12px;
  color: ${props => (props.theme === 'dark' ? '#999' : '#333')};
`;

export const StyledLink = styled(Link)`
  color: ${props => (props.theme === 'dark' ? '#999' : '#333')};
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;

  &:hover {
    color: ${props => (props.theme === 'dark' ? '#ffffff' : '#dc2626')};
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Overlay = styled.div`
  background: ${props =>
    props.theme === 'dark'
      ? `
        linear-gradient(135deg, 
          rgba(26, 35, 126, 0.9) 0%, 
          rgba(57, 73, 171, 0.9) 20%, 
          rgba(94, 53, 177, 0.9) 40%, 
          rgba(123, 31, 162, 0.9) 60%, 
          rgba(142, 36, 170, 0.9) 80%, 
          rgba(156, 39, 176, 0.9) 100%
        )
      `
      : `
        linear-gradient(135deg, 
          rgba(255, 213, 79, 0.9) 0%, 
          rgba(255, 183, 77, 0.9) 20%, 
          rgba(255, 152, 0, 0.9) 40%, 
          rgba(255, 87, 34, 0.9) 60%, 
          rgba(121, 85, 72, 0.9) 80%, 
          rgba(66, 66, 66, 0.9) 100%
        )
      `};
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 70%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 50%
      );
    animation: overlayFloat 20s ease-in-out infinite;
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes overlayFloat {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  &.overlay-left {
    transform: translateX(-20%);
  }

  &.overlay-right {
    right: 0;
    transform: translateX(0);
  }

  .right-panel-active & {
    &.overlay-left {
      transform: translateX(0);
    }

    &.overlay-right {
      transform: translateX(20%);
    }
  }
`;

export const ErrorMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: ${props =>
    props.theme === 'dark' ? 'rgba(127, 29, 29, 0.3)' : '#fee2e2'};
  color: ${props => (props.theme === 'dark' ? '#f87171' : '#b91c1c')};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

export const StyledInput = styled.div`
  margin-bottom: 15px;
  width: 100%;

  .input {
    border: none;
    outline: none;
    border-radius: 15px;
    padding: 1.1em;
    background: ${props =>
      props.theme === 'dark'
        ? `
          linear-gradient(145deg, rgba(45, 45, 45, 0.8) 0%, rgba(60, 60, 60, 0.6) 100%)
        `
        : `
          linear-gradient(145deg, rgba(243, 244, 246, 0.9) 0%, rgba(249, 250, 251, 0.7) 100%)
        `};
    backdrop-filter: blur(10px);
    border: 1px solid
      ${props =>
        props.theme === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.05)'};
    box-shadow: ${props =>
      props.theme === 'dark'
        ? `
          inset 2px 5px 10px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `
        : `
          inset 2px 5px 10px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.5)
        `};
    transition: all 300ms ease-in-out;
    width: 100%;
    font-size: 14px;
    color: ${props => (props.theme === 'dark' ? '#ffffff' : '#1f2937')};
  }

  .input:focus {
    background: ${props =>
      props.theme === 'dark'
        ? `
          linear-gradient(145deg, rgba(26, 26, 26, 0.9) 0%, rgba(40, 40, 40, 0.7) 100%)
        `
        : `
          linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%)
        `};
    transform: scale(1.02);
    border-color: ${props =>
      props.theme === 'dark'
        ? 'rgba(156, 39, 176, 0.6)'
        : 'rgba(255, 152, 0, 0.6)'};
    box-shadow: ${props =>
      props.theme === 'dark'
        ? `
          0 0 20px rgba(156, 39, 176, 0.3),
          inset 2px 5px 10px rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(156, 39, 176, 0.4)
        `
        : `
          0 0 20px rgba(255, 152, 0, 0.2),
          inset 2px 5px 10px rgba(0, 0, 0, 0.05),
          0 0 0 1px rgba(255, 152, 0, 0.4)
        `};
  }

  .input::placeholder {
    color: ${props => (props.theme === 'dark' ? '#9ca3af' : '#6b7280')};
  }
`;

export const StyledButton = styled.div`
  margin-top: 20px;

  .Btn-Container {
    display: flex;
    width: 170px;
    height: fit-content;
    background: ${props =>
      props.theme === 'dark'
        ? `
          radial-gradient(
            65.28% 65.28% at 50% 100%,
            rgba(156, 39, 176, 0.8) 0%,
            rgba(156, 39, 176, 0) 100%
          ),
          linear-gradient(121deg, #1a237e, #5e35b1, #9c27b0)
        `
        : `
          radial-gradient(
            65.28% 65.28% at 50% 100%,
            rgba(255, 152, 0, 0.8) 0%,
            rgba(255, 152, 0, 0) 100%
          ),
          linear-gradient(121deg, #ffd54f, #ff9800, #5d4037)
        `};
    border-radius: 40px;
    box-shadow: ${props =>
      props.theme === 'dark'
        ? '0px 5px 10px rgba(156, 39, 176, 0.4)'
        : '0px 5px 10px rgba(255, 152, 0, 0.4)'};
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .Btn-Container:hover {
    background: ${props =>
      props.theme === 'dark'
        ? `
          radial-gradient(
            65.28% 65.28% at 50% 100%,
            rgba(156, 39, 176, 0.9) 0%,
            rgba(156, 39, 176, 0) 100%
          ),
          linear-gradient(121deg, #3949ab, #7b1fa2, #ad47d4)
        `
        : `
          radial-gradient(
            65.28% 65.28% at 50% 100%,
            rgba(255, 152, 0, 0.9) 0%,
            rgba(255, 152, 0, 0) 100%
          ),
          linear-gradient(121deg, #ffb74d, #ff5722, #424242)
        `};
    transform: translateY(-2px);
  }

  .icon-Container {
    width: 45px;
    height: 45px;
    background-color: ${props =>
      props.theme === 'dark' ? '#4a4848' : '#4a4848'};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid
      ${props => (props.theme === 'dark' ? '#000000' : '#000000')};
  }

  .text {
    width: calc(170px - 45px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1em;
    letter-spacing: 1.2px;
    font-weight: 500;
  }

  .icon-Container svg {
    transition-duration: 1.5s;
  }

  .Btn-Container:hover .icon-Container svg {
    transition-duration: 1.5s;
    animation: arrow 1s linear infinite;
  }

  @keyframes arrow {
    0% {
      opacity: 0;
      margin-left: 0px;
    }
    100% {
      opacity: 1;
      margin-left: 10px;
    }
  }
`;

export const AnimatedButtonWrapper = styled.div`
  .animated-button {
    position: relative;
    display: inline-block;
    padding: 12px 24px;
    border: none;
    font-size: 16px;
    background-color: inherit;
    border-radius: 100px;
    font-weight: 600;
    color: #ffffff40;
    box-shadow: 0 0 0 2px #ffffff20;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button span:last-child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button span:first-child {
    position: relative;
    z-index: 1;
  }

  .animated-button:hover {
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
    color: rgb(8, 8, 8);
  }

  .animated-button:active {
    scale: 0.95;
  }

  .animated-button:hover span:last-child {
    width: 150px;
    height: 150px;
    opacity: 1;
  }

  .animated-button.ghost {
    background-color: transparent;
    border-color: #ffffff;
  }
`;

export const TermsCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
`;

export const TermsLabel = styled.label`
  font-size: 14px;
  color: ${props => (props.theme === 'dark' ? '#e5e7eb' : '#374151')};
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
`;

export const TermsLink = styled(Link)`
  color: ${props => (props.theme === 'dark' ? '#60a5fa' : '#2563eb')};
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => (props.theme === 'dark' ? '#93c5fd' : '#1d4ed8')};
  }
`;

// Компонент анимированных частиц
const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${props =>
      props.theme === 'dark'
        ? 'rgba(156, 39, 176, 0.6)'
        : 'rgba(255, 152, 0, 0.6)'};
    animation: float-particle 12s linear infinite;
  }

  &::before {
    top: 10%;
    left: 20%;
    animation-delay: -2s;
    animation-duration: 15s;
  }

  &::after {
    top: 60%;
    right: 25%;
    animation-delay: -8s;
    animation-duration: 18s;
    background: ${props =>
      props.theme === 'dark'
        ? 'rgba(94, 53, 177, 0.5)'
        : 'rgba(255, 87, 34, 0.5)'};
  }

  @keyframes float-particle {
    0% {
      transform: translateY(100vh) translateX(0px) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
      transform: translateY(90vh) translateX(20px) scale(1);
    }
    90% {
      opacity: 1;
      transform: translateY(-10vh) translateX(-20px) scale(0.8);
    }
    100% {
      opacity: 0;
      transform: translateY(-20vh) translateX(0px) scale(0);
    }
  }
`;
