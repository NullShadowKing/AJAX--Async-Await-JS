"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

const renderCountry = function (data, className = "") {
  const CounrtyLanguage = data.languages[Object.keys(data.languages)];
  const countryCurrency = data.currencies[Object.keys(data.currencies)].name;
  const CountryFlag = data.flags[Object.keys(data.flags)[1]];
  const CountryName = data.name[Object.keys(data.name)[0]];
  const CountryRegion = data.region;
  const html = `
  <article class="country ${className}" >
  <img class="country__img" src="${CountryFlag}" />
  <div class="country__data">
  <h3 class="country__name">${CountryName}</h3>
  <h4 class="country__region">${CountryRegion}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(2)} people </p>
    <p class="country__row"><span>🗣️</span>${CounrtyLanguage}</p>
    <p class="country__row"><span>💰</span>${countryCurrency}</p>
    </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

///////////////////////////////////////

// old school AJAX
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);

//   request.send();
//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);
//     const CounrtyLanguage = data.languages[Object.keys(data.languages)];
//     const countryCurrency = data.currencies[Object.keys(data.currencies)].name;
//     const CountryFlag = data.flags[Object.keys(data.flags)[1]];
//     const CountryName = data.name[Object.keys(data.name)[0]];
//     const CountryRegion = data.region;
//     const html = `
//         <article class="country">
//         <img class="country__img" src="${CountryFlag}" />
//         <div class="country__data">
//         <h3 class="country__name">${CountryName}</h3>
//         <h4 class="country__region">${CountryRegion}</h4>
//           <p class="country__row"><span>👫</span>${(
//             +data.population / 1000000
//           ).toFixed(2)} </p>
//           <p class="country__row"><span>🗣️</span>${CounrtyLanguage}</p>
//           <p class="country__row"><span>💰</span>${countryCurrency}</p>
//           </div>
//           </article>
//           `;
//     countriesContainer.insertAdjacentHTML("beforeend", html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// const Iran = "Islamic Republic of Iran";
// const Korea = "South Korea";
// const japan = "japan";

// getCountryData(Iran);
// getCountryData(Korea);
// getCountryData(japan);

// callback hell

// const getCountryAndNeighbor = function (country) {
//   // AJAX Call 1
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);
//     // recnder country 1
//     renderCountry(data);
//     // Get neighbor Country
//     const [neighbor] = data.borders;
//     // AJAX call 2
//     console.log(neighbor);
//     if (!neighbor) return;
//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbor}`);
//     request2.send();
//     // here we have nested ( function inside another function ) ( so much nested will cause callback hell )
//     request2.addEventListener("load", function () {
//       const [data2] = JSON.parse(this.responseText);
//       renderCountry(data2, "neighbour");
//     });
//   });
// };

// // const Iran = "Islamic Republic of Iran";
// // getCountryAndNeighbor(Iran);

// const USA = "usa";
// getCountryAndNeighbor(USA);

// Promises and Fetch API &  Chaining Promises
// this is the correct way without callback hell always follow this pattern ****************************
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then((response) => response.json())
//     .then((data) => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       if (!neighbour) return;
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then((response) => response.json())
//     .then((data) => renderCountry(data[0], "neighbour"));
// };
// getCountryData("usa");
// getCountryData("Islamic Republic of Iran");

