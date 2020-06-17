// the following piece of code is obtained directly online haha, but in the future
// if any members want to call a function from child class to parent class
// (see item-list.component.ts then you know what I mean) then they are free to use.

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ComParentChildService {

    private subjects: Subject<any>[] = [];

    publish(eventName: string) {
        // ensure a subject for the event name exists
        this.subjects[eventName] = this.subjects[eventName] || new Subject();

        // publish event
        this.subjects[eventName].next();
    }

    on(eventName: string): Observable<any> {
        // ensure a subject for the event name exists
        this.subjects[eventName] = this.subjects[eventName] || new Subject();

        // return observable
        return this.subjects[eventName].asObservable();
    }

}
