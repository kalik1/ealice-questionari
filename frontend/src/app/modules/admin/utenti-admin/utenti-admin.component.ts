import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/core/api/services/user.service';
import { CoopService } from 'app/core/api/services/coop.service';
import { ReadCoopDto } from 'app/core/api/models/read-coop-dto';
import { CreateUserDto } from 'app/core/api/models/create-user-dto';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-utenti-admin',
  templateUrl: './utenti-admin.component.html',
  styleUrls: ['./utenti-admin.component.scss']
})
export class UtentiAdminComponent implements OnInit {
  form: FormGroup;
  coops: ReadCoopDto[] = [];
  submitted = false;
  createdUserEmail?: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private coopService: CoopService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      yearOfBirth: [1980, [Validators.required, Validators.min(1900), Validators.max(2050)]],
      gender: ['m', [Validators.required]],
      role: ['user', [Validators.required]],
      coop: [null, []],
    });

    this.coopService
      .coopControllerFindAll()
      .pipe(tap((c) => (this.coops = c)))
      .subscribe();
  }

  compareCoop = (a?: ReadCoopDto | null, b?: ReadCoopDto | null): boolean => {
    return (a && b) ? a.id === b.id : a === b;
  };

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.value;
    const payload: CreateUserDto = {
      name: value.name,
      email: value.email,
      password: value.password,
      yearOfBirth: value.yearOfBirth,
      gender: value.gender,
      role: value.role,
      coop: value.coop?.id ?? undefined,
    } as any;

    this.userService
      .userControllerCreate({ body: payload })
      .pipe(
        tap((user) => {
          this.createdUserEmail = user.email;
          this.form.reset({ gender: 'm', role: 'user', yearOfBirth: 1980 });
          this.submitted = false;
        })
      )
      .subscribe();
  }
}
