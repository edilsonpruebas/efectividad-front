import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'auth_user';

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const savedUser = this.loadUser();
    if (savedUser) {
      this.userSubject.next(savedUser);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getStorage(): Storage | null {
    if (!this.isBrowser()) return null;
    return sessionStorage;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; user: AuthUser }>(
      `${environment.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        const storage = this.getStorage();
        if (storage) {
          storage.setItem(this.TOKEN_KEY, res.token);
          storage.setItem(this.USER_KEY, JSON.stringify(res.user));
        }
        this.userSubject.next(res.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error:    () => this.clearSession(),
    });
  }

  private clearSession(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.TOKEN_KEY);
      storage.removeItem(this.USER_KEY);
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const storage = this.getStorage();
    if (!storage) return null;
    return storage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }

  isSupervisor(): boolean {
    return this.getUser()?.role === 'SUPERVISOR';
  }

  private loadUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = sessionStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}