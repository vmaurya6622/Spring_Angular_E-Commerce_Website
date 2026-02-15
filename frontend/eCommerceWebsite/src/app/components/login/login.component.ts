import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  selectedRole: string = 'customer';
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  selectRole(role: string) {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username/email and password.';
      return;
    }

    if (this.selectedRole === 'admin') {
      // Admin login (hardcoded for now)
      if (this.username === 'admin' && this.password === 'admin123') {
        this.router.navigate(['/']);
        return;
      } else {
        this.errorMessage = 'Invalid admin credentials.';
        return;
      }
    }

    // Customer login via API
    const credentials = {
      usernameOrEmail: this.username,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/customers/login', credentials)
      .subscribe({
        next: (response: any) => {
          // Store customer info in localStorage (only in browser)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('customer', JSON.stringify(response.customer));
          }
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Invalid username/email or password.';
        }
      });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
