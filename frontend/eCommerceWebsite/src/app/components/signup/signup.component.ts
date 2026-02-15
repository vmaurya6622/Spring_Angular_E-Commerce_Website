import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent {
	signupForm: FormGroup;
	errorMessage: string = '';
	successMessage: string = '';

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private router: Router
	) {
		this.signupForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
			sex: ['', Validators.required],
			dob: ['', Validators.required],
			mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
			address: ['', Validators.required],
			username: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			email: ['', [Validators.required, Validators.email]]
		});
	}

	onSubmit(): void {
		if (this.signupForm.valid) {
			this.errorMessage = '';
			this.successMessage = '';

			this.http.post('http://localhost:8080/api/customers/signup', this.signupForm.value)
				.subscribe({
					next: (response: any) => {
						this.successMessage = 'Signup successful! Redirecting to login...';
						this.signupForm.reset();
						setTimeout(() => {
							this.router.navigate(['/login']);
						}, 2000);
					},
					error: (error) => {
						this.errorMessage = error.error.message || 'Signup failed. Please try again.';
					}
				});
		} else {
			this.errorMessage = 'Please fill all required fields correctly.';
		}
	}

	get f() {
		return this.signupForm.controls;
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}
}
