const burgerBtn = document.querySelector('.burger-btn'),
	navMenu = document.querySelector('.header__nav-menu'),
	body = document.body,
	menuLinks = document.querySelectorAll('.nav-menu__link')

burgerBtn.addEventListener('click', function () {
	navMenu.classList.toggle('open')
	body.classList.toggle('lock')
})

menuLinks.forEach(link =>
	link.addEventListener('click', function () {
		navMenu.classList.toggle('open')
		body.classList.toggle('lock')
	})
)
