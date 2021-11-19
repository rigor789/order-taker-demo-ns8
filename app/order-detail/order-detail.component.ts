import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Page } from "ui/page";
import { screen, isIOS } from "platform";
import * as utils from "utils/utils";
import * as frame from "ui/frame";
import { PanGestureEventData } from "ui/gestures";
import { StackLayout } from "ui/layouts/stack-layout";
import { RouterExtensions } from "nativescript-angular/router";

import { ContactService, Contact } from "./../services/contact.service";
import { OrderService, Order, Item, ItemDetailType } from "./../services/order.service";

const AVATAR_LENGTH = 80;

declare var UIView;

@Component({
	selector: "OrderDetail",
	moduleId: module.id,
	templateUrl: "./order-detail.component.html",
	styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
	@ViewChild('container') container: ElementRef;

	item: Item;
	persons: Contact[];
	orderTaker: number = 0;
	currentDetailType: ItemDetailType = 'profile';
	halfScreenHeight = (screen.mainScreen.heightDIPs / 2) - 100;
	halfScreenWidth = (screen.mainScreen.widthDIPs / 2) - 40;
	prevDeltaX: number = 0;
	defaultPersonX: 0;

	constructor(
		private page: Page,
		private route: ActivatedRoute,
		private router: RouterExtensions,
		private fb: FormBuilder,
		private contact: ContactService,
		private order: OrderService
	) {
		this.page.actionBarHidden = true;
		this.persons = this.contact.contacts;
		this.setDefaultItem();
		this.route.queryParams.subscribe(params => {
			if (params['item']) {
				this.item = JSON.parse(params['item']);
			}

			this.defaultPersonX = this.getSnapPosition(0, params['orderTaker'] || 0);
		});

	}

	ngOnInit(): void {
		this.container.nativeElement.translateY = this.halfScreenHeight;
	}

	setDefaultItem() {
		this.item = <any>{
			id: null,
			name: '',
			price: '',
			quantity: ''
		};
	}

	saveOrder(item: Item) {
		this.order.addOrder(this.orderTaker, item);
		this.goToList();
	}

	goToList() {
		this.router.navigate(['/order-list'], {
			transition: {
				name: 'slideBottom'
			},
			clearHistory: true
		});
	}

	newItem(item: Item) {
		this.order.addOrder(this.orderTaker, item);
		this.setDefaultItem();
		this.selectItemDetail(null, 'profile');
	}

	setActiveInput(detailType: ItemDetailType) {
		if (detailType === 'profile') {
			this.selectItemDetail(null, detailType);
		}
	}

	onPanEvent(args: PanGestureEventData, container: StackLayout) {
		let newX: number = container.translateX + args.deltaX - this.prevDeltaX;

		switch (args.state) {
			case 0: this.prevDeltaX; break;
			case 2:
				container.translateX = newX;
				this.prevDeltaX = args.deltaX;
				break;
			case 3:
				container.animate({
					translate: { x: this.getSnapPosition(newX), y: 0 },
					duration: 200
				});
				this.prevDeltaX = 0;
		}
	}

	getSnapPosition(positionX: number, index?: number) {
		let closest = (arr) => val => arr.reduce((p, n) => Math.abs(p) > Math.abs(n - val) ? n - val : p, Infinity) + val;
		let snapList = []
		let currentWidth = this.halfScreenWidth;

		for (let i = 0; i < this.persons.length; i++) {
			snapList.push(currentWidth)
			currentWidth -= AVATAR_LENGTH;
		}

		if (index !== undefined) {
			this.orderTaker = index;
			return snapList[index];
		}

		let position = closest(snapList)(positionX);
		this.orderTaker = snapList.indexOf(position);

		return position;
	}

	selectItemDetail(inputItem, selectedDetail) {
		let tmpHeight = this.halfScreenHeight;
		let currentHeight = {
			'profile': tmpHeight,
			'name': isIOS ? 100 : 0,
			'quantity': -((tmpHeight / 2) + 30),
			'price': -(tmpHeight + (isIOS ? 10 : 30))
		};

		if (this.currentDetailType === selectedDetail) {
			return;
		}

		this.currentDetailType = selectedDetail;

		if (inputItem && selectedDetail !== 'profile') {
			if (isIOS) {
				inputItem.ios.inputAccessoryView = UIView.alloc().init();
			}
			inputItem.focus();
		} else {
			this.dismissSoftKeybaord();
		}
		this.container.nativeElement.animate({
			translate: { x: 0, y: currentHeight[selectedDetail] },
			duration: 200
		});
	}

	isSelected(name) {
		return this.currentDetailType === name;
	}

	getSelectedPerson() {
		let person = this.contact.findContact(this.orderTaker);

		return person ? person.name.firstName : 'PERSON';
	}

	dismissSoftKeybaord() {
		if (isIOS) {
			frame.topmost().nativeView.endEditing(true);
		} else {
			utils.ad.dismissSoftInput();
		}
	}

	close() {
		this.dismissSoftKeybaord();

		if (this.order.orders.length) {
			return this.goToList();
		}

		this.router.navigate(['/home'], {
			animated: false,
			clearHistory: true
		});
	}
}