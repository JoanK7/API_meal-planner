// Encryption function
function decryptKey(encryptedKey) {
    return encryptedKey.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) - 1)
    ).join('');
}

const ENCRYPTED_KEY = '7gc:d85646de5ec3bdb815ce28c3geb1';
const API_KEY = decryptKey(ENCRYPTED_KEY);

// Handle form submission
document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const recipeName = document.getElementById('recipe-name').value.trim();
    const ingredients = document.getElementById('ingredients').value.trim();
    
    // Build API URL
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeName}&includeIngredients=${ingredients}&number=5`;
    
    try {
        // Fetch data from Spoonacular
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes.");
    }
});

// Display recipe results with links
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear previous results
    
    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found. Try again.</p>';
        return;
    }
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" width="100%">
            <p><a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}" target="_blank">View Recipe</a></p>
        `;
        recipesContainer.appendChild(recipeCard);
    });
}