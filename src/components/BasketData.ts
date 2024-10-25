import { IEvents } from './base/events';
import { IOrderData, IBasketData, TProductBasket } from '../types/index';

export class BasketData implements IBasketData {
	protected _products: TProductBasket[] = [];

	constructor(protected events: IEvents) {
		this.events = events;
	}

	get products(): TProductBasket[] {
		return this._products;
	}

	appendToBasket(product: TProductBasket) {
		this._products = [product, ...this._products];
		this.events.emit('basket:change');
	}

	removeFromBasket(product: TProductBasket) {
		this._products = this._products.filter(
			(_product) => _product.id !== product.id
		);
		this.events.emit('basket:change');
	}

	isBasketCard(product: TProductBasket) {
		return !this.products.some((card) => card.id === product.id)
			? this.appendToBasket(product)
			: this.removeFromBasket(product);
	}

	getCardIndex(product: TProductBasket) {
		return this._products.indexOf(product) + 1;
	}

	getButtonStatus(product: TProductBasket) {
		return !this._products.some((card) => card.id === product.id)
			? 'Купить'
			: 'Удалить';
	}

	getBasketPrice() {
		let total = 0;
		this._products.map((elem) => {
			total += elem.price;
		});
		return total;
	}

	getBasketQuantity() {
		return this._products.length;
	}

	clearBasket() {
		this._products = [];
		this.events.emit('basket:change');
	}

	sendBasketToOrder(orderData: IOrderData) {
		const orderItems = this._products.map((product) => product.id);

		orderData.setOrderField('items', orderItems);
		orderData.setOrderField('total', this.getBasketPrice());
	}
}
