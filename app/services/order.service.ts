import { Injectable } from "@angular/core";

export interface Item {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number,
    items: Item[],
    orderTaker: number
};

export type ItemDetailType = 'profile' | 'name' | 'quantity' | 'price';

@Injectable()
export class OrderService {
    private _orders: Order[] = [];

    constructor() {
    }

    getOrder(orderTaker): Order {
        return this._orders.find(order => order.orderTaker === parseInt(orderTaker))
    }

    clear() {
        this._orders = [];
    }

    addOrder(orderTaker: number, newItem: Item) {
        let hasOrder = this.getOrder(orderTaker);

        if (!hasOrder) {
            newItem.id = 0;
            let newOrder = {
                id: this._orders.length + 1,
                orderTaker,
                items: [newItem]
            };

            this._orders.push(newOrder);
        } else {
            let existingItem = this.getOrder(orderTaker).items.find(item => item.id === newItem.id);

            if (existingItem) {
                Object.assign(this.getOrder(orderTaker).items
                    .find(item => item.id === newItem.id), newItem);
            } else {
                let newItemId = this.getOrder(orderTaker).items.length + 1;
                newItem.id = newItemId;
                this.getOrder(orderTaker).items.push(newItem);
            }
        }
    }

    removeItem(orderTaker: number, item: Item) {
        this.getOrder(orderTaker).items = this.getOrder(orderTaker).items
            .filter(existedItem => existedItem.name !== item.name);
    }

    updateOrder(updatedOrder: Order) {
        this._orders = this._orders
            .map(order => order.id === updatedOrder.id ? order : updatedOrder);
    }

    removeOrder(orderId: number) {
        this._orders = this._orders
            .filter(order => order.id === orderId);
    }

    get orders(): Order[] {
        return this._orders.filter(order => order.items.length);
    }

    subTotal(order: Order): number {
        return order.items
            .reduce((accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity), 0);
    }

    grandTotal(): number {
        return this.orders.reduce((accumalator, currentValue) => accumalator + this.subTotal(currentValue), 0);
    }
}
