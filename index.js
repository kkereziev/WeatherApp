/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const documentList = document.querySelector(".ajax-section .cities");
const apiKey = "4d8fb5b93d4af21d66a2948710284366";

window.addEventListener("load", () => {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
      fetchUrl(url);
      msg.textContent = "";
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value;
  let divCities = document.querySelector(".container .cities");
  divCities.innerHTML = "";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
  fetchUrl(url);

  msg.textContent = "";
  form.reset();
  input.focus();
});

function createInnerHTMLForTag(we, icon, city) {
  return `<h2 class="city-name" data-name="${city.name},${city.country}">
          <span>${city.name}</span>
          <sup>${city.country}</sup>
          <span>${we["dt_txt"]}</span>
        </h2>
        <div class="city-temp">${Math.round(we.main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
    we.weather[0]["description"]
  }">
          <figcaption>${we.weather[0]["description"]}</figcaption>
        </figure>`;
}

function timeConverter(UNIX_timestamp) {
  const a = new Date(Number(UNIX_timestamp) * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours() - 3;
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const day = a.getDay();
  return (time = {
    year,
    month,
    date,
    day: daysOfWeek[day],
    hour,
    min,
    sec,
  });
}

const daysOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function fetchUrl(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const {
        list, //vzima temperatura, //vzima discription za vremeto i ikonka
        city, //vzima ime na grad i vzima abreviatura na grada
      } = data;
      const neededDays = [];
      neededDays.push(list[0]);
      let wantedHour = timeConverter(list[0]["dt"]);
      for (let i = 1; i < list.length - 1; i++) {
        let currentDateOfRec = timeConverter(list[i]["dt"]);
        if (wantedHour.hour === currentDateOfRec.hour) {
          neededDays.push(list[i]);
        }
      }
      for (let i = 0; i < neededDays.length; i++) {
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${neededDays[i].weather[0]["icon"]}.svg`;
        let li = document.createElement("li");
        li.classList.add("city");
        let a = createInnerHTMLForTag(neededDays[i], icon, city);
        li.innerHTML = a;
        documentList.appendChild(li);
      }
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
}
