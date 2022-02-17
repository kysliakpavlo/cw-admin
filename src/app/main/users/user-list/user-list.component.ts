import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../../core/types';

@Component({
    selector: 'cwb-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
    @Input() data: IUser[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }


}