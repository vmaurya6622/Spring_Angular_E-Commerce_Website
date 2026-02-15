import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressComponent } from './components/address/address.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'address', component: AddressComponent },
    { path: 'orders', component: OrdersComponent },
    { path: '**', redirectTo: '' }
];
