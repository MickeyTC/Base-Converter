import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

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
  num2 = '1111';
  base1 = 10;
  base2 = 2;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    const numberPattern = '^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$';
    const basePattern = '^[0-9]{1,2}$';
    this.form = this.fb.group({
      'number1': [this.num1, [Validators.required, Validators.pattern(numberPattern), this.baseCompatibleValidator('base1')]],
      'base1': [this.base1, [Validators.required, Validators.pattern(basePattern), Validators.min(2), Validators.max(36)]],
      'number2': [{ value: this.num2, disabled: true }],
      'base2': [this.base2, [Validators.required, Validators.pattern(basePattern), Validators.min(2), Validators.max(36)]]
    });
    this.subscriptions.add(
      this.form.get('number1').valueChanges.subscribe(
        (number1) => {
          this.form.get('number1').markAsTouched();
          if (number1) { this.num1 = number1.toUpperCase(); }
          if (this.form.get('base1').valid && this.form.get('base2').valid && this.form.get('number1').valid) {
            this.num2 = this.convert(number1, this.base1, this.base2);
          } else {
            this.num2 = 'Invalid';
          }
        }
      )
    );
    this.subscriptions.add(
      this.form.get('base1').valueChanges.subscribe(
        (base1) => {
          this.form.get('base1').markAsTouched();
          this.form.get('number1').updateValueAndValidity();
          if (this.form.get('base1').valid && this.form.get('base2').valid && this.form.get('number1').valid) {
            this.num2 = this.convert(this.num1, base1, this.base2);
          } else {
            this.num2 = 'Invalid';
          }
        }
      )
    );
    this.subscriptions.add(
      this.form.get('base2').valueChanges.subscribe(
        (base2) => {
          this.form.get('base2').markAsTouched();
          if (this.form.get('base1').valid && this.form.get('base2').valid && this.form.get('number1').valid) {
            this.num2 = this.convert(this.num1, this.base1, base2);
          } else {
            this.num2 = 'Invalid';
          }
        }
      )
    );
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        if (params.has('number')) {
          this.form.get('number1').setValue(params.get('number').toUpperCase());
        }
        if (params.has('from')) {
          this.form.get('base1').setValue(params.get('from'));
        }
        if (params.has('to')) {
          this.form.get('base2').setValue(params.get('to'));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getBaseError(fc: FormControl): string {
    // console.log('Base', fc.errors);
    return fc.errors.required ? 'Required' :
      fc.errors.min || fc.errors.max ? '2 <= Base <= 36' :
        fc.errors.pattern ? 'Base must be Integer' : '';
  }

  getNumberError(fc: FormControl): string {
    // console.log('Number', fc.errors);
    return fc.errors.required ? 'Required' :
      fc.errors.pattern ? 'Must be Number' :
        fc.errors.baseCompatible ? 'Not Compatible Base' : '';
  }

  baseCompatibleValidator(baseFormControlName: string): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }
      const baseControl: FormControl = control.parent.controls[baseFormControlName];
      if (!baseControl) {
        throw new Error('baseCompatibleValidator(): Base FromControl is not found in parent FormGroup');
      }
      const number = control.value;
      const base = baseControl.value;
      // console.log(number, base);
      return BaseConverterService.isCompatible(number, base) ? null : { 'baseCompatible': { 'base': base } };
    };
  }

  convert(num: string, fromBase: number, toBase: number): string {
    return num && fromBase && toBase ? BaseConverterService.convert(num, fromBase, toBase) : null;
  }
}
