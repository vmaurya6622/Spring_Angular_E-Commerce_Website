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

  login() {
    console.log("Login as:", this.selectedRole);
    console.log("Username:", this.username);
    console.log("Password:", this.password);

    if (this.selectedRole === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/shop']);
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
