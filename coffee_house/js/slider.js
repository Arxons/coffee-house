const sliderData = await getSliderData();
const sliderLine = document.querySelector('.slider__main-slide');
const prevBtn = document.querySelector('.slider__btn-prev');
const nextBtn = document.querySelector('.slider__btn-next');
const paginationLines = [];

let sliderWidth = sliderLine.offsetWidth;
let slideCounter = 0;
let x1 = 0;
let y1 = 0;

window.addEventListener('resize', () => {
	sliderWidth = sliderLine.offsetWidth;
});

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

async function getSliderData() {
	const response = await fetch('./src/slider.json');
	if (response.ok) {
		const sliderData = await response.json();
		return sliderData;
	}
}

function addSlides() {
	let sliderContent = '';
	sliderData.forEach(({ src, name, description, price }) => {
		sliderContent += `
  <div class="main-slide__container">
								<img class="main-slide__img" src="${src}" alt="coffee" />
								<h3 class="main-slide__title">${name}</h3>
								<p class="main-slide__description">${description}</p>
								<p class="main-slide__price">${price}</p>
							</div>
  `;
	});
	sliderLine.innerHTML = sliderContent;
}

function createPaginationLine() {
	const sliderControls = document.querySelector('.favorite__slider_controls');
	const paginationLine = document.createElement('div');
	const paginationProgress = document.createElement('div');
	paginationProgress.className = 'pagination-progress';
	paginationLine.className = 'pagination-line';
	sliderControls.appendChild(paginationLine);
	paginationLine.appendChild(paginationProgress);
	paginationLines.push(paginationLine);
}

function addPaginationLines() {
	sliderData.forEach(createPaginationLine);
	paginationLines[0].classList.add('active');
}

function nextSlide() {
	paginationLines[slideCounter].classList.toggle('active');
	slideCounter++;

	if (slideCounter >= sliderData.length) {
		slideCounter = 0;
	}
	rollSlide();
}

function prevSlide() {
	const slides = document.querySelectorAll('.main-slide__container');
	paginationLines[slideCounter].classList.toggle('active');
	slideCounter--;

	if (slideCounter < 0) {
		slideCounter = slides.length - 1;
	}

	rollSlide();
}

function rollSlide() {
	const slides = document.querySelectorAll('.main-slide__container');
	slides.forEach(slide => {
		slide.style.transform = `translateX(${-slideCounter * sliderWidth}px)`;
	});
	paginationLines[slideCounter].classList.toggle('active');
}

setInterval(() => {
	nextSlide();
}, 3000);

addPaginationLines();
addSlides();
