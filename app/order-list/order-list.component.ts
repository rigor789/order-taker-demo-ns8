import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { isIOS } from "platform";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { ContactService, OrderService, Order, Item } from "./../services";

declare var UITableViewCellSelectionStyle;

@Component({
	selector: "OrderList",
	moduleId: module.id,
	templateUrl: "./order-list.component.html",
	styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
	public orders: Order[];

	constructor(
		private page: Page,
		private router: RouterExtensions,
		private contact: ContactService,
		private order: OrderService
	) {
		this.orders = this.order.orders;
		this.page.actionBarHidden = true;
	}

	ngOnInit(): void {
	}

	selectItem(orderTaker: number, item: Item) {
		dialogs.action({
			message: `${item.name} (${item.quantity})`,
			cancelButtonText: "Cancel",
			actions: ["Edit item", "Remove item"]
		}).then(result => {
			if (result == "Edit item") {
				this.createAndUpdate(orderTaker, item);
			} else if (result == "Remove item") {
				this.order.removeItem(orderTaker, item);
			}
			this.orders = this.order.orders;
		});
	}

	getContact(id) {
		return this.contact.findContact(id);
	}

	getSubTotal(order: Order) {
		return this.order.subTotal(order);
	}

	getGrandTotal() {
		return this.order.grandTotal();
	}

	removeOrder(orderId: number) {
		this.order.removeOrder(orderId);
	}

	createAndUpdate(orderTaker: number, item: Item) {
		let queryParams = {
			orderTaker,
			item: JSON.stringify(item)
		};

		this.router.navigate(['/order-detail'], {
			queryParams,
			transition: {
				name: 'slideTop'
			},
			clearHistory: true
		});
	}

	close() {
		this.order.clear();
		this.router.navigate(['/home'], {
			animated: false,
			clearHistory: true
		});
	}

	onItemLoading(args) {
		if (isIOS) {
			const iosCell = args.ios;
			iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
		}
	}
}