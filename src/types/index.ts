// Интерфейсы API-клиента
export interface IApiClient {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: IOrder): Promise<IOrder>;
}
// Интерфейс для описания товара
export interface IProductList {
  id: string;
  discription: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс для описания товара в корзине
export interface IBasketItem {
  total: number | null;
  items: TProductBasket[]; 
}

export interface IOrder {
  id: string;
  items: TProductBasket[];
  paymentMethod: string;
  deliveryAddress: string;
  email: string;
  phone: string;
}

export interface IProductsData {
	products: IProductList[];
	preview: string | null;
  setProducts(products: IProductList[]): void;
	getProducts(): IProductList[];
	getProduct(id: string): IProductList;
	saveProduct(product: IProductList): void;
	savePreview(product: IProductList): void;
}

export interface IBasketData {
  products: TProductBasket[];
	addToBasket(product: IProductList): void;
	deleteFromBasket(product: IProductList): void;
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
  products: TProductBasket[];
  address: string;
  email: string;
  phone: string;
  payment: string;
}

export type TProductBasket = Pick<IProductList, 'id' | 'title' | 'price'>;

export type TPaymentMethod = 'card' | 'cash'; 

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}