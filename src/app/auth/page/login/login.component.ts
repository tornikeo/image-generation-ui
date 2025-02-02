import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  loginForm!: FormGroup;
  loading = false;
  loadingGAuth = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.signOut();
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this
      .authService
      .signIn(
        this.f['email'].value,
        this.f['password'].value
      )
      .then(() => {
        this.loading = false;
        this.router.navigate(['home']);
        // this.authService.getLoggedInUser().currentUser?.getIdToken()
        //   .then(
        //     (id_token) => {
        //       document.location.href = `${environment.apiAuthUrl}?id_token=${id_token}`
        //     }
        //   ).catch(
        //   (err) => {
        //     console.log(err)
        //     this.toastr.error("Error while redirecting to FollowFox.ai", 'ERROR')
        //   }
        // )
      }, err => {
        this.loading = false;
        this.toastr.error(this.authService.getSignInErrorMessage(err), 'ERROR');
        this.loginForm.reset();
        this.loginForm.controls['email'].setErrors(null);
        this.loginForm.controls['password'].setErrors(null);
      });
  }

  googleAuth() {
    this.loadingGAuth = true;
    this.authService.doGoogleLogin()
      .then(() => {
        this.loadingGAuth = false;
        this.router.navigate(['home']);
        // this.authService.getLoggedInUser().currentUser?.getIdToken()
        //   .then(
        //     (id_token) => {
        //       document.location.href = `${environment.apiAuthUrl}?id_token=${id_token}`
        //     }
        //   ).catch(
        //   (err) => {
        //     console.log(err)
        //     this.toastr.error("Error while redirecting to FollowFox.ai", 'ERROR')
        //   }
        // )
      }, err => {
        this.loadingGAuth = false;
        this.toastr.error(this.authService.getGAuthErrorMessage(err), 'ERROR');
        this.loginForm.reset();
        this.loginForm.controls['email'].setErrors(null);
        this.loginForm.controls['password'].setErrors(null);
      });
  }
}
