const form = document.querySelector("form");
const blockForData = document.querySelector(".block_for_data");
const resultText = document.querySelector(".search_res");
const modalWindow = document.querySelector(".modal_window");
const modalContent = document.querySelector(".modal_content");

let store = [];

////////////////// OPEN MODAL ////////////////
const modalOpen = (e) => {
  e.stopPropagation();
  let parent = e.target.parentNode;
  if (e.target.parentNode == blockForData) return;
  genereteModal(parent.id);
  modalWindow.style.display = "flex";
  //   modalWindow.style.alignItems = "center";
};
////////////////  CLOSE MODAL ////////////////
const modalClose = (e) => {
  if (e.target == modalWindow) {
    modalWindow.style.display = "none";
  }
};
modalWindow.addEventListener("click", modalClose);

/////////////    GET  DATA   ////////////////////////

const getData = async (text) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let meals = data.meals;

    return meals;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

//////////////////CREATE MODAL ////////

const genereteModal = (id) => {
  modalContent.innerText = "";

  let mealInfo = store.find((meal) => meal.id == id);

  let title = document.createElement("h1");
  title.classList.add("title");
  title.textContent = mealInfo.name;

  let img = document.createElement("img");
  img.classList.add("modal_img");
  img.src = mealInfo.img;

  let ulIngredients = document.createElement("ul");
  ulIngredients.classList.add("ingredientList");
  mealInfo.ingredients.forEach((el) => {
    let li = document.createElement("li");
    li.textContent = el;
    ulIngredients.appendChild(li);
  });

  let ulMEsure = document.createElement("ul");
  ulMEsure.classList.add("mesureList");
  mealInfo.mesure.forEach((el) => {
    let li = document.createElement("li");
    li.textContent = el;
    ulMEsure.appendChild(li);
  });

  let instruction = document.createElement("p");
  instruction.classList.add("mealInstruction");
  instruction.textContent = mealInfo.instruction;

  modalContent.appendChild(title);
  modalContent.appendChild(img);
  modalContent.appendChild(ulIngredients);
  modalContent.appendChild(ulMEsure);
  modalContent.appendChild(instruction);
};

///////////////Storage ///////////

const storage = (text) => {
  store = [];

  getData(text).then((meals) => {
    meals.forEach((meal) => {
      let numMeasure = 1;
      let numIngredient = 1;
      let ingredients = [];
      let mesure = [];

      while (
        meal[`strMeasure${numMeasure}`] &&
        meal[`strMeasure${numMeasure}`].trim() != ""
      ) {
        mesure.push(meal[`strMeasure${numMeasure}`]);
        numMeasure += 1;
      }
      while (
        meal[`strIngredient${numIngredient}`] &&
        meal[`strIngredient${numIngredient}`].trim() != ""
      ) {
        ingredients.push(meal[`strIngredient${numIngredient}`]);
        numIngredient += 1;
      }

      store.push({
        instruction: meal.strInstructions,
        img: meal.strMealThumb,
        name: meal.strMeal,
        ingredients,
        mesure,
        id: meal.idMeal,
      });
    });
  });
};

////////////// CREATE /////////////////////

const genereteElem = async (e) => {
  e.preventDefault();

  if (!e.target.text.value.trim()) return;

  resultText.textContent = "";

  let text = e.target.text.value;
  e.target.text.value = "";

  await storage(text);

  let meals = getData(text);
  blockForData.innerText = "";

  meals.then((meals) => {
    if (meals) {
      meals.map((meal) => {
        const div = document.createElement("div");
        const p = document.createElement("p");
        const img = document.createElement("img");

        div.id = meal.idMeal;

        div.classList.add("meal_block");
        img.classList.add("meal_image");
        p.classList.add("meal_paragraph");

        img.src = meal.strMealThumb;
        p.innerText = meal.strMeal;

        div.appendChild(img);
        div.appendChild(p);

        div.addEventListener("click", modalOpen);

        blockForData.appendChild(div);
        resultText.textContent = `these are the results for ${text}`;
      });
    } else {
      resultText.textContent = "No meals found.";
    }
  });
};

form.addEventListener("submit", genereteElem);
