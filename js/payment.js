"use strict"

let selectedContent = JSON.parse(sessionStorage.session),
	ticketTitle = document.querySelector('.ticket__title'),
	ticketChairs = document.querySelector('.ticket__chairs'),
	ticketHall = document.querySelector('.ticket__hall'),
	ticketStart = document.querySelector('.ticket__start'),
	ticketCost = document.querySelector('.ticket__cost'),
	buttonAcception = document.querySelector('.acceptin-button'),
	date = new Date(selectedContent.timestamp * 1000),
	dateString = date.toLocaleString().slice(0, -3),
	ticketPlacesArray = [],
	cost = 0, 
	arr = selectedContent.selectedPlaces

ticketTitle.innerHTML = selectedContent.filmName
ticketHall.innerHTML = selectedContent.hallName.split('Зал').join('')
ticketStart.innerHTML = dateString

for (let i = 0; i < arr.length; i++) {
	ticketPlacesArray.push(`${arr[i].row}/${arr[i].place}`)
	if (arr[i].type === 'standart') {
		cost += +selectedContent.priceStandart
	} else {
		cost += +selectedContent.priceVip
	}
}

ticketChairs.textContent = ticketPlacesArray.join(', ')
ticketCost.textContent = cost