import { BehaviorSubject,of, catchError, firstValueFrom, tap } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule,CommonFooterComponent],
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent {
	signupForm: FormGroup;
	errorMessage$ = new BehaviorSubject<string>('');
	loading$ = new BehaviorSubject<boolean>(false);
	successMessage$ = new BehaviorSubject<string>('');

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private router: Router
	) {
		this.signupForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]], // can fill only letters and spaces
			age: ['', [Validators.required, Validators.min(1), Validators.max(120), Validators.pattern(/^\d+$/)]],
			sex: ['', Validators.required],
			dob: ['', Validators.required],
			mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // can fill only 10 digit number with 0-9 digits
			address: ['', Validators.required],
			username: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			email: ['', [Validators.required, Validators.email]]
		});
	}

	onSubmit(): void {
		if (this.signupForm.invalid) {
			this.errorMessage$.next('Please fill all fields correctly.');
			return;
		}
		this.loading$.next(true);
		this.errorMessage$.next('');
		this.http.post('http://localhost:8080/api/customers/signup', this.signupForm.value).pipe(
			tap(() => {
				this.successMessage$.next('Signup successful! Redirecting to login...');
				this.signupForm.reset();
				setTimeout(() => {
					this.router.navigate(['/login']);
				}, 1000);

			}), catchError((error) => {
				this.errorMessage$.next(error.error?.message || 'Signup failed. Please try again.');
				return of(null);
			}), tap(() => this.loading$.next(false))).subscribe();
	}

	get f() {
		return this.signupForm.controls;
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}
}
