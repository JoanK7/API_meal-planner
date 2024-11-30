document.addEventListener('DOMContentLoaded', function () {
    const preferencesForm = document.getElementById('preferences-form');
    const recipesContainer = document.getElementById('recipes-container');

    // Handle form submission for searching recipes
    preferencesForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get user input
        const query = document.getElementById('query').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();

        // Prepare search criteria
        const searchParams = {
            query: query || null, // Search by recipe name
            ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : null // Search by ingredients
        };

        try {
            // Send POST request to backend
            const response = await fetch('/search-recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recipes.');
            }

            const data = await response.json();
            displayRecipes(data.recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            recipesContainer.innerHTML = `<p>Error fetching recipes: ${error.message}</p>`;
        }
    });

    // Display fetched recipes
    function displayRecipes(recipes) {
        recipesContainer.innerHTML = ''; // Clear previous results

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found. Try different inputs.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p><strong>Cooking Time:</strong> ${recipe.readyInMinutes} minutes</p>
                <button onclick="fetchNutrition(${recipe.id})">View Nutrition</button>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Fetch and display nutrition data
    window.fetchNutrition = async function (recipeId) {
        try {
            const response = await fetch('/fetch-nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipe_id: recipeId }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch nutrition details.');
            }

            const data = await response.json();
            displayNutrition(data.nutrition);
        } catch (error) {
            console.error('Error fetching nutrition details:', error);
        }
    };

    // Display nutrition details
    function displayNutrition(nutrition) {
        const nutritionSection = document.getElementById('nutrition-section');
        const nutritionInfo = document.getElementById('nutrition-info');

        nutritionInfo.innerHTML = `
            <h3>Nutrition Details</h3>
            <p><strong>Calories:</strong> ${nutrition.calories} kcal</p>
            <p><strong>Carbs:</strong> ${nutrition.carbs}</p>
            <p><strong>Protein:</strong> ${nutrition.protein}</p>
            <p><strong>Fat:</strong> ${nutrition.fat}</p>
        `;
        nutritionSection.classList.remove('hidden');
    }
});