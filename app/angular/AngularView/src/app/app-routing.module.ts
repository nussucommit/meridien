import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component'
import { BookingDetailsComponent } from './booking-details/booking-details.component'
import { NotFoundComponent } from './not-found/not-found.component'

const routes: Routes = [
    { path: 'items', component: ItemListComponent },
    { path: 'bookings', component: BookingDetailsComponent },
    { path: '', redirectTo: 'bookings', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
