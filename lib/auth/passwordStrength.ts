export interface PasswordAnalysis {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function analyzePasswordStrength(password: string): PasswordAnalysis {
  const analysis: PasswordAnalysis = {
    isValid: false,
    score: 0,
    feedback: [],
    requirements: {
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  };

  if (!password) {
    analysis.feedback.push('Password is required');
    return analysis;
  }

  // Check minimum length
  analysis.requirements.minLength = password.length >= 6;
  if (!analysis.requirements.minLength) {
    analysis.feedback.push('Password must be at least 6 characters long');
  }

  // Check for different character types
  analysis.requirements.hasLowercase = /[a-z]/.test(password);
  analysis.requirements.hasUppercase = /[A-Z]/.test(password);
  analysis.requirements.hasNumber = /\d/.test(password);
  analysis.requirements.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
    password
  );

  let score = 0;
  if (analysis.requirements.hasLowercase) score++;
  if (analysis.requirements.hasUppercase) score++;
  if (analysis.requirements.hasNumber) score++;
  if (analysis.requirements.hasSpecialChar) score++;

  analysis.score = score;

  // Password is valid if it has minimum length and at least 3 out of 4 character types
  if (analysis.requirements.minLength && score >= 3) {
    analysis.isValid = true;
  } else if (!analysis.requirements.minLength) {
    // Already added feedback above
  } else {
    analysis.feedback.push(
      'Password must contain at least 3 of the following: lowercase letter, uppercase letter, number, or special character'
    );
  }

  return analysis;
}
