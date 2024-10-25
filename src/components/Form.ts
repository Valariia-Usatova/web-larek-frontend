import { IFormValidator } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Form<T> extends Component<IFormValidator> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', ({ target }) => {
			const { name, value } = target as HTMLInputElement;
			this.onInputChange(name as keyof T, value);
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order.${field.toString()}:change`, {
			field,
			value,
		});
	}
	render(state: Partial<T> & IFormValidator) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
