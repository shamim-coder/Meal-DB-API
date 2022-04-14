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
        col.innerHTML = `
        <img class="img-fluid" src="https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png" alt="lime" />
        <h5 class="mt-3">${ingredient.strIngredient}</h5>`;
        ingredientsContainer.appendChild(col);
    });
};

const handleSearchMeals = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none");
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
    console.log(meals);
    document.getElementById("meals-total").innerText = meals = 0 ? 0 : meals;
    document.getElementById("ingredients-total").innerText = ingredients = 0 ? 0 : ingredients;
};

const getMeals = (meals) => {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("d-none");
    const mealsContainer = document.getElementById("meals-container");
    if (meals == null) {
        getResultCount(0, 0);
        document.getElementById("meals-title").innerText = "Meals Not Found";
    } else {
        document.getElementById("meals-title").innerText = "Popular Meals";
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
                <h5 class="mt-3">${strMeal}</h5>
            </div>
        `;

            mealsContainer.appendChild(mealDiv);
        });
        getResultCount(meals.length, ingredient.length);
    }
};

const loadMealDetails = async (id) => {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none");
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const response = await fetch(api);
    await response.json().then((data) => getMealDetails(data.meals[0]));
};

const getMealDetails = (meal) => {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("d-none");
    const mealContainer = document.getElementById("meal-container");
    mealContainer.innerHTML = "";
    const mealDetails = document.createElement("div");
    mealDetails.classList.add("row");

    const { strMeal, strMealThumb, strTags, strArea, strInstructions } = meal;
    const ingredientWithMeasure = [];
    const ingredientName = [];
    for (let i = 1; i < 20; i++) {
        if (meal["strIngredient" + i]) {
            ingredientName.push(meal["strIngredient" + i]);
        }
    }
    for (let i = 1; i < 20; i++) {
        if (meal["strIngredient" + i] && meal["strMeasure" + i]) {
            ingredientWithMeasure.push(meal["strMeasure" + i] + " " + meal["strIngredient" + i]);
        }
    }
    mealDetails.innerHTML = `
        <div class="col-lg-6">
            <h3 class="text-center mb-4">${strMeal}</h3>
            <img class="img-fluid" src="${strMealThumb}" alt="${strMeal}" />
            <p class="mt-4">Tags: ${strTags}</p>
            <p>Country: ${strArea}</p>
        </div>
        <div class="col-lg-6">
            <h3 class="text-center mb-4">Ingredients</h3>
            <div id="ingredients-container" class="row row-cols-4 g-5">
                ${ingredientName.map((ing) => `<div class="col text-center"><img src="https://www.themealdb.com/images/ingredients/${ing}-Small.png" alt="" /> <p>${ing}</p> </div> `).join("")}
            </div>
        </div>
        
        <div class="col-lg-6 mt-2 mb-5">
            <h3 class="text-center mb-4">Ingredient Measuring</h3>
            <ol class="list-group list-group-numbered m-auto">
            ${ingredientWithMeasure.map((ingWithMsr) => `<li class="list-group-item bg-transparent">${ingWithMsr}</li>`).join("")}
            </ol>
        </div>
        
        <div class="col-lg-6 mt-2 mb-5">
            <h3 class="text-center mb-4">Instructions</h3>
            <p class="instructions m-auto text-center">${strInstructions}</p>
        </div>
        `;

    mealContainer.appendChild(mealDetails);
};
