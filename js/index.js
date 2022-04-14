const getMealsAsync = async (searchKey) => {
    const api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchKey}`;
    const response = await fetch(api);
    return await response.json();
};

const getIngredient = async () => {
    const api = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
    const response = await fetch(api);
    await response.json().then((data) => loadIngredient(data.meals));
};

const loadIngredient = (data) => {
    const sliceData = data.slice(0, 12);
    const ingredientsContainer = document.getElementById("ingredients");
    sliceData.forEach((ingredient) => {
        const col = document.createElement("div");
        col.classList.add("col", "text-center");
        console.log(ingredient.strIngredient);
        col.innerHTML = `
        <img class="img-fluid" src="https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png" alt="lime" />
        <p>Chivito uruguayo</p>`;
        ingredientsContainer.appendChild(col);
    });
};

const handleSearchMeals = () => {
    const searchKey = document.getElementById("search-meal");
    const mealsContainer = document.getElementById("meals-container");
    const mealContainer = document.getElementById("meal-container");
    mealsContainer.innerHTML = "";
    mealContainer.innerHTML = "";
    getMealsAsync(searchKey.value).then((data) => getMeals(data.meals));
};

// load Meals
handleSearchMeals();

// Load Ingredients
getIngredient();

const getResultCount = (meals, ingredients) => {
    document.getElementById("meals-total").innerText = meals;
    document.getElementById("ingredients-total").innerText = ingredients;
};

const getMeals = (meals) => {
    const mealsContainer = document.getElementById("meals-container");
    const first8Meals = meals.slice(0, 12);
    const ingredient = [];

    first8Meals.forEach((meal) => {
        for (let i = 1; i < 20; i++) {
            if (meal["strIngredient" + i]) {
                ingredient.push(meal["strIngredient" + i]);
            }
        }

        const { strMeal, strMealThumb, idMeal } = meal;
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("col", "text-center");
        mealDiv.innerHTML = `
            <div onclick="loadMealDetails(${idMeal})" className="div">
                <img class="img-fluid" src="${strMealThumb}" alt="lime" />
                <p class="text-decoration-none">${strMeal}</p>
            </div>
        `;

        mealsContainer.appendChild(mealDiv);
    });
    getResultCount(meals.length, ingredient.length);
};

const loadMealDetails = async (id) => {
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const response = await fetch(api);
    await response.json().then((data) => getMealDetails(data.meals[0]));
};

const getMealDetails = (meal) => {
    const mealContainer = document.getElementById("meal-container");
    mealContainer.innerHTML = "";
    const mealDetails = document.createElement("div");
    mealDetails.classList.add("row");

    const { strMeal, strMealThumb, strTags, strArea } = meal;
    const ingredient = [];
    for (let i = 1; i < 20; i++) {
        if (meal["strIngredient" + i]) {
            ingredient.push(meal["strIngredient" + i]);
        }
    }

    mealDetails.innerHTML = `
        <div class="col-lg-6">
            <h3 class="text-center mb-4">${strMeal}</h3>
            <img class="img-fluid" src="${strMealThumb}" alt="${strMeal}" />
            <p>Tags: ${strTags}</p>
            <p>Country: ${strArea}</p>
        </div>
        <div class="col-lg-6">
            <h3 class="text-center mb-4">Ingredients</h3>
            <div id="ingredients-container" class="row row-cols-4 g-5">
                ${ingredient
                    .map((ing) => {
                        return `<div class="col text-center"><img src="https://www.themealdb.com/images/ingredients/${ing}-Small.png" alt="" /> 
                        <p>${ing}</p></div>`;
                    })
                    .join("")}
            </div>
        </div>`;

    mealContainer.appendChild(mealDetails);
};
