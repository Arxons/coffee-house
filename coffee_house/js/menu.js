import initModal from './modal.js';

const productsData = await getProductsData();

const controlFlags = {
	isRefresh: false,
	isDesktop: true,
};

const selectorTabs = document.querySelectorAll('.selector__tab');
selectorTabs.forEach(selectorTab =>
	selectorTab.addEventListener('click', event => {
		const selectorTabClass = selectorTab.classList[1];
		const tabType = selectorTab.classList[0];

		controlFlags.isRefresh = false;

		loadMenu(selectorTabClass);
		toggleSelectorClass(event, tabType);
	})
);

const refreshBtn = document.querySelector('.main-menu_update-btn');
refreshBtn.addEventListener('click', () => {
	controlFlags.isRefresh = true;
	loadMenu(checkActiveCategory());
});

window.addEventListener('resize', () => {
	checkControlFlags();
	loadMenu(checkActiveCategory());
});

async function getProductsData() {
	const response = await fetch('./src/products.json');
	if (response.ok) {
		const productsData = await response.json();
		return productsData;
	} else throw new Error('Something went wrong');
}

function loadMenu(category) {
	const menuList = document.querySelector('.main-menu__list');
	const refreshBtn = document.querySelector('.main-menu_update-btn');
	const products = getCategory(category);
	const { isRefresh, isDesktop } = controlFlags;
	let menuContent = '';

	if (products.length <= 4 || isDesktop || isRefresh) {
		refreshBtn.style.display = 'none';
	} else if (!isDesktop) {
		refreshBtn.style.display = 'block';
	}
	if (!isDesktop && !isRefresh) {
		products
			.slice(0, 4)
			.forEach(
				({ description, name, price }, i) =>
					(menuContent += createMenuList(description, name, price, i, category))
			);
	} else if (!isDesktop && isRefresh && products.length !== 4) {
		products
			.slice(4)
			.forEach(
				({ description, name, price }, i) =>
					(menuContent += createMenuList(
						description,
						name,
						price,
						i + 4,
						category
					))
			);
	} else if (isDesktop) {
		products.forEach(
			({ description, name, price }, i) =>
				(menuContent += createMenuList(description, name, price, i, category))
		);
	}
	menuList.innerHTML = menuContent;

	const listItems = document.querySelectorAll('.list__item');
	initModal(listItems);
}

function getCategory(category) {
	const categoryArr = new Array();

	productsData.forEach(product => {
		if (product.category === category) {
			categoryArr.push(product);
		}
	});
	return categoryArr;
}

function toggleSelectorClass(event, tabType) {
	const selectorTab = event.target.closest(`.${tabType}`);

	if (tabType == 'additives__tab') {
		selectorTab.classList.toggle('active');
	} else {
		selectorTab.classList.add('active');

		siblings(selectorTab).forEach(sibling => {
			sibling.classList.remove('active');
		});
	}
}

function siblings(elem) {
	return Array.from(elem.parentNode.children).filter(el => el !== elem);
}

function checkActiveCategory() {
	let selectorTabClass = '';
	selectorTabs.forEach(selectorTab => {
		if (selectorTab.classList[2] === 'active') {
			selectorTabClass = selectorTab.classList[1];
		}
	});
	return selectorTabClass;
}

function createMenuList(description, name, price, i, category) {
	const menuContent = `
    <div class="list__item">
						<img
							class="list__item_img"
							src="./src/images/${category}-${i + 1}.jpeg"
							alt="coffee"
						/>
						<div class="list__item_description">
							<p class="item_description__title">${name}</p>
							<p class="item_description__about">
								${description}
							</p>
							<p class="item_description__price">$${price}</p>
						</div>
					</div>
    `;
	return menuContent;
}

function checkControlFlags() {
	const pageWidth = document.documentElement.scrollWidth;

	if (pageWidth <= 780) {
		controlFlags.isDesktop = false;
	} else controlFlags.isDesktop = true;

	if (controlFlags.isDesktop === true) {
		controlFlags.isRefresh = false;
	}
}

checkControlFlags();
loadMenu('coffee');

export { toggleSelectorClass, checkActiveCategory, getCategory };
