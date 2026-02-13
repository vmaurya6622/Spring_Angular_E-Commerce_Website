import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  selectedRole: string = 'customer';
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  selectRole(role: string) {
    this.selectedRole = role;
  }

  login(): void {
    if (!this.username || !this.password) {
      alert('Please enter username and password.');
      return;
    }

    if (this.username === 'admin' && this.password === 'admin123') {
      this.router.navigate(['/products']);
      return;
    }

    alert('Invalid username or password.');
  }

  goToSignup(): void {
    alert('Signup is not implemented yet.');
  }
}
