export interface IProductList {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBasket {
	id: string;
	title: string;
	price: number;
	count?: number;
}

export interface IOrder {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface IFormValidator {
	valid: boolean;
	errors: string[];
}

export interface IProductsData {
	products: IProductList[];
	preview: string | null;
	setProducts(products: IProductList[]): void;
	getProducts(): IProductList[];
	getProduct(id: string): IProductList;
	savePreview(product: IProductList): void;
}

export interface IBasketData {
	products: TProductBasket[];
	appendToBasket(product: IProductList): void;
	removeFromBasket(product: IProductList): void;
	getCardIndex(product: IProductList): number;
	getButtonStatus(product: TProductBasket): string;
	getBasketPrice(): number;
	getBasketQuantity(): number;
	clearBasket(): void;
	sendBasketToOrder(orderData: IOrderData): void;
}

export interface IOrderData {
	formErrors: TFormErrors;
	order: IOrder;
	setOrderPayment(value: string): void;
	setOrderEmail(value: string): void;
	setOrderField(field: keyof TOrderInput, value: string): void;
	setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
	validateOrder(): boolean;
	clearOrder(): void;
}

export type TProductBasket = Pick<IProductList, 'id' | 'title' | 'price'>;

export type TOrderInput = Pick<
	IOrder,
	'payment' | 'address' | 'email' | 'phone'
>;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContact = Pick<IOrder, 'email' | 'phone'>;

export type PaymentType = 'card' | 'cash';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export interface ISuccessActions {
	onClick: () => void;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