// Handling rejected promises
// 1. Pass a second callback function in then (first one is for fullfield and the second one is for fail)
// 2. using the cache method  (better way) ( we only need to do it one time )
const getJSON = function (url, errorMsg = "Something Went Wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} ${response.status}`);
    }
    return response.json();
  });
};
/////////////////
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, "Country Not Found")
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error("No neighbour found!");
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "Country Not Found"
      );
    })
    .then((data) => renderCountry(data[0], "neighbour"))
    .catch((err) => {
      renderError(`Something went Wrong ${err.message}. try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

/////////////////
// this code commented and i added the new one up for better function calls and DRY principal
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then()
//     .then((data) => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       if (!neighbour) return;
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(
//       (response) => {
//         if (!response.ok) {
//           throw new Error(`Country not Found ${response.status}`);
//         }
//         return response.json();
//       }
//       // (err) => alert(err)
//     )
//     .then((data) => renderCountry(data[0], "neighbour"))
//     .catch((err) => {
//       // console.error(`${err}`);
//       renderError(`Something went Wrong ${err.message}. try again!`);
//     })
//     .finally(() => {
//       // this call back will be run always
//       // you can put spiners here
//       countriesContainer.style.opacity = 1;
//     });
// };
getCountryData("usa");
// btn.addEventListener("click", function () {
//   getCountryData("usa");
// });

// // 1. Code out side of any callback will run first A & D
// // 2. Promise will exec first ( because its more important ) and also promises will go to microtask queue but the timeout will go to call back queue
// // 3. Microtask queue has piorioty over callback queue
// // order of run : A --> D --> C --> B
// // *** Point : if promise takes time to run it will cause timeout to wait until it will be ready (this is important to avoid problems)
// console.log("Test start"); //A
// setTimeout(() => console.log("0 sec timer"), 0); //B
// Promise.resolve("Resolved promise 1").then((res) => console.log(res)); //C
// Promise.resolve("Resolved promise2").then((res) => {
//   for (let i = 0; i < 1000; i++) {
//   }
//     console.log(res);
// });
// console.log("Test End"); //D

// Building Promises
// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log("Lottery draw is happening 🔮");
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve("You WIN 😄");
//     } else {
//       reject(new Error("You Lost Your money😔"));
//     }
//   }, 2000);
// });

// lotteryPromise.then((res) => console.log(res)).catch((err) => console.log(err));

// Promisifying SetTimeout
// we could make it more simple with arrow functions
// const wait = function (second) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, second * 1000);
//   });
// };

// wait(1)
//   .then(() => {
//     console.log("I waited for 1 seconds");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("I waited for 2 seconds");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("I waited for 3 seconds");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("I waited for 4 seconds");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("I waited for 5 seconds");
//     return wait(1);
//   });

// Promise.resolve("You request resolved").then((x) => console.log(x));
// Promise.reject(new Error("You request rejected")).catch((x) => console.log(x));

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// getPosition()
//   .then((pos) => console.log(pos))
//   .catch((err) => new Error(err));

// Consuming Promises with Async/Await
// In fact the Async/Await technique is using the promise().then() in the background and it's just here to make the codes shorter and cleaner

// const WhereAmI = async function (country) {
//   // this two code are exactly the same
//   // Code #1
//   const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
//   // Code #2
//   // fetch(`https://restcountries.com/v3.1/name/${country}`).then((res)=> console.log(res));
//   const data = await res.json();
//   console.log(data);
//   renderCountry(data[0]);
// };

// const Iran = "Islamic Republic of Iran";
// WhereAmI(Iran);
// console.log("First");

// Error Handling with Try Catch Block

// try {
//   let y = 1;
//   const x = 2;
//   x = 3;
// } catch (err) {
//   alert(err.message);
// }

const WhereAmI = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error("Something Went Wrong With API");
    const data = await res.json();
    renderCountry(data[0]);
    // this string become a fulfiled promise Everything that we return from a Async await will be a fullfiled Promise ( if the function run correctly without error )
    return `You are in ${country}`;
  } catch (error) {
    console.log(error.message);
    throw err;
  }
};

const Iran = "Islamic Republic of Iran";

// WhereAmI(Iran)
//   .then((country) => console.log(country))
//   .catch((err) => console.log(err.message))
//   .finally(() => console.log("Operation Finished"));
// Conversion of above code block into async/await
// IIEF immediate EXCETIVE FUNCTION
(async function () {
  try {
    const country = await WhereAmI(Iran);
    console.log(country);
  } catch (error) {
    console.log(error.message);
  }
  console.log("Operation Finished");
})();

// Runnign Promises in Parallel
// POINT : always use try catch in async functions
const get3Countries = async function (c1, c2, c3) {
  try {
    // this way we fetch in sequence
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    // console.log([data1.capital, data2.capital, data3.capital]);

    // Parallel Method
    // POINT : IF one of the promises reject then all of them will be rejected
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map((d) => d[0].capital));
  } catch (err) {
    console.log(err);
  }
};

get3Countries(Iran, "usa", "canada");

// Promise.race
// Recieve an array of promises and return a promise
// happen when one of input promises fulfield (first one will win the race)
// if we get error the rejected one win
// this method is usefull in long promises or never ending promises (like when user have slow internet)
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/usa`),
    getJSON(`https://restcountries.com/v3.1/name/canada`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long!"));
    }, sec * 1000);
  });
};

Promise.race([getJSON(`https://restcountries.com/v3.1/name/italy`), timeout(5)])
  .then((res) => console.log(res[0]))
  .catch((err) => console.log(err));

// Promise.allSettled ES2020
// it will take an array of promises and will return an array of all fulfield promises

// Promise.allSettled([
//   Promise.resolve("Success 1"),
//   Promise.reject("failed 1"),
//   Promise.resolve("Success 2"),
//   Promise.resolve("Success 3"),
//   Promise.reject("failed 2"),
//   Promise.reject("failed 3"),
//   Promise.resolve("Success 4"),
// ]).then((res) => console.log(res));

// Promise.all([
//   Promise.resolve("Success 1"),
//   Promise.reject("failed 1"),
//   Promise.resolve("Success 2"),
//   Promise.resolve("Success 3"),
//   Promise.reject("failed 2"),
//   Promise.reject("failed 3"),
//   Promise.resolve("Success 4"),
// ])
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// Promise.any ES2021
// get an array and return the first fullfield promise
// it will ignore rejected ones
// Promise.any([
//   Promise.resolve("Success 1"),
//   Promise.reject("failed 1"),
//   Promise.resolve("Success 2"),
//   Promise.resolve("Success 3"),
//   Promise.reject("failed 2"),
//   Promise.reject("failed 3"),
//   Promise.resolve("Success 4"),
// ])
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
