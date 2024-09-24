import './scss/styles.scss';

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

export interface IOrderForm {
  items: IProductList[];
  address?: string;
  email: string;
  phone: string;
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
}

export type TProductBasket = Pick<IProductList, 'id' | 'title' | 'price'>;

export type TPaymentMethod = 'card' | 'cash'; 