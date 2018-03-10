import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: []
})
export class MaterialModule { }
