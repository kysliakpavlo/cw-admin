import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'cwb-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
    @Input() name!: string;
}
