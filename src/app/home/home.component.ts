import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { BaseConverterService } from '../base-converter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  form: FormGroup;
  num1 = '15';
  num2 = '';
  base1 = 10;
  base2 = 2;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        // this.num1 = params.get('num');
      })
    );
    this.form = this.fb.group({
      'number1': [null, [Validators.required]],
      'base1': [null, [Validators.required, Validators.min(2), Validators.max(36)]],
      'number2': [{ value: '', disabled: true }],
      'base2': [null, [Validators.required, Validators.min(2), Validators.max(36)]]
    });
    this.subscriptions.add(
      this.form.get('number1').valueChanges.subscribe(
        (number1) => {
          if (this.form.controls['number1'].valid) {
            this.num1 = number1.toUpperCase();
            this.num2 = BaseConverterService.convert(number1, this.base1, this.base2);
          }
        }
      )
    );
    this.subscriptions.add(
      this.form.get('base1').valueChanges.subscribe(
        (base1) => {
          if (this.form.controls['base1'].valid) {
            this.num2 = BaseConverterService.convert(this.num1, base1, this.base2);
          }
        }
      )
    );
    this.subscriptions.add(
      this.form.get('base2').valueChanges.subscribe(
        (base2) => {
          if (this.form.controls['base2'].valid) {
            this.num2 = BaseConverterService.convert(this.num1, this.base1, base2);
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
