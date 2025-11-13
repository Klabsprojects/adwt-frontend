// import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Subscription, Observable } from 'rxjs';
// import { first } from 'rxjs/operators';
// import { AuthService } from '../../services/auth.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LandingService } from 'src/app/modules/landing/landing.service';
// import { environment as env } from 'src/environments/environment.prod';
// import * as CryptoJS from 'crypto-js';
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent implements OnInit, OnDestroy {
//   @Output() loginSuccess = new EventEmitter<void>();
//   defaultAuth: any = null; // Remove or set it to null

//   loginForm: FormGroup;
//   hasError: boolean = false;
//   returnUrl: string;
//   isLoading$: Observable<boolean>;
//   showPassword: boolean = false; // Toggle visibility for password
//   private unsubscribe: Subscription[] = [];
//   captchaQuestion: string = '';
//   captchaAnswer: string = '';
//   correctAnswer: number = 0;
//   captchaError: boolean = false;
//   @Output() captchaStatus = new EventEmitter<boolean>();

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router,
//     public lang : LandingService
//   ) {
//      this.generateCaptcha();
//     this.isLoading$ = this.authService.isLoading$;
//     if (this.authService.currentUserValue) {
//       this.router.navigate(['/']);
//     }
//   }

//   ngOnInit(): void {
//     this.initForm();
//     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
//   }

//   // Custom email validator to ensure the email contains a valid domain with TLD
//   CustomEmailValidator(control: AbstractControl): ValidationErrors | null {
//     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     const emailValue = control.value;
//     if (emailValue && !emailPattern.test(emailValue)) {
//       return { invalidEmail: true };
//     }
//     return null;
//   }

//   // Get the form controls for easier access in the template
//   get f() {
//     return this.loginForm.controls;
//   }

//   // Initialize the login form with validators
//   initForm() {
//     const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
//     const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
//     const rememberMe = !!rememberedEmail; // Determine if "Remember Me" was previously checked

//     this.loginForm = this.fb.group({
//       email: [
//         rememberedEmail, // Prefill email if remembered
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(3),
//           Validators.maxLength(320),
//           this.CustomEmailValidator, // Custom email validator
//         ]),
//       ],
//       password: [
//         rememberedPassword, // Prefill password if remembered
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(3), // Minimum password length
//           Validators.maxLength(100), // Maximum password length
//         ]),
//       ],
//       rememberMe: [rememberMe], // Set checkbox state
//       // recaptcha: ['', Validators.required]
//     });
//   }


//   // Form submission logic
//   submit() {
//     this.hasError = false;

//     //console.log('Login form submitted'); // Log when form submission starts

//     // If the form is invalid, prevent submission
//     if (this.loginForm.invalid) {
//       //console.error('Login form is invalid'); // Log invalid form
//       return;
//     }
//     const secretKey  = env.secretKey;
//     const ciphertext = CryptoJS.AES.encrypt(this.f.password.value, secretKey).toString();

//     //console.log('Sending login request with email:', this.f.email.value);
//     const loginSubscr = this.authService.login(this.f.email.value, ciphertext).pipe(first()).subscribe(
//         (response: any) => {
//           //console.log('Login response received:', response); // Log the API response

//           // Check if the response contains user data
//           if (response && response.id && response.roles) {
//             const userId = response.id;
//             const userRole = response.roles;

//             //console.log('User logged in successfully:', { userId, userRole }); // Log user details

//             // Store user data in session storage
//             sessionStorage.setItem('userId', userId.toString());
//             sessionStorage.setItem('userRole', userRole.toString());

//             // Redirect based on role
//             if (userRole === '4') {
//               //console.log('Redirecting to Dadtwo dashboard');
//               // this.router.navigate(['/dadtwo-dashboard']);
//               this.router.navigate(['/dashboard']); 
//               this.loginSuccess.emit();
//               // this.router.navigate(['/dashboard']);
//             } else {
//               //console.log('Redirecting to main dashboard');
//               // this.router.navigate(['/dashboard']);
//               setTimeout(() => {
//                 this.loginSuccess.emit();  // Notify parent component
//                 this.router.navigate(['/dashboard']);  // Redirect after login
//               }, 1000);
//             }
//           } else {
//             // If the response does not contain the expected user data, show error
//             //console.error('Login failed: Invalid response structure or missing user data');
//             this.hasError = true;
//           }
//         },
//         (error) => {
//           // Handle errors from the HTTP request
//           //console.error('Login failed due to error:', error);
//           this.hasError = true;
//         }
//       );

//     this.unsubscribe.push(loginSubscr);
//   }





//   // Toggle password visibility
//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   ngOnDestroy() {
//     this.unsubscribe.forEach((sb) => sb.unsubscribe());
//   }


//   //captcha code

//   siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

//   handleReset(): void {
//     console.log('reCAPTCHA reset');
//   }
  
//   handleExpire(): void {
//     console.log('reCAPTCHA expired');
//   }
  
//   handleLoad(): void {
//     console.log('reCAPTCHA loaded');
//   }
  
//   handleSuccess(token: string): void {
//     // console.log('reCAPTCHA success, token:', token);
//     this.loginForm.get('recaptcha')?.setValue(token); // set the token in form control
//   }
//     generateCaptcha(): void {
//     const a = Math.floor(Math.random() * 10) + 1;
//     const b = Math.floor(Math.random() * 10) + 1;
//     this.correctAnswer = a + b;
//     this.captchaQuestion = `${a} + ${b} = ?`;
//     this.captchaAnswer = '';
//     this.captchaError = false;
//     this.captchaStatus.emit(false);
//   }

//   validateCaptcha(): void {
//     const isValid = Number(this.captchaAnswer) === this.correctAnswer;
//     this.captchaError = !isValid;
//     this.captchaStatus.emit(isValid);
//   }
// }




import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandingService } from 'src/app/modules/landing/landing.service';
import { environment as env } from 'src/environments/environment.prod';
import * as CryptoJS from 'crypto-js';
import { Md5 } from 'ts-md5';
import * as ExcelJS from 'exceljs';


