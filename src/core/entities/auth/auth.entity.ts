export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AuthActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

export interface ResetPasswordInput {
  email: string;
  redirectUrl: string;
}

export interface UpdatePasswordInput {
  newPassword: string;
}
