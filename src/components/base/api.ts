import { IApi } from '../../types';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api implements IApi {
	constructor(readonly baseUrl: string, protected options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get<T>(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse<T>);
	}

	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}
}
