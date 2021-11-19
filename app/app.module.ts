import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule, navigatableComponents } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AvatarComponent } from "./avatar/avatar.component";
import { ContactService, OrderService } from "./services";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        AvatarComponent,
        ...navigatableComponents
    ],
    providers: [
        ContactService,
        OrderService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
