import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ViewService} from '../view.service';
import {from, Observable, Subject, switchMap, takeUntil, withLatestFrom} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {IBooking, IUpdateBooking} from '../../../../core/types';
import {UpdateService} from './update.service';
import {Router} from '@angular/router';

@Component({
    selector: 'cwb-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        UpdateService
    ]
})
export class UpdateComponent implements OnInit, OnDestroy {
    private destroy$$: Subject<void> = new Subject<void>();
    private data$$: Subject<IBooking> = new Subject<IBooking>();
    public data$: Observable<IBooking> = this.data$$.asObservable();
    public saveChanges$$: Subject<IUpdateBooking> = new Subject<IUpdateBooking>();
    public form = new FormGroup({
        title: new FormControl('', Validators.required),
        audioDetails: new FormControl('', Validators.required),
        captionDispDetails: new FormControl('', Validators.required),
        timeZoneOverride: new FormControl(''),
        requirePasscode: new FormControl(false),
        requireLogin: new FormControl(false),
        viewerEmails: new FormControl(''),
        bookingPasscode: new FormControl(''),
        authorizedViewersOnly: new FormControl(false)
    });

    public authorizedViewersOnlyChecked: boolean =  false;
    public requirePasscodeChecked: boolean = false;

    constructor(
        private viewService: ViewService,
        private updateService: UpdateService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.saveChanges$$.asObservable().pipe(
            takeUntil(this.destroy$$.asObservable()),
            withLatestFrom(this.data$,),
            switchMap(([newData, {
                bookingToken,
                viewerEmails,
                audioDetails,
                title,
                bookingTimeZone,
                captionDispDetails,
                bookingPasscode
            }]) => {
                let data: IUpdateBooking = {};
                if (title !== newData.title) {
                    data.title = newData.title;
                }
                if (audioDetails !== newData.audioDetails) {
                    data.audioDetails = newData.audioDetails;
                }
                if (captionDispDetails !== newData.captionDispDetails) {
                    data.captionDispDetails = newData.captionDispDetails;
                }
                if (viewerEmails !== newData.viewerEmails) {
                    data.viewerEmails = newData.viewerEmails;
                }
                if (viewerEmails !== newData.viewerEmails) {
                    data.viewerEmails = newData.viewerEmails;
                }
                if (bookingTimeZone !== newData.timeZoneOverride) {
                    data.timeZoneOverride = newData.timeZoneOverride;
                }
                if (bookingPasscode !== newData.bookingPasscode)  {
                    data.bookingPasscode = newData.bookingPasscode;
                }
                return this.updateService.updateBooking$(bookingToken, data).pipe(
                    tap(() => this.viewService.reload()),
                    switchMap(() => {
                        return from(this.router.navigate(['bookings', bookingToken]))
                    })
                );
            }),
        ).subscribe();

        this.viewService.currentBookingData$.pipe(
            takeUntil(this.destroy$$.asObservable()),
            tap(this.data$$.next.bind(this.data$$)),
            tap(data => {
                const {title, audioDetails, captionDispDetails, viewerEmails, bookingTimeZone, requirePasscode, requireLogin, bookingPasscode} = data;
                this.form.setValue({
                    title,
                    audioDetails,
                    captionDispDetails,
                    timeZoneOverride: bookingTimeZone,
                    requirePasscode,
                    requireLogin,
                    bookingPasscode,
                    authorizedViewersOnly:requirePasscode,
                    viewerEmails
                });

            })
        ).subscribe();

    }

    ngOnDestroy(): void {
        this.destroy$$.next();
    }

    update(): void {
        if (this.form.valid) {
            this.saveChanges$$.next(this.form.value as IUpdateBooking);
        }

    }

    switchAuthorizedViewerBool() {
        this.authorizedViewersOnlyChecked = (this.authorizedViewersOnlyChecked) ? false : true;
    }

    switchRequirePasscodeBool() {
        this.requirePasscodeChecked = (this.requirePasscodeChecked) ? false : true;
    }

}
