import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = new SupabaseClient(
      'https://tbttriwluxapxmukdgcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidHRyaXdsdXhhcHhtdWtkZ2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODMzNTMsImV4cCI6MjA0NTE1OTM1M30.IELjZnoWXXcBz6OJTF5JLYyKFBW5Op3yb0YCoe6cYoU'
    );
  }

  async login(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      return user;
    } else {
      throw new Error(error.message);
    }
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
}
