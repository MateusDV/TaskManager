import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {Credentials} from '../../models/auth/credentials';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatButton
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  credentials: Credentials = {
    email: '',
    password: ''
  }

  isRegisterForm = signal<boolean>(false);

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  toggleFormAction() {
    this.isRegisterForm.update((value) => !value);
  }

  loginForm = this.formBuilder.group({
    email: [this.credentials.email, [Validators.required, Validators.email]],
    password: [this.credentials.password, [Validators.required, Validators.minLength(4)]],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value as Credentials;
    const success = await this.authService.login(credentials);
    if (!success) {
      alert(this.authService.error());
      return;
    }

    this.router.navigate(['/tasks']);
  }

  async onRegisterSubmit(form: FormGroupDirective) {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value as Credentials;
    const success = await this.authService.register(credentials);
    if (!success) {
      alert(this.authService.error());
      return;
    }

    alert("User registered successfully. Please login with your credentials.");
    form.resetForm();
    this.toggleFormAction();
  }
}
