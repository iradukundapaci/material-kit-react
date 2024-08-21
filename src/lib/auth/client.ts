'use client';

import type { User } from '@/types/user';

import { supabase } from '../supabase-client';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  email: string;
  password: string;
  options: {
    data: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { email, password, options } = params;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      return { error: error.message };
    }

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    const { data } = await supabase.auth.getUser();

    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    const user = {
      id: data.user.id,
      avatar: '/assets/avatar.png', // Placeholder, as no avatar URL is provided in the data
      firstName: data.user.user_metadata.firstName,
      lastName: data.user.user_metadata.lastName,
      email: data.user.email,
    } satisfies User;

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
