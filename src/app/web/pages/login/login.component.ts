import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void{
    this.login();
  }

  login() {
    // Eliminar espacios y convertir a minúsculas
    const trimmedEmail = this.email.trim().toLowerCase();
    const trimmedPassword = this.password.trim();

    console.log("Datos ingresados:", trimmedEmail, trimmedPassword);

    if (trimmedEmail === 'admin@example.com' && trimmedPassword === '123456') {
      console.log("Inicio de sesión exitoso");
      this.router.navigate(['/dashboard']);
    } else {
      console.log("Credenciales incorrectas");
      alert('Credenciales incorrectas');
    }
  }



}
