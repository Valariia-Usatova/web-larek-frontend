import { IProductList, IProductsData, TFormErrors } from '../types';
import { IEvents } from './base/events';
export class ProductsData implements IProductsData {
	_products: IProductList[];
	_preview: string | null;

	constructor(protected events: IEvents) {
		this.events = events;
	}

	get products(): IProductList[] {
		return this._products;
	}

	setProducts(products: IProductList[]) {
		this._products = products;
		this.events.emit('card:change');
	}

	getProducts(): IProductList[] {
		return this._products;
	}

	addProduct(product: IProductList) {
		this._products = [product, ...this._products];
	}

	getProduct(id: string) {
		return this.products.find((product) => product.id === id) || null;
	}

	savePreview(product: IProductList): void {
		this._preview = product.id;
		this.events.emit('preview:change', product);
	}

	get preview(): string | null {
		return this._preview;
	}
}
