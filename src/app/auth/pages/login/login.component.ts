import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error   = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        const perms = res.user.permissions;

        if (perms.includes('*') || perms.includes('dashboard.activities')) {
          this.router.navigate(['/dashboard']);
        } else if (perms.includes('reports.efectividad')) {
          this.router.navigate(['/reports/efectividad']);
        } else if (perms.includes('reports.manual')) {
          this.router.navigate(['/reports/manual']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.error   = err.error?.message ?? 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}