import { AuthGuard } from './model-service/users/auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
<<<<<<< HEAD
import { BookingDetailsComponent } from './booking-details/booking-details.component';
=======
import { TemplateListComponent } from './template-list/template-list.component';
>>>>>>> Enable adding and updating of email templates

const routes: Routes = [
    { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
    { path: 'bookings', component: BookingListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'bookings', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'login', component: LoginFormComponent },
<<<<<<< HEAD
    { path: 'edit', component: BookingDetailsComponent},
=======
    { path: 'templates', component: TemplateListComponent },
>>>>>>> Enable adding and updating of email templates
    { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
