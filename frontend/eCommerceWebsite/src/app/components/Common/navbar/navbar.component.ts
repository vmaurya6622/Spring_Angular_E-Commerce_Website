import { LoginComponent } from './../../login/login.component';
import { Customer } from './../../../services/customer.service';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    @Input() darkMode: boolean = false;
    @Input() searchText = '';
    @Input() isLoggedIn = false;
    @Input() customerName = '';

    @Output() searchChange = new EventEmitter<string>();
    @Output() themeToggle = new EventEmitter<void>();
    @Output() logoutEvent = new EventEmitter<void>();
    showDropdown = false;
    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

    onSearch(value: string) {
        this.searchChange.emit(value);
    }
    goToCart() {
        this.router.navigate(['/cart']);
    }
    goToHome() {
        this.router.navigate(['/']);
    }
    navigateToAddress() {
        this.router.navigate(['/address']);
    }
    navigateToProfile() {
        this.router.navigate(['/profile']);
    }
    navigateToOrders() {
        this.router.navigate(['/orders']);
    }
    login() {
        this.router.navigate(['/login']);
    }
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('customer');
        }
        this.logoutEvent.emit();
        this.router.navigate(['/login']);
    }
    toggleThemeClick() {
        this.themeToggle.emit();
    }

}