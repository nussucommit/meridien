import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CreateItemComponent } from './create-item/create-item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { ItemListComponent } from './item-list/item-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BookingListComponent, BookingListDialog } from './booking-list/booking-list.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CreateItemComponent,
    ItemDetailsComponent,
    BookingDetailsComponent,
    ItemListComponent,
    NotFoundComponent,
    BookingListComponent,
    BookingListDialog,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [ MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatDialogModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
