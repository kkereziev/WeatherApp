/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form"); //za 4te nadolu-vzimame element ot html-a
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const documentList = document.querySelector(".ajax-section .cities");
const apiKey = "4d8fb5b93d4af21d66a2948710284366";

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      //vgradeno api za geolokaciq v js
      const long = position.coords.longitude; //vzimame longtitute
      const lat = position.coords.latitude; //vzimame latitute
      const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
      fetchUrl(url);
      msg.textContent = "";
    });
  }
});

form.addEventListener("submit", (e) => {
  //event listener za tursene po ime na grad i ni suzdava formite s vremeto
  e.preventDefault();
  const inputVal = input.value;
  let divCities = document.querySelector(".container .cities");
  divCities.innerHTML = "";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=metric`;
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
    we.weather[0]["description"] //ikonka i deskripshuna na vremeto
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
        list, //vzima temperatura, vzima discription za vremeto i ikonka
        city, //vzima ime na grad i vzima abreviatura na grada let {list}
      } = data;
      const wantedHour = timeConverter(list[0]["dt"]);

      const neededDays = list.reduce((a, b, i) => {
        i++;
        let currentDateOfRec = timeConverter(b["dt"]);
        if (wantedHour.hour === currentDateOfRec.hour) {
          a.push(b);
        }
        return a;
      }, []);

      neededDays.map((x) => {
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${x.weather[0]["icon"]}.svg`; //ikonki za vremeto
        let li = document.createElement("li");
        li.classList.add("city");
        let a = createInnerHTMLForTag(x, icon, city); // fuknkciq za generirane na html-a na otdelnite tabcheta s vremeto
        li.innerHTML = a;
        documentList.appendChild(li);
      });
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
}