interface UserRecord {
  id: number;
  district_name: string;
  email_id: string;
  password: string;
}

interface LoginResponse {
  // Update this interface to match your actual UserModel structure
  id?: number;
  name?: string;
  email?: string;
  // Add other properties from your UserModel as needed
}

interface ProcessResult {
  email: string;
  status: 'success' | 'password_updated' | 'failed';
  message: string;
}



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() loginSuccess = new EventEmitter<void>();
  defaultAuth: any = null;

  loginForm: FormGroup;
  hasError: boolean = false;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showPassword: boolean = false;
  private unsubscribe: Subscription[] = [];
  
  // CAPTCHA properties
  captchaQuestion: string = '';
  captchaAnswer: string = '';
  correctAnswer: number = 0;
  captchaError: boolean = false;
  isCaptchaValid: boolean = false;
  
  @Output() captchaStatus = new EventEmitter<boolean>();



selectedFile: File | null = null;
isProcessing = false;
processResults: ProcessResult[] = [];
currentProcessingIndex = 0;
totalRecords = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public lang: LandingService
  ) {
    this.generateCaptcha();
    this.isLoading$ = this.authService.isLoading$;
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Custom email validator
  CustomEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailValue = control.value;
    if (emailValue && !emailPattern.test(emailValue)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Custom CAPTCHA validator
  captchaValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: true };
    }
    if (Number(control.value) !== this.correctAnswer) {
      return { invalidCaptcha: true };
    }
    return null;
  };

  // Get form controls
  get f() {
    return this.loginForm.controls;
  }

  // Initialize form with CAPTCHA validation
  initForm() {
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    const rememberMe = !!rememberedEmail;

    this.loginForm = this.fb.group({
      email: [
        rememberedEmail,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
          this.CustomEmailValidator,
        ]),
      ],
      password: [
        rememberedPassword,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      rememberMe: [rememberMe],
      captcha: ['', [Validators.required, this.captchaValidator]] // Add CAPTCHA form control
    });
  }

  // Generate new CAPTCHA
  generateCaptcha(): void {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    this.correctAnswer = a + b;
    this.captchaQuestion = `${a} + ${b} = ?`;
    this.captchaAnswer = '';
    this.captchaError = false;
    this.isCaptchaValid = false;
    this.captchaStatus.emit(false);
    
    // Reset CAPTCHA form control when generating new CAPTCHA
    if (this.loginForm && this.loginForm.get('captcha')) {
      this.loginForm.get('captcha')?.setValue('');
      this.loginForm.get('captcha')?.markAsUntouched();
    }
  }

  // Validate CAPTCHA input
  validateCaptcha(): void {
    const userAnswer = Number(this.captchaAnswer);
    this.isCaptchaValid = userAnswer === this.correctAnswer && !isNaN(userAnswer);
    this.captchaError = !this.isCaptchaValid && this.captchaAnswer !== '';
    
    // Update form control value
    if (this.loginForm && this.loginForm.get('captcha')) {
      this.loginForm.get('captcha')?.setValue(this.captchaAnswer);
      this.loginForm.get('captcha')?.markAsTouched();
    }
    
    this.captchaStatus.emit(this.isCaptchaValid);
  }

  // Check if form is valid including CAPTCHA
  isFormValid(): boolean {
    return this.loginForm.valid && this.isCaptchaValid;
  }

  loginErrorMessage:any;

  // Form submission with CAPTCHA validation
  submit() {
    this.hasError = false;

    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    // Validate CAPTCHA one more time
    this.validateCaptcha();

    // Check if form is valid including CAPTCHA
    if (!this.isFormValid()) {
      console.error('Login form is invalid or CAPTCHA is incorrect');
      if (!this.isCaptchaValid) {
        this.captchaError = true;
      }
      return;
    }

    // const secretKey = env.secretKey;
    // const ciphertext = CryptoJS.AES.encrypt(this.f.password.value, secretKey).toString();
      const encryptedPassword = Md5.hashStr(this.f.password.value);
    

    const loginSubscr = this.authService.login(this.f.email.value, encryptedPassword)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response && response.id && response.roles) {
            const userId = response.id;
            const userRole = response.roles;

            // Store user data
            sessionStorage.setItem('userId', userId.toString());
            sessionStorage.setItem('userRole', userRole.toString());

            // Handle remember me functionality
            if (this.f.rememberMe.value) {
              localStorage.setItem('rememberedEmail', this.f.email.value);
              localStorage.setItem('rememberedPassword', this.f.password.value);
            } else {
              localStorage.removeItem('rememberedEmail');
              localStorage.removeItem('rememberedPassword');
            }

            // Redirect based on role
            if (userRole === '4') {
              this.router.navigate(['/widgets-examples/VmcmeetingComponent']);
              this.loginSuccess.emit();
            } else {
              setTimeout(() => {
                this.loginSuccess.emit();
                this.router.navigate(['/widgets-examples/fir-list']);
              }, 1000);
            }
          } else {
            console.error('Login failed: Invalid response structure');
            this.hasError = true;
            console.log('credential invalid')
            // Generate new CAPTCHA on login failure
            this.generateCaptcha();
          }
        },
        (error) => {
          this.loginErrorMessage = error.error.message || 'Login failed. Application Unable to Reach.';
          console.log('Login failed due to error:', error);
          console.log('server down')
          this.hasError = true;
          // Generate new CAPTCHA on login failure
          this.generateCaptcha();
        }
      );

    this.unsubscribe.push(loginSubscr);
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // reCAPTCHA methods (if you want to use Google reCAPTCHA as well)
  siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  handleReset(): void {
    console.log('reCAPTCHA reset');
  }

  handleExpire(): void {
    console.log('reCAPTCHA expired');
  }

  handleLoad(): void {
    console.log('reCAPTCHA loaded');
  }

  handleSuccess(token: string): void {
    console.log('reCAPTCHA success, token:', token);
    this.loginForm.get('recaptcha')?.setValue(token);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

    allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent the character from being entered
    }
  }






