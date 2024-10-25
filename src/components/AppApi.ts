import { IOrder, IProductList } from '../types/index';
import { IApi } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private _baseApi: IApi;
	private cdn: string;

	constructor(cdn: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.cdn = cdn;
	}

	getProducts(): Promise<IProductList[]> {
		return this._baseApi
			.get<ApiListResponse<IProductList>>(`/product`)
			.then((response) =>
				response.items.map((product) => ({
					...product,
					image: this.cdn + product.image,
				}))
			);
	}

	getProduct(id: string): Promise<IProductList> {
		return this._baseApi
			.get<IProductList>(`/product/${id}`)
			.then((product) => ({
				...product,
				image: this.cdn + product.image,
			}));
	}

	orderProducts(order: IOrder): Promise<IOrder> {
		return this._baseApi
			.post<IOrder>('/order', order)
			.then((data: IOrder) => data);
	}
}
