import { ISuccessActions } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._description = container.querySelector('.order-success__description');
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		if (actions.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	set total(total: number) {
		this.setText(this._description, `Ваш заказ ${total} синапсов`);
	}
}
