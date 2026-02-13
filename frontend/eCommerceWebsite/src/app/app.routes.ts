import { Routes } from '@angular/router';
import { log } from 'console';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'products', component: ProductListComponent },
    // { path: 'products/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent }
];
