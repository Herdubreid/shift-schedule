import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCardModule,
} from '@angular/material';
/**
 * App's Material Module
 */
@NgModule({
    exports: [
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatCardModule
    ]
})
export class MaterialModule { }