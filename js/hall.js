"use strict"

let selectedContent = JSON.parse(sessionStorage.session),
	updateRequest = `event=get_hallConfig&timestamp=${selectedContent.timestamp}&hallId=${selectedContent.hallId}&seanceId=${selectedContent.seanceId}`,
	buyingInfoTitle = document.querySelector('.item__info-title'),
	buyingInfoStart = document.querySelector('.item__info-start'),
	buyingInfoHall = document.querySelector('.item__info-hall'),
	priceStandart = document.querySelector('.price-standart'),
	priceVip = document.querySelector('.price-vip'),
	configHall = document.querySelector('.conf-step__wrapper'),
	buttonAcception = document.querySelector('.acceptin-button')

buyingInfoTitle.innerHTML = selectedContent.filmName
buyingInfoStart.innerHTML = `Начало сеанса ${selectedContent.seanceTime}`
buyingInfoHall.innerHTML = selectedContent.hallName.split('Зал').join('Зал ')
priceStandart.innerHTML = selectedContent.priceStandart
priceVip.innerHTML = selectedContent.priceVip
buttonAcception.setAttribute('disabled', true)

createRequest(updateRequest, (response) => {
	if (response)
		selectedContent.hallConfig = response

	configHall.innerHTML = selectedContent.hallConfig


	let places = document.querySelectorAll('.conf-step__chair')
	places.forEach(el => {
		el.addEventListener('click', (e) => {
			if (e.target.closest('.conf-step__legend-price') || e.target.classList.contains('conf-step__chair_taken') || e.target.classList.contains('conf-step__chair_disabled'))
				return
			
			e.target.classList.toggle('conf-step__chair_selected')
				checkButton()
		})
	})

	function checkButton() {
		let chosenPlaces = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'))

		if (chosenPlaces.length > 0) {
			buttonAcception.removeAttribute('disabled')
			return
		}
		
		buttonAcception.setAttribute('disabled', true)
	}

	buttonAcception.addEventListener('click', () => {
		let selectedPlaces = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected')),
			selectedFeature = []

		selectedPlaces.forEach((chair) => {
			let row = chair.closest('.conf-step__row'),
				rowIndex = Array.from(row.parentNode.children).indexOf(row) + 1,
				chairIndex = Array.from(row.children).indexOf(chair) + 1,
				chairType = (chair.classList.contains('conf-step__chair_standart')) ? 'standart' : 'vip'

			selectedFeature.push({
				row: rowIndex,
				place: chairIndex, 
				type: chairType
			})
		})

		selectedContent.hallConfig = configHall.innerHTML
		selectedContent.selectedPlaces = selectedFeature
		sessionStorage.setItem('session', JSON.stringify(selectedContent))
		window.location.href = 'payment.html'
	})
})

let zoomBuying = document.querySelector('.buying')

zoomBuying.addEventListener('dblclick', () => {
	zoomBuying.classList.toggle('zooming')

	if (zoomBuying.classList.contains('zooming')){
		zoomBuying.style.transform = "scale(1.5) translate(0%, 10%)"
		return
	}
	
	zoomBuying.style.transform = "scale(1)"
})