import { ICardActions } from '../types';
import { categories } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICard {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	selected: boolean;
	buttonText: string;
}

export abstract class BaseCard extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}
}

export class Card extends BaseCard {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._category = container.querySelector(`.card__category`);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description() {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categories.get(value), true);
	}

	get category() {
		return this._category.textContent || '';
	}

	set buttonText(value: string) {
		this._button.textContent = value;
	}
}

export class BasketCard extends BaseCard {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);

		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
