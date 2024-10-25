# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

- Товар 

```
interface IProductList {
  id: string; 
  discription: string; 
  image: string; 
  title: string; 
  category: string; 
  price: number | null; 
}
```

- Заказ

```
interface IOrder {
	total: number; 
	items: string[]; 
	email: string; 
	phone: string; 
	address: string; 
	payment: string; 
}
```

- Интерфейс для модели данных товаров

```
interface IProductsData {
	products: IProductList[]; 
	preview: string | null; 
	setProducts(products: IProductList[]): void; 
	getProducts(): IProductList[];
	getProduct(id: string): IProductList;
	savePreview(product: IProductList): void;
}
```

- Интерфейс для модели данных заказа

```
interface IOrderData {
	formErrors: TFormErrors;
	order: IOrder;
	setOrderPayment(value: string): void;
	setOrderEmail(value: string): void;
	setOrderField(field: keyof TOrderInput, value: string): void;
	setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
	validateOrder(): boolean;
	clearOrder(): void;
}
```

- Интерфейс для модели данных корзины

```
interface IBasketData {
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
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Этот код предоставляет основу для взаимодействия с сервером через _API_, поддерживая базовые методы работы с _HTTP_-запросами и обработки ответов.

Класс содержит методы:
- `handleResponse` - Логика обработки ответа сервера, вынесенная в отдельную функцию.
- `GET` - функция принимающая _url_ в качестве аргумента, и отправляющая на него _GET_-запрос.
- `POST` - функция принимающая _url_ , _data_ - объект с данными, представляющий собой тело запроса и метод передачи данных(по умолчанию _POST_).
параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - для отписки от события.
- `emit` - инициализация события

#### Класс `Component`
Представляет собой абстрактный класс, на основе которого базируются все остальные компоненты интерфейса. Он предоставляет общие методы для управления DOM-элементами, такие как переключение классов, установка текстового содержимого компонента или его изображения, управление видимостью и другие,

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение данных товара и логику работы с ними.
В конструктор принимает экземпляр класса `EventEmitter`

В полях класса хранятся данные:
- \_products: IProductList[] - Массив карточек продуктов
- \_preview: string | null - id выбранного продукта
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Геттеры и сеттеры:
- get products(): IProductList[] - Геттер products возвращает текущий список продуктов.
- get preview(): string | null - Геттер preview возвращает идентификатор продукта, выбранного для предварительного просмотра, или null, если предварительный просмотр не установлен.

Так же класс имеет набор методов для взаимодействия с этими данными:
- setProducts(products: IProductList[]): void - Метод для заполнения массива карточек продуктов
- getProducts(): IProductList[] - Возвращает массив карточек продуктов
- addProduct(product: IProductList): void - Метод добавляет товар в начало списка продуктов.
- getProduct (id: string): IProductList - Возвращает одну карточку продуктов по его id
- savePreview(product: IProductList): void - Метод для сохранения Preview

#### Класс BasketData
Класс отвечает за хранение данных корзины и логику работы с ней.\
В конструктор принимает экземпляр класса `EventEmitter`.  

В полях класса хранятся следующие данные:
- \_basket: IProductList[] - Массив объектов продуктов, добавленных в корзину.

Геттер:
- get products(): TProductBasket[] - Геттер возвращает текущий список продуктов в корзине.

Класс предоставляет набор методов для взаимодействия с данными корзины:
- appendToBasket(product: IProductList): void - Метод для добавления товара в корзину. 
- removeFromBasket(product: IProductList): void - Метод для удаления товара из корзины.
- isBasketCard(product: TProductBasket): void - Метод проверяет находится ли товар в корзине.
- getCardIndex(product: TProductBasket): number - Метод возвращает индекс продукта в корзине.
- getButtonStatus(product: TProductBasket): string - Метод возвращает статус кнопки для продукта. Если продукт не найден в корзине, метод возвращает строку 'Купить'. Если продукт уже находится в корзине, метод возвращает строку 'Удалить'.
- getBasketPrice(): number - Метод вычисляет и возвращает общую стоимость продуктов в корзине.
- getBasketQuantity(): number - Метод возвращает количество продуктов в корзине.
- clearBasket(): void - Метод для очистки всей корзины.
- sendBasketToOrder(orderData: IOrderData): void - Метод отправляет данные корзины в заказ

#### Класс OrderData
Класс отвечает за хранение и работу с данными заказа.\
В конструктор принимает экземпляр класса `EventEmitter`

В полях класса хранятся следующие данные:
- \_formErrors: FormErrors - Объект содержащий ошибки валидации форм
- \_order: IOrder — Объект, представляющий данные текущего заказа. Содержит следующие поля:
- email: string — Электронная почта клиента
- phone: string — Номер телефона клиента
- address: string — Адрес доставки
- payment: string — Способ оплаты

Геттеры:
- get formErrors(): TFormErrors - Геттер возвращает текущие ошибки формы заказа.
- get order(): IOrder - Геттер возвращает текущий объект заказа.

  Класс предоставляет набор методов для взаимодействия с данными заказа:
- setOrderPayment(value: PaymentType): void - Устанавливает способ оплаты в заказе
- setOrderAddress(value: string): void - Устанавливает адрес доставки в заказе
- setOrderEmail(value: string): void - Устанавливает электронную почту в заказе.
- setOrderField(field: keyof TOrderInput, value: string): void -Обновляет любое поле заказа на основе его имени и значения, после чего инициирует валидацию.
- validateOrder(): boolean - Выполняет валидацию заказа. Проверяет наличие значений в обязательных полях (email, phone, address, payment). Если одно из полей не заполнено, добавляет сообщение об ошибке в соответствующее


### Классы представления

Представление управляет отображением данных и обработкой событий пользовательского интерфейса, таких как клики на карточки продуктов и кнопки.

#### Класс `Modal`
Класс Modal относится к слою представления (View) приложения. Класс наследуется от родительского класса `Component`. Показывает модальное окно пользователю/покупателю.
Предоставляет методы `open`, `close`, `render` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку крестик для закрытия модального окна.

Конструктор принимает два аргумента:
- container - корневой элемент модального окна в DOM, переданный в качестве `HTMLElement`.
- events - объект, реализующий интерфейс `IEvents`

  Поля класса:
- \_modalButtonClose: HTMLButtonElement - кнопка для закрытия модального окна
- \_modalContent - контейнер для содержимого модального окна
- events - брокер событий

#### Класс `Card`
Класс Card так же относится к слою представления (View) приложения и является родительским для всех видов карточек.<br> 
Он отвечает за отображение карточки товара и корзины, задавая в карточке данные категории, заголовка, изображения, цены и описания, так же добавление и удаление товаров в корзине. Класс наследуется от родительского класса `Component` и используется для отображения карточек на странице сайта.\

В конструктор принимает два параметра:
- container: HTML-элемент, который будет служить контейнером для карточки.
- actions (опционально): объект с обработчиками событий для карточки (интерфейс ICardActions).

Методы:
- а также get-терры и set-терры для свойств, отвечающих за данные карточки продукта


#### Класс `Basket`
Класс Basket так же относится к слою представления (View) приложения.
Класс Basket отвечает за управление корзиной товаров на странице.\
Класс наследуется от родительского класса `Component`. Он включает в себя отображение списка товаров, расчет общей стоимости и обработку пользовательских действий, таких как оформление заказа.

Конструктор класса принимает два параметра:
- container: HTML-элемент, который будет служить контейнером для корзины.
- events: объект, реализующий интерфейс IEvents, используемый для обработки событий.

Методы:
- updateButtonState - Метод обновляет состояние кнопки оформления заказа в зависимости от общей стоимости товаров в корзине. Если общая стоимость больше нуля, то кнопка становится активной (снимается атрибут disabled). В противном случае кнопка становится неактивной (устанавливается атрибут disabled).
- set price(value: number) - сеттер устанавливает общую стоимость товаров в корзине.
- set items(items: HTMLElement[]) — сеттер для обновления списка товаров в корзине.

#### Класс `Form`
Класс Form представляет компонент формы в веб-приложении. Он наследуется от класса `Component` и принимает generic-параметр T, который определяет тип данных формы.

Конструктор класса принимает два параметра:
- container: HTML-элемент формы, который будет служить контейнером для компонента.
- events: объект, реализующий интерфейс IEvents, используемый для обработки событий.

Методы:
- onInputChange(field: keyof T, value: string) - Метод вызывается при изменении значения любого поля ввода в форме.
- render(state: Partial & IFormValidator) - Метод используется для обновления состояния формы.
- set valid(value: boolean) - сеттер устанавливает состояние валидности формы. Он принимает значение типа boolean и устанавливает атрибут disabled на кнопке отправки формы в зависимости от значения. Если значение true, кнопка становится активной, если false - неактивной.
- set errors(value: string) - сеттер устанавливает текст ошибок формы.


#### Класс `OrderPayment`
Класс OrderPayment так же относится к слою представления (View) приложения.\
Он наследуется от класса `Form` и принимает generic-параметр TOrderPayment, который определяет тип данных формы оплаты.\
Отвечает за управление выбором способа оплаты и адресом доставки в форме заказа. 

Конструктор класса принимает два параметра:
- container: HTML-элемент формы оплаты, который будет служить контейнером для компонента.
- events: объект, реализующий интерфейс IEvents, используемый для обработки событий.

Поля класса:
- \_buttonOnline: HTMLButtonElement — кнопка для выбора оплаты онлайн (картой)
- \_buttonCash: HTMLButtonElement — кнопка для выбора оплаты при получении
- \_address: HTMLInputElement — поле для ввода адреса доставки.

  Методы:
- set address(value: string) — сеттер для поля адреса, который устанавливающий адрес доставки.
- togglePayment(value: HTMLElement) — метод для переключения активного способа оплаты. Он сбрасывает предыдущий выбор и активирует выбранную кнопку.
- resetPayment() — метод для сброса состояния кнопок оплаты, используется при переключении кнопок.

#### Класс `OrderContacts`
Класс OrderContacts так же относится к слою представления (View) приложения.\
Он наследуется от класса `Form` и принимает generic-параметр TOrderContact
Отвечает за управление контактной информацией (электронная почта и телефон) в форме заказа.

Поля класса:
- \_email: HTMLInputElement — поле ввода для электронной почты.
- \_phone: HTMLInputElement — поле ввода для номера телефона.

  Методы:
- set email(value: string) — сеттер для поля электронной почты. Этот метод одновременно устанавливает значение для поля электронной почты и поля телефона.

#### Класс `Page`
Класс `Page` так же относится к слою представления (View) приложения.\
Он наследуется от класса `Component` и предназначен для управления визуальной частью страницы, в том числе каталогом товаров, счетчиком корзины, и блокировкой страницы.\
Этот класс используется для управления элементами страницы, обрабатывает события и изменяет визуальное представление в зависимости от состояния страницы.

Конструктор принимает два параметра:
- container: HTML-элемент, содержащий страницу, с которой будет работать класс.
- events: Объект, содержащий события, которые будут вызваны в процессе работы с страницей.

Поля класса:
- \_counter: HTMLElement — счетчик корзины.
- \_catalog: HTMLElement — элементы каталога товаров
- \_wrapper: HTMLElement — элемент обертки страницы
- \_basket: HTMLElement — элемент кнопки корзины

Методы:
- set counter(value: number) - Устанавливает значение счетчика товаров в корзине. 
- set catalog(items: HTMLElement[]) - Устанавливает массив элементов HTML, представляющих товары в каталоге. 
- set locked(value: boolean) - Устанавливает или снимает блокировку страницы.

#### Класс `Success`
Класс `Success` так же относится к слою представления (View) приложения.\
Он наследуется от класса `Component`\
Класс `Success` представляет собой компонент, отображающий сообщение об успешном оформлении заказа. Он предназначен для встраивания в существующую HTML-структуру и отвечает за отображение количества синапсов в заказе и предоставление возможности закрыть сообщение.

Конструктор принимает два параметра:
- container: HTML-элемент, содержащий страницу, с которой будет работать класс.
- actions: ISuccessActions - Объект, содержащий обработчики событий.

Поля класса:
- \_close: HTMLElement — кнопка закрытия после успешного оформления заказа.
- \_description: HTMLElement — информация о заказе(количество потраченных синапсов).

Методы:
- set total(total: number) - Этот сеттер отвечает за обновление отображаемой информации о заказе.

### Слой коммуникации

#### Класс AppApi

Класс `AppApi` предоставляет методы для взаимодействия с API приложения, в частности для получения данных о продуктах и оформления заказов. Он инкапсулирует базовый API (`_baseApi`) и добавляет логику для работы с CDN.

Конструктор принимает два аргумента:
- cdn: string - URL CDN для изображений.
- baseApi: IApi - Экземпляр базового API.

Поля класса:
- \_baseApi -  содержит экземпляр базового API
- cdn - содержит URL CDN для изображений продуктов.

Методы:
- getProducts(): Promise<IProductList[]> - Метод возвращает массив объектов продуктов и добавляет изображение к каждому продукту.
- getProduct(id: string): Promise<IProductList> - Метод возращает определенный продукт по его идентификатору.
- orderProducts(order: IOrder): Promise<IOrder> - Метод отправляет заказ на сервис.

## Взаимодействие компонентов

Код, описывающий взаимодействие слоя представления и слоя данных между собой и фактически выполняющий роль презентера, находится в файле `index.ts`
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в `index.ts`
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий

_Список всех событий, которые могут генерироваться в системе:_\
_События изменения данных (генерируются классами моделей данных)_

- `card:change` - изменение массива карточек продукта
- `card:selected` - должна провоцировать открытие модального окна карточки продукта
- `card:basket` - добавление товара в корзину
- `preview:change` - изменение карточки продукта в модальном окне
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `basket:open` - открываем интерфейс корзины 
- `basket:close` - закрываем интерфейс корзины 
- `basket:change` - смена числа на счетчике товаров корзины, расположенной на главной странице, изменение суммы приобретенных продуктов, изменение корзины
- `order:open` - открываем окно оформления заказа с первой формой
- `order:change` - изменяем поля формы оформления заказа
- `order:submit` - переход на заполнение данных пользователя
- `/^order\..*:changed/` - устанавливает состояние валидности полей и инициирует передачу данных в соответствующие модели
- `contacts:submit` - отправка _post_-запроса на сервер, открытие окна, уведомляющего об успешном оформлении заказа, а также очистка разметки корзины
