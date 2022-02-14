import {Injectable} from '@angular/core';
import {SocketMessagesService} from '../../../core/socket-messages.service';
import {Observable, pluck, withLatestFrom} from 'rxjs';
import {ModalService} from '../../../core/modal.service';
import {ViewService} from './view.service';
import {ICreateSession, ISession} from '../../../core/types';
import {SessionDialogComponent} from './sessions/session-dialog/session-dialog.component';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ConfirmationService} from '../../../shared/confirmation.service';

@Injectable()
export class SessionService {

    constructor(
        private modalService: ModalService,
        private messages: SocketMessagesService,
        private viewService: ViewService,
        private confirmationService: ConfirmationService,
    ) {
    }

    public add$(): Observable<unknown> {
        return this.modalService.open$(SessionDialogComponent).pipe(
            filter(Boolean),
            withLatestFrom(this.viewService.currentBookingData$),
            switchMap(([session, booking]) => {
                const data = Object.assign(session, {
                    bookingToken: booking.bookingToken
                }) as ICreateSession;
                return this.addSession$(data);
            }),
            tap(() => this.viewService.reload())
        )
    }

    public edit$(sessionData: ISession): Observable<unknown> {
        return this.modalService.open$<any, SessionDialogComponent>(SessionDialogComponent, {}, (instance) => {
            instance.data$$.next(sessionData);
        }).pipe(
            filter(Boolean),
            switchMap((session) => {
                Object.assign(session, {
                    sessionId: sessionData.sessionId
                });
                return this.updateSession$(session);
            }),
            tap(() => this.viewService.reload())
        )
    }

    public cancel$(id: number): Observable<unknown> {
        return this.confirmationService.open$('Are you sure you want to cancel the session?').pipe(
            switchMap(() => {
                return this.cancelSession$(id);
            }),
            tap(() => this.viewService.reload())
        );
    }

    private addSession$(session: ICreateSession): Observable<number> {
        return this.messages.request$<{ sessionId: number }>('addSession', session).pipe(
            pluck('sessionId')
        );
    }


    private updateSession$(session: ISession): Observable<unknown> {
        return this.messages.request$('updateSession', session).pipe(

        );
    }


    private cancelSession$(sessionId: number): Observable<unknown> {
        return this.messages.request$('cancelSession', {sessionId}).pipe(

        );
    }
}
