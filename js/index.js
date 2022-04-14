const loadMealsByArea = () => {
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian")
        .then((res) => res.json())
        .then((data) => getMeals(data));
};
loadMealsByArea();

const getMeals = ({ meals }) => {
    const mealsContainer = document.getElementById("meals-container");
    meals.forEach((meal) => {
        const { strMeal, strMealThumb, idMeal } = meal;
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("col", "text-center");
        mealDiv.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="lime" />
            <a class="text-decoration-none" href="#">${strMeal}</a>
        `;

        mealsContainer.appendChild(mealDiv);
    });
};
