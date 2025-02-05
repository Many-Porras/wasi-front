// pages/pages-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from '../components/content/content.component';
import { PagesComponent } from './pages.component';
import LoginComponent from './login/login.component';
import { ComponentsModule } from '../components/components.module';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadComponent: () => import('./landing/landing.component') },
  { path: 'login',    loadComponent: () => import('./login/login.component') },
  //{ path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component')},
  { path: 'dashboard', component: DashboardComponent},
  { path: '**', redirectTo: 'landing' },
];


