import './scss/styles.scss';
import { IEvents, EventEmitter } from './components/base/events';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Card, BasketCard } from './components/Card';
import { Modal } from './components/Modal';
import { IApi, IProductList, IOrder, PaymentType } from './types/index';
import { AppApi } from './components/AppApi';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { OrderContacts } from './components/OrderContacts';
import { OrderPayment } from './components/OrderPayment';
import { Success } from './components/Success';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(CDN_URL, baseApi);
const events: IEvents = new EventEmitter();

const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
const body = document.body;

const page = new Page(document.body, events);
const modal = new Modal(modalContainerTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactForm = new OrderContacts(cloneTemplate(contactsTemplate), events);
const orderForm = new OrderPayment(cloneTemplate(orderTemplate), events);

events.on('card:change', () => {
	page.counter = basketData.products.length;
	page.catalog = productsData.products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:selected', product);
			},
		});
		return card.render({
			id: product.id,
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

events.on('card:selected', (product: IProductList) => {
	productsData.savePreview(product);
});

events.on('preview:change', (product: IProductList) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', product);
			events.emit('preview:change', product);
			modal.close();
		},
	});

	modal.render({
		content: card.render({
			id: product.id,
			category: product.category,
			description: product.description,
			image: product.image,
			price: product.price,
			title: product.title,
			buttonText: basketData.getButtonStatus(product),
		}),
	});
});

events.on('card:basket', (product: IProductList) => {
	basketData.isBasketCard(product);
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:change', () => {
	page.counter = basketData.products.length;
	basket.price = basketData.getBasketPrice();
	basket.items = basketData.products.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketData.removeFromBasket(basketCard);
			},
		});
		newBasketCard.index = basketData.getCardIndex(basketCard);
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		orderData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order:change',
	(data: { payment: PaymentType; button: HTMLElement }) => {
		orderForm.togglePayment(data.button);
		orderData.setOrderPayment(data.payment);
		orderData.validateOrder();
	}
);

events.on('errors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;

	orderForm.valid = !(payment || address);
	orderForm.errors = [payment, address].filter(Boolean).join('; ');

	contactForm.valid = !(email || phone);
	contactForm.errors = [email, phone].filter(Boolean).join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	basketData.sendBasketToOrder(orderData);

	api
		.orderProducts(orderData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			basketData.clearBasket();
			orderData.clearOrder();
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((error) => {
			console.error(`Произошла ошибка при отправке заказа: ${error}`);
		});
});

api.getProducts().then((response) => {
	Array.isArray(response)
		? productsData.setProducts(response)
		: console.error('Получен некорректный список продуктов', response);
});
