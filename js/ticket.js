"use strict"

let selectedContent = JSON.parse(sessionStorage.session)

fetch("https://jscp-diplom.netoserver.ru/", {
	method: "POST",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: `event=sale_add&timestamp=${selectedContent.timestamp}&hallId=${selectedContent.hallId}&seanceId=${selectedContent.seanceId}&hallConfiguration=${selectedContent.hallConfig}`
});

let ticketTitle = document.querySelector('.ticket__title'),
	ticketChairs = document.querySelector('.ticket__chairs'),
	ticketHall = document.querySelector('.ticket__hall'),
	ticketStart = document.querySelector('.ticket__start'),
	date = new Date(selectedContent.timestamp * 1000),
	dateString = date.toLocaleString().slice(0, -3),
	hallName = selectedContent.hallName.split('Зал').join(''),
	ticketsPlacesArray = [],
	cost = 0,
	arr = selectedContent.selectedPlaces

ticketTitle.innerHTML = selectedContent.filmName
ticketHall.innerHTML = hallName
ticketStart.innerHTML = dateString

for (let i = 0; i < arr.length; i++) {
	ticketsPlacesArray.push(`${arr[i].row}/${arr[i].place}`)
}
ticketChairs.textContent = ticketsPlacesArray.join(', ')

let qrContent = `Билет в кино 
На сеанс: "${selectedContent.filmName}"
Начало сеанса: ${dateString}
Зал: ${hallName}
Ряд/Место: ${ticketChairs.textContent}
`

let qr = document.getElementById('qrcode')
qr.append(QRCreator(qrContent).result)
qr.querySelector('canvas').style.display = 'block'
qr.querySelector('canvas').style.margin = '0 auto'