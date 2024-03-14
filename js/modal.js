import {
	toggleSelectorClass,
	checkActiveCategory,
	getCategory,
} from './menu.js';

export default function initModal(listItems) {
	listItems.forEach(item =>
		item.addEventListener('click', event => openModal(event))
	);
}

function openModal(event) {
	const itemName = event.currentTarget.querySelector(
		'.item_description__title'
	).textContent;
	const products = getCategory(checkActiveCategory());

	products.forEach(({ name, description, price, sizes, additives }, i) => {
		if (name == itemName) {
			const modal = document.querySelector('.main-menu__modal');
			modal.classList.add('open');
			document.body.style.overflow = 'hidden';

			createModal(
				name,
				description,
				price,
				sizes,
				additives,
				i,
				checkActiveCategory()
			);

			const closeBtn = document.querySelector('.description__close-btn');
			closeBtn.addEventListener('click', () => {
				modal.classList.remove('open');
				document.body.style.overflow = 'visible';
			});

			const priceCounter = [0];
			const sizeTabs = document.querySelectorAll('.modal__tab');
			sizeTabs.forEach(tab =>
				tab.addEventListener('click', event => {
					toggleSelectorClass(event, tab.classList[0]);
					calculateTotalPrice(tab, sizes, priceCounter, additives, price);
				})
			);
		}
	});
}

function calculateTotalPrice(
	currentTab,
	sizes,
	priceCounter,
	additives,
	price
) {
	const sizeTabName = currentTab
		.querySelector('.tab_icon')
		.textContent.toLowerCase();
	const sizesKeys = Object.keys(sizes);

	sizesKeys.forEach(sizesKey => {
		if (sizeTabName == sizesKey) {
			priceCounter.shift();
			priceCounter.unshift(Number(sizes[`${sizesKey}`]['add-price']));
		}
	});
	const additiveTabName = currentTab.querySelector('.tab_name').textContent;
	additives.forEach(additive => {
		if (
			additive.name == additiveTabName &&
			currentTab.classList[2] == 'active'
		) {
			priceCounter.push(Number(additive['add-price']));
		} else if (
			additive.name == additiveTabName &&
			currentTab.classList[2] != 'active'
		) {
			priceCounter.pop();
		}
	});

	const totalPrice =
		priceCounter.reduce((acc, number) => acc + number) + Number(price);
	document.querySelector('.total__price').textContent = `$${totalPrice.toFixed(
		2
	)}`;
}

function createModal(name, description, price, sizes, additives, i, category) {
	const modalBox = document.querySelector('.modal__box');

	modalBox.innerHTML = `
  <img
							class="modal__box_img"
							src="./src/images/${category}-${i + 1}.jpeg"
							alt="coffee"
						/>
						<div class="modal__box_description">
							<div class="description__title_container">
								<h2 class="description__title">${name}</h2>
								<p class="description__title-descr">
									${description}
								</p>
							</div>
							<div class="description__size_container">
								<p class="size__title">Size</p>
								<div class="size__tabs">
									<button class="size__tab modal__tab active">
										<div class="tab_icon">S</div>
										<div class="tab_name">${sizes.s.size}</div>
									</button>
									<button class="size__tab modal__tab">
										<div class="tab_icon">M</div>
										<div class="tab_name">${sizes.m.size}</div>
									</button>
									<button class="size__tab modal__tab">
										<div class="tab_icon">L</div>
										<div class="tab_name">${sizes.l.size}</div>
									</button>
								</div>
							</div>
							<div class="description__additives_container">
								<p class="additives__title">Additives</p>
								<div class="additives__tabs">
									<button class="additives__tab modal__tab">
										<div class="tab_icon">1</div>
										<div class="tab_name">${additives[0].name}</div>
									</button>
									<button class="additives__tab modal__tab">
										<div class="tab_icon">2</div>
										<div class="tab_name">${additives[1].name}</div>
									</button>
									<button class="additives__tab modal__tab">
										<div class="tab_icon">3</div>
										<div class="tab_name">${additives[2].name}</div>
									</button>
								</div>
							</div>
							<div class="description__total_container">
								<h2 class="total__title">Total:</h2>
								<h2 class="total__price">$${price}</h2>
							</div>
							<div class="description__alert_container">
								<div class="alert__icon"></div>
								<p class="alert__info">
									The cost is not final. Download our mobile app to see the
									final price and place your order. Earn loyalty points and
									enjoy your favorite coffee with up to 20% discount.
								</p>
							</div>
							<button class="description__close-btn">Close</button>
						</div>`;
}
