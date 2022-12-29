// Original weather dashboard js file was from Louis's past challenge: https://github.com/louiskgkim/Weather-Dashboard
// Received key from https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys
let key = "b574cddc0867196624ca48984d8b52ac";
let city = "Seattle";

// Current Date
let date = dayjs().format("dddd, MMMM DD YYYY");

// City history from search
let citySearch = [];

// Save text value of search into an array and storage
$("#weather-search").on("click", function (event) {
	event.preventDefault();
	// Had to relook into "this" https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
	city = $(this).parent(".btnPar").siblings(".textVal").val();
	if (city === "") {
		return;
	};
	citySearch.push(city);

	// set local storage for city's that were searched
	localStorage.setItem("city", JSON.stringify(citySearch));
	getFiveDayForecastEl.empty();
	// getHistory();
	getTodayWeather();
});

let cardContent = $(".cardContent");

// Apply weather data to today's card and launch 5 day forecast
function getTodayWeather() {

	// API provided for challenge
	// https://openweathermap.org/forecast5
	let getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardContent).empty();

	$.ajax({
		url: getUrlCurrent,
		method: "GET",
	}).then(function (response) {
		$(".cardTodaysCityName").text(response.name);
		$(".cardTodaysDate").text(date);

		//Icons: https://openweathermap.org/weather-conditions
		$(".icons").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		let pEl = $("<p>").text(`Temperature: ${response.main.temp} °F`);
		cardContent.append(pEl);
		// Lat and long of searched city
		let cityLat = response.coord.lat;
		let cityLon = response.coord.lon;

	});
	getFiveDayForecast();
};

let getFiveDayForecastEl = $(".fiveForecast");

// 5 day forecast: https://openweathermap.org/forecast5
function getFiveDayForecast() {
	let getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: "GET",
	}).then(function (response) {
		let fiveDayArray = response.list;
		let weatherCards = [];

		// Friend helped me create this array to show data on cards
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(" ")[0],
				time: value.dt_txt.split(" ")[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
			};

			// learned helpful tip in splitting again in 12/12/22's class
			if (value.dt_txt.split(" ")[1] === "12:00:00") {
				weatherCards.push(testObj);
			}
		});

		//Cards to display on screen
		for (let i = 0; i < weatherCards.length; i++) {

			let divElCard = $("<div>");
			divElCard.attr("class", "card text-black bg-light mb-3 cardOne");
			divElCard.attr("style", "max-width: 1000px;");
			getFiveDayForecastEl.append(divElCard);

			let divElHeader = $("<div>");
			divElHeader.attr("class", "card-header");
			let m = dayjs(`${weatherCards[i].date}`).format("MM-DD-YYYY");
			divElHeader.text(m);
			divElCard.append(divElHeader);

			let divElBody = $("<div>");
			divElBody.attr("class", "card-body");
			divElCard.append(divElBody);

			// Pull correct image icons from icon source
			let divElIcon = $("<img>");
			divElIcon.attr("class", "icons");
			divElIcon.attr("src", `https://openweathermap.org/img/wn/${weatherCards[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			// Temperature to display on cards
			let pElTemp = $("<p>").text(`Temperature: ${weatherCards[i].temp} °F`);
			divElBody.append(pElTemp);

		}
	});
};

function initLoad() {

	let citySearchStore = JSON.parse(localStorage.getItem("city"));

	if (citySearchStore !== null) {
		citySearch = citySearchStore;
	}
	getTodayWeather();
};

// MUSCLE STARTS HERE
let muscle = [];

$("#muscleOptions").on("change", function (event) {
	event.preventDefault();
	console.log('button clicked');
	console.log($(this).val());
	muscle = $(this).val();

	// https://materializecss.com/select.html 

	// muscle = $(this).parent(".btnBod").siblings(".textBod").val();
	if (muscle === "") {
		return;
	};

	// localStorage.setItem("muscle", JSON.stringify(muscleOptions));
});

$("#muscle-search").on("click", function (event) {
	event.preventDefault();
	getTodayMuscle();
});

let muscleCont = $(".muscleContent");
// name, muscle, equipment
let muscleInst = $(".muscleInstructions");
// instructions

// Received API GET query from https://api-ninjas.com/api/exercises
function getTodayMuscle() {
	let getUrlMuscle = `https://api.api-ninjas.com/v1/exercises?muscle=` + muscle;

	$.ajax({
		method: 'GET',
		// need to work on template literals https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		url: getUrlMuscle,
		headers: { 'X-Api-Key': '2V+JOSM/L4NDwhAccQy2NQ==Ff6aU29r1pMP8WuX' },
		contentType: 'application/json',
		success: function (response) {
			console.log(response[0].name);
		},
		error: function ajaxError(jqXHR) {
			console.error('Error: ', jqXHR.responseText);
		}
	}).then(function (response) {
		response.forEach(workout => {
			console.log(workout.name);
			let pElOne = $("<p>").text(`Name: ${workout.name}`);
			let pElTwo = $("<p>").text(`Muscle: ${workout.muscle}`);
			let pElThree = $("<p>").text(`Equipment: ${workout.equipment}`);
			muscleCont.append(pElOne);
			muscleCont.append(pElTwo);
			muscleCont.append(pElThree);
			let pElFour = $("<p>").text(`Instructions: ${workout.instructions}`);
			muscleCont.append(pElFour);
		});
	});
};

initLoad();