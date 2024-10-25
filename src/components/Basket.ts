import { TProductBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface IBasket {
	items: TProductBasket[];
	total: number | null;
}

export class Basket extends Component<IBasket> {
	protected _catalog: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>(`.basket__list`, this.container);
		this._price = ensureElement<HTMLElement>(`.basket__price`, this.container);
		this._button = container.querySelector(`.basket__button`);

		this.items = [];

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}
	}

	updateButtonState() {
		const totalPrice = parseFloat(this._price.textContent || '0');
		if (totalPrice > 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set price(value: number) {
		this._price.textContent = `${value} синапсов`;
		this.updateButtonState();
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._catalog.replaceChildren(...items);
		} else {
			this._catalog.replaceChildren(
				createElement('p', { textContent: 'Корзина пуста' })
			);
		}
		this.updateButtonState();
	}
}