// password updation functions

onFileSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.processExcelFile(file);
  }
}

// Function to process Excel file using ExcelJS
async processExcelFile(file: File): Promise<void> {
  try {
    this.isProcessing = true;
    this.processResults = [];
    this.currentProcessingIndex = 0;

    // Read Excel file using ExcelJS
    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    
    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }

    // Convert rows to UserRecord format
    const userRecords: UserRecord[] = [];
    
    // Skip header row (start from row 2)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const id = row.getCell(1).value as number;
        const district_name = row.getCell(2).value as string;
        const email_id = row.getCell(3).value as string;
        const password = row.getCell(4).value as string;
        
        if (email_id && password) {
          userRecords.push({
            id: id || rowNumber - 1,
            district_name: district_name || '',
            email_id: String(email_id).trim(),
            password: String(password).trim()
          });
        }
      }
    });

    this.totalRecords = userRecords.length;
    console.log(`Processing ${this.totalRecords} user records...`);

    // Process each user record
    for (const user of userRecords) {
      await this.processUserRecord(user);
      this.currentProcessingIndex++;
    }

    console.log('Processing completed!', this.processResults);
    this.isProcessing = false;

  } catch (error) {
    console.error('Error processing Excel file:', error);
    this.isProcessing = false;
  }
}

// Function to process individual user record
async processUserRecord(user: UserRecord): Promise<void> {
  try {
    console.log(`Processing user: ${user.email_id}`);
    
    // Encrypt password with MD5
    const encryptedPassword = Md5.hashStr(user.password);
    
    // Try login with encrypted password
    const loginResponse = await this.authService.login(user.email_id, encryptedPassword).toPromise();
    
    // If we get here without error, login was successful
    if (loginResponse && loginResponse.id) {
      // Login successful - user object returned
      this.processResults.push({
        email: user.email_id,
        status: 'success',
        message: 'Login successful - password already correct'
      });
      console.log(`✓ ${user.email_id} - Login successful`);
    } else {
      // Unexpected response format
      throw new Error('Invalid login response');
    }
    
  } catch (loginError: any) {
    // Login failed - need to update password
    console.log(`✗ ${user.email_id} - Login failed, updating password...`);
    
    try {
      // Call password reset API
      const resetResponse = await this.authService.resetPassword(
        user.email_id, 
        Md5.hashStr(user.password)
      ).toPromise();
      
      // Wait a bit before next operation
      await this.delay(1000);
      
      this.processResults.push({
        email: user.email_id,
        status: 'password_updated',
        message: 'Password updated successfully'
      });
      console.log(`✓ ${user.email_id} - Password updated successfully`);
      
    } catch (resetError: any) {
      this.processResults.push({
        email: user.email_id,
        status: 'failed',
        message: `Failed to update password: ${resetError.message || 'Unknown error'}`
      });
      console.error(`✗ ${user.email_id} - Failed to update password:`, resetError);
    }
  }
}

// Helper function to read file as ArrayBuffer
private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to add delay
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get processing progress
getProcessingProgress(): number {
  return this.totalRecords > 0 ? (this.currentProcessingIndex / this.totalRecords) * 100 : 0;
}

// Function to get summary of results
getProcessingSummary() {
  const successful = this.processResults.filter(r => r.status === 'success').length;
  const updated = this.processResults.filter(r => r.status === 'password_updated').length;
  const failed = this.processResults.filter(r => r.status === 'failed').length;
  
  return {
    total: this.processResults.length,
    successful,
    updated,
    failed
  };
}
 private generateCodeVerifier(): string {
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
ssoRoute() {
  const codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('pkce_code_verifier', codeVerifier);

  const keycloakUrl = 'http://74.208.113.233:8081/realms/klabs';
  const clientId = 'adwt-client';
  // const redirectUri = 'http://localhost:4200/callback';
  const redirectUri = 'https://adwatrocity.onlinetn.com/callback';
  const codeChallenge = codeVerifier; 
  const codeChallengeMethod = 'plain'; 

  const authUrl =
    `${keycloakUrl}/protocol/openid-connect/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=openid` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=${codeChallengeMethod}`;

  window.location.href = authUrl;
  console.log(authUrl);
}
}