"use strict";

let dayNumber = document.querySelectorAll('.page-nav__day-number'),
	weekDay = document.querySelectorAll('.page-nav__day-week'),
	weekDayArray = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	today = new Date(),
	todayFirstDay = today.setHours(0, 0, 0, 0)

for (let i = 0; i < dayNumber.length; i++) {
	let dayNow = new Date(todayFirstDay + (i * (24 * 60 * 60 * 1000)))

	dayNumber[i].textContent = `${dayNow.getDate()}`
	dayNumber[i].parentNode.dataset.timestamp = todayFirstDay + (i * (24 * 60 * 60 * 1000))
	weekDay[i].textContent = `${weekDayArray[dayNow.getDay()]}`

	if ((weekDay[i].textContent === 'Вс') || (weekDay[i].textContent === 'Сб')) { 
		dayNumber[i].parentNode.classList.add('page-nav__day_weekend')
	} else {
		dayNumber[i].parentNode.classList.remove('page-nav__day_weekend')
	}
}

let navBtn = document.querySelectorAll('.page-nav__day')
navBtn.forEach(el => {	
	el.addEventListener('click', () => { 
		navBtn.forEach(e => {
			e.classList.remove('page-nav__day_chosen');
		})
		el.classList.add('page-nav__day_chosen')
		createRequest(updateRequest, hallConfig)
	})
});

let main = document.querySelector("main"),
	updateRequest = 'event=update'

createRequest(updateRequest, hallConfig)

function hallConfig(response) {
	main.innerHTML = ''
	let arr = {}
	arr.seances = response.seances.result
	arr.films = response.films.result
	arr.halls = response.halls.result
	arr.halls = arr.halls.filter((hall) => hall.hall_open == 1)

	arr.films.forEach(film => { 
		let addHtml =
			`<section class="movie">
				<div class="movie__info">
					<div class="movie__poster">
						<img class="movie__poster-image" src="${film.film_poster}">
					</div>
					  <div class="movie__description">
						<h2 class="movie__title">${film.film_name}</h2>
						<p class="movie__synopsis">${film.film_description}</p>
						<p class="movie__data">
						  <span class="movie__data-duration">${film.film_duration} мин</span>
						  <span class="movie__data-origin">${film.film_origin}</span>
						</p>
					  </div>
					</div>`

		arr.halls.forEach((hall) => {
			let seances = arr.seances.filter(seance => ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === film.film_id)))
				
			if (seances.length > 0) {	
				addHtml +=
					`<div class="movie-seances__hall">
					  <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
					  <ul class="movie-seances__list">`

				seances.forEach(seance => 
					addHtml +=
					`<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"
					data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}"
					data-hall-name="${hall.hall_name}" data-price-standart="${hall.hall_price_standart}" 
					data-price-vip="${hall.hall_price_vip}" data-seance-id="${seance.seance_id}"
					data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">
					${seance.seance_time}</a></li>`
				);

				addHtml += `</ul></div>`
			};
		});

		addHtml += `</section>`

		main.insertAdjacentHTML("beforeend", addHtml)
	})
	
	let chosenSeance = document.querySelectorAll('.movie-seances__time'),
		chosenDay = document.querySelector('.page-nav__day_chosen'),
		chosenDayTimestamp = chosenDay.dataset.timestamp

	chosenSeance.forEach(el => {
		let seanseTimestamp = +chosenDayTimestamp + (+el.dataset.seanceStart * 60 * 1000)
		let now = new Date().getTime()

		if (seanseTimestamp < now)
			el.style.background = 'grey'
		
		el.addEventListener('click', (e) => {
			if (seanseTimestamp < now) {
				e.preventDefault()
			} else {
				let selectedContent = e.target.dataset
				selectedContent.timestamp = Math.floor(seanseTimestamp / 1000)

				selectedContent.hallConfig = arr.halls.find(hall => hall.hall_id == selectedContent.hallId).hall_config
				sessionStorage.setItem('session', JSON.stringify(selectedContent))
			}
		})
	})
}