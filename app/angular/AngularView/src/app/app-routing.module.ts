import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component'
import { BookingListComponent } from './booking-list/booking-list.component'
import { NotFoundComponent } from './not-found/not-found.component'

const routes: Routes = [
    { path: 'items', component: ItemListComponent },
    { path: 'bookings', component: BookingListComponent },
    { path: '', redirectTo: 'bookings', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
