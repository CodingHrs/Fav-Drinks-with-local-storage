const drinks = document.getElementById("drinks");
const favoriteContainer = document.getElementById("fav-drinks");

// api url
const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

fetchFavdrinks();

// Calling that async function
getRandomdrink(apiUrl)
  .then((response) => {
    //console.log("Data Fetch Successfully");
  })
  .catch((error) => {
    console.error(error);
  });

// Defining async function
async function getRandomdrink(url) {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  const resData = await response.json();
  const randomdrink = resData.drinks[0];
  //console.log(randomdrink);

  // Pass API Array object to a function as an argument
  adddrink(randomdrink, true);
}

async function getdrinkById(id) {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id
  );
  // Storing data in form of JSON
  const resData = await response.json();
  const drink = resData.drinks[0];
  return drink;
}

// using the parameter we fetch all the values of the array object
function adddrink(drinkData, random = false) {
  const drink = document.createElement("div");
  drink.classList.add("drink");
  drink.innerHTML = `
    <div class="drink-header">
      ${random ? `<span class="random">Random Recipe</span>` : ""}
      <img src="${drinkData.strDrinkThumb}" alt="${drinkData.strDrink}" />

      <div class="drink-body">
        <h4>${drinkData.strDrink}</h4>
        <h2>${drinkData.idDrink}</h2>
        <div class="heart">
        <i class="bi bi-heart"></i>
        <i class="bi bi-heart-fill hide"></i>
        </div>
      </div>

    </div>
    `;

  const btn = drink.querySelector(".drink-body .heart");

  btn.addEventListener("click", (e) => {
    if (btn.firstElementChild.classList.contains("hide")) {
      removedrinkLS(drinkData.idDrink);
      btn.firstElementChild.classList.remove("hide");
      btn.lastElementChild.classList.add("hide");
    } else {
      adddrinkLS(drinkData.idDrink);
      btn.firstElementChild.classList.add("hide");
      btn.lastElementChild.classList.remove("hide");
    }
    fetchFavdrinks();
  });

  drinks.appendChild(drink);
}

function adddrinkLS(drinkID) {
  const drinkIds = getdrinkLS();
  localStorage.setItem("drinkIds", JSON.stringify([...drinkIds, drinkID]));
}

function removedrinkLS(drinkID) {
  const drinkIds = getdrinkLS();
  localStorage.setItem(
    "drinkIds",
    JSON.stringify(drinkIds.filter((id) => id !== drinkID))
  );
}

function getdrinkLS() {
  const drinkIds = JSON.parse(localStorage.getItem("drinkIds"));
  console.log(drinkIds + " hello");
  return drinkIds === null ? [] : drinkIds;
}

async function fetchFavdrinks() {
  favoriteContainer.innerHTML = "";
  const drinkIds = getdrinkLS();

  drinkIds.forEach(async (value, index) => {
    const drinkId = value;
    let drink = await getdrinkById(drinkId);
    adddrinkFav(drink);
  });
}

function adddrinkFav(drinkData) {
  const favDrink = document.createElement("li");

  favDrink.innerHTML = `
        <img
            src="${drinkData.strDrinkThumb}"
            alt="${drinkData.strDrink}"
        /><span>${drinkData.strDrink}${drinkData.idDrink}</span>
        <button class="clear"><i class="bi bi-x-circle-fill"></i></button>
    `;

  const btn = favDrink.querySelector(".clear");
  const heart = document.querySelector(".drink-body .heart");

  btn.addEventListener("click", () => {
    heart.firstElementChild.classList.remove("hide");
    heart.lastElementChild.classList.add("hide");
    removedrinkLS(drinkData.idDrink);
    fetchFavdrinks();
  });

  favoriteContainer.appendChild(favDrink);
}
