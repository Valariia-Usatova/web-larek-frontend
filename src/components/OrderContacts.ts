import { TOrderContact } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class OrderContacts extends Form<TOrderContact> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this._phone = container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
	}

	set email(value: string) {
		this._email.value = value;
		this._phone.value = value;
	}
}
