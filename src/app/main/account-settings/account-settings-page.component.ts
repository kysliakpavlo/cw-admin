import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'cwb-account-settings-page',
    templateUrl: './account-settings-page.component.html',
    styleUrls: ['./account-settings-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettingsPageComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
