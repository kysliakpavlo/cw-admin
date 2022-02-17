import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SessionsService} from './sessions.service';
import {Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {IAdminSession} from '../../core/types';
import {FilterComponent} from './filter/filter.component';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'cwb-sessions',
    templateUrl: './sessions-page.component.html',
    styleUrls: ['./sessions-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SessionsService
    ]
})
export class SessionsPageComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$$: Subject<void> = new Subject<void>();
    private sessions$$: Subject<IAdminSession[]> = new Subject<IAdminSession[]>();
    public sessions$: Observable<IAdminSession[]> = this.sessions$$.asObservable();

    @ViewChild(FilterComponent)
    private filter!: FilterComponent;

    constructor(private sessionsService: SessionsService) {
    }

    ngOnInit(): void {


    }

    ngOnDestroy(): void {
        this.destroy$$.next();
    }

    ngAfterViewInit(): void {
        this.filter.get$().pipe(
            takeUntil(this.destroy$$.asObservable()),
            switchMap(({fromEpoch, toEpoch}) => this.sessionsService.getSessions$(fromEpoch, toEpoch)),
            tap((_) => this.sessions$$.next(_))
        ).subscribe();
    }


}