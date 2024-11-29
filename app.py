from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# API key for nutrition API (e.g., Edamam, Spoonacular)
API_KEY = "your_api_key"
API_URL = "https://api.spoonacular.com/recipes/complexSearch"
NUTRITION_API_URL = "https://api.spoonacular.com/recipes/{id}/nutritionWidget.json"

# Route for home page
@app.route('/')
def home():
    return "Meal Planner Backend is Running!"


# Route to get recipe recommendations
@app.route('/get-recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    preferences = data.get("preferences", {})
    ingredients = data.get("ingredients", [])

    # Call Spoonacular's Recipe API with user inputs
    params = {
        "apiKey": API_KEY,
        "includeIngredients": ",".join(ingredients),
        "diet": preferences.get("diet"),
        "cuisine": preferences.get("cuisine"),
        "number": 5,
    }

    try:
        response = requests.get(API_URL, params=params)
        recipes = response.json().get("results", [])
        return jsonify({"recipes": recipes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to fetch detailed nutrition information
@app.route('/fetch-nutrition', methods=['POST'])
def fetch_nutrition():
    data = request.get_json()
    recipe_id = data.get("recipe_id")

    try:
        response = requests.get(NUTRITION_API_URL.format(id=recipe_id), params={"apiKey": API_KEY})
        nutrition_data = response.json()
        return jsonify({"nutrition": nutrition_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
