import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChangePasswordRoutingModule} from './change-password-routing.module';
import {ChangePasswordPageComponent} from './change-password-page.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        ChangePasswordPageComponent
    ],
    imports: [
        CommonModule,
        ChangePasswordRoutingModule,
        ReactiveFormsModule
    ]
})
export class ChangePasswordModule {
}
