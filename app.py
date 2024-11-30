from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Spoonacular API configuration
API_KEY = os.getenv("SPOONACULAR_API_KEY")
API_BASE_URL = "https://api.spoonacular.com/recipes"

if not API_KEY:
    raise ValueError("SPOONACULAR_API_KEY not found. Check .env file.")

@app.route('/search-recipes', methods=['POST'])
def search_recipes():
    data = request.get_json()
    query = data.get('query')
    ingredients = data.get('ingredients')

    params = {
        "apiKey": API_KEY,
        "number": 6  # Limit to 6 results
    }

    # Add query or ingredients to search parameters
    if query:
        params["query"] = query
    if ingredients:
        params["includeIngredients"] = ','.join(ingredients)

    try:
        response = requests.get(f"{API_BASE_URL}/complexSearch", params=params)
        response.raise_for_status()
        recipes = response.json().get("results", [])
        return jsonify({"recipes": recipes})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fetch-nutrition', methods=['POST'])
def fetch_nutrition():
    data = request.get_json()
    recipe_id = data.get("recipe_id")

    try:
        response = requests.get(f"{API_BASE_URL}/{recipe_id}/nutritionWidget.json", params={"apiKey": API_KEY})
        response.raise_for_status()
        nutrition = response.json()
        return jsonify({"nutrition": nutrition})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
