import { AuthGuard } from './model-service/users/auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TemplateListComponent } from './template-list/template-list.component';

const routes: Routes = [
    { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
    { path: 'bookings', component: BookingListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'bookings', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'login', component: LoginFormComponent },
    { path: 'templates', component: TemplateListComponent },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
