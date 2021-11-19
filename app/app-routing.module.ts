import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "order-list", component: OrderListComponent },
    { path: "order-detail", component: OrderDetailComponent },
    { path: "home", component: HomeComponent }
];

export const navigatableComponents = [
    OrderListComponent,
    OrderDetailComponent,
    HomeComponent
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
