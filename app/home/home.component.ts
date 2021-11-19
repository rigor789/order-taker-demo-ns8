import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";

@Component({
	selector: "Home",
	moduleId: module.id,
	templateUrl: "./home.component.html",
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	public opening = true;

	constructor(
		private page: Page,
		private router: RouterExtensions
	) {
	}

	ngOnInit(): void {
		this.page.actionBarHidden = true;
	}

	newOrder() {
		this.opening = !this.opening;
		setTimeout(() => {
			this.router.navigate(['/order-detail'], {
				animated: false,
				clearHistory: true
			})
		}, 300);
	}
}