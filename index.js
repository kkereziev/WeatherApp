/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form"); //za 4te nadolu-vzimame element ot html-a
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const documentList = document.querySelector(".ajax-section .cities");
const apiKey = "4d8fb5b93d4af21d66a2948710284366"; //key-at koito trqbva da izpolzvame, za da vzemem info ot apito za vremeto

window.addEventListener("load", () => {
  //event pri zarejdane na prilojenieto, namira ni lokaciqta i ni suzdava formite s vremeto
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      //vgradeno api za geolokaciq v js
      long = position.coords.longitude; //vzimame longtitute
      lat = position.coords.latitude; //vzimame latitute
      const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
      fetchUrl(url);
      msg.textContent = "";
    });
  }
});

form.addEventListener("submit", (e) => {
  //event listener za tursene po ime na grad i ni suzdava formite s vremeto
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
          <span>${city.name}</span> <!--ime na grada-->
          <sup>${
            city.country
          }</sup> <!--abreviaturata na stranata primerno bg,us-->
          <span>${we["dt_txt"]}</span> <!--datata-->
        </h2>
        <div class="city-temp">${Math.round(
          we.main.temp
        )}<sup>°C</sup></div> <!--temperaturata-->
        <figure>
          <img class="city-icon" src="${icon}" alt="${
    we.weather[0]["description"] //ikonka i deskripshuna na vremeto
  }">
          <figcaption>${we.weather[0]["description"]}</figcaption>
        </figure>`;
}

function timeConverter(UNIX_timestamp) {
  //konvertira unix kum data
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
  //suzdava formite
  fetch(url) //muy importante!!!! vzima zaqvki ot saitove i gi obrabotva
    .then((response) => response.json()) //responsut se parsva v json
    .then((data) => {
      //data= json ot zaqvkata
      const {
        list, //vzima temperatura, //vzima discription za vremeto i ikonka
        city, //vzima ime na grad i vzima abreviatura na grada let {list}
      } = data; //destructoring
      const neededDays = []; //suzdavame prazen masiv
      neededDays.push(list[0]); //butame purviq element ot list
      let wantedHour = timeConverter(list[0]["dt"]);
      for (let i = 1; i < list.length - 1; i++) {
        let currentDateOfRec = timeConverter(list[i]["dt"]);
        if (wantedHour.hour === currentDateOfRec.hour) {
          //proverka za chasovete //vzimame vsichki zapisi koito sa s ednakuv chas na 0leviq element na list
          neededDays.push(list[i]);
        }
      }
      for (let i = 0; i < neededDays.length; i++) {
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${neededDays[i].weather[0]["icon"]}.svg`; //ikonki za vremeto
        let li = document.createElement("li"); //suzdavame li element
        li.classList.add("city"); // dobavqme na li elementa class=city
        let a = createInnerHTMLForTag(neededDays[i], icon, city); // fuknkciq za generirane na html-a na otdelnite tabcheta s vremeto
        li.innerHTML = a; //dobavqme tabove na otdelnite li elementi
        documentList.appendChild(li); //zakachame li elementa kum elementa .ajax-section .cities=
      }
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩"; // ako apito ni vurne bad request obrabotvame greshkata
    });
}
