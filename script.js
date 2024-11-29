
JavaScript (script.js)
javascript
Copy code
// Replace with your actual Spoonacular API key
const API_KEY = 'your_spoonacular_api_key';
const API_BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (!query) {
        alert('Please enter a recipe name to search.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?query=${query}&number=6&apiKey=${API_KEY}`);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('An error occurred while fetching recipes. Please try again.');
    }
});

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found. Try another search!</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="fetchNutrition(${recipe.id})">View Nutrition</button>
        `;
        recipesContainer.appendChild(recipeCard);
    });
}

async function fetchNutrition(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`);
        const nutritionData = await response.json();
        displayNutrition(nutritionData);
    } catch (error) {
        console.error('Error fetching nutrition details:', error);
        alert('An error occurred while fetching nutrition details.');
    }
}

function displayNutrition(nutrition) {
    const nutritionInfo = document.getElementById('nutrition-info');
    nutritionInfo.innerHTML = `
        <p><strong>Calories:</strong> ${nutrition.calories} kcal</p>
        <p><strong>Carbohydrates:</strong> ${nutrition.carbs}</p>
        <p><strong>Protein:</strong> ${nutrition.protein}</p>
        <p><strong>Fat:</strong> ${nutrition.fat}</p>
    `;
}