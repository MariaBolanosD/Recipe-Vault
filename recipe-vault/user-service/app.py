from flask import Flask, request, jsonify, session
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import re
import requests
from werkzeug.security import check_password_hash
from flask_cors import CORS, cross_origin# Import Flask-CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretKey1'  # Replace with a secure, random key
app.config['SESSION_TYPE'] = 'filesystem'  # Use filesystem-based sessions
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_COOKIE_SECURE'] = True  # Use True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True



CORS(app, supports_credentials=True, origins=["http://localhost:3001"])


# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Replace with your MySQL username
    password="root",  # Replace with your MySQL password
    database="recipe_vault"  # Use your database name
)
cursor = db.cursor()

from flask_login import LoginManager

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # Query your user database and return the user object
    cursor.execute("SELECT * FROM usuarios WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if user:
        return {'id': user[0], 'email': user[1], 'username': user[2]}
    return None

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = jsonify({"message": "Preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response



# Route: Login a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Query the database for the user
    cursor.execute("SELECT id, password FROM usuarios WHERE email = %s", (email,))
    result = cursor.fetchone()

    if result:
        user_id, hashed_password = result
        if check_password_hash(hashed_password, password):
            # Store user info in session
            session['user_id'] = user_id
            session['email'] = email
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/protected', methods=['GET'])
def protected():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized access. Please log in."}), 401

    user_id = session['user_id']
    return jsonify({"message": "You are logged in", "user_id": user_id}), 200

# Route: Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password or not username:
        return jsonify({"error": "Missing required fields"}), 400

    # Email validation
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Password validation (minimum 8 characters, at least one uppercase, one lowercase, one number)
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$'
    if not re.match(password_regex, password):
        return jsonify({
            "error": "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        }), 400

    hashed_password = generate_password_hash(password)

    try:
        cursor.execute(
            "INSERT INTO usuarios (email, username, password) VALUES (%s, %s, %s)",
            (email, username, hashed_password)
        )
        db.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()  # Clear session data
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        print("Error during logout:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/favorites', methods=['POST'])
def add_to_favorites():
    try:
        # Debugging: Print the incoming JSON data
        print("Request JSON data:", request.json)

        # Check if the user is logged in
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401

        user_id = session['user_id']
        data = request.get_json()
        #print("Session user ID:", user_id)
        #print("Received data:", data)

        # Validate the input
        spoonacular_id = data.get('spoonacularId')
        if not spoonacular_id:
            return jsonify({"error": "spoonacularId is required"}), 400

        # Check if the favorite already exists
        cursor.execute(
            "SELECT * FROM favorites WHERE user_id = %s AND spoonacularId = %s",
            (user_id, spoonacular_id)
        )
        existing_favorite = cursor.fetchone()

        if existing_favorite:
            print(f"Favorite already exists for user {user_id}, spoonacularId {spoonacular_id}")
            return jsonify({"message": "Recipe is already in favorites"}), 200

        # Insert the favorite into the database
        cursor.execute(
            "INSERT INTO favorites (user_id, spoonacularId) VALUES (%s, %s)",
            (user_id, spoonacular_id)
        )
        db.commit()

        #print(f"Added favorite for user {user_id} with spoonacularId {spoonacular_id}")
        return jsonify({"message": "Recipe added to favorites"}), 201
    except Exception as e:
        # Log the error for debugging
        print("Error in /favorites:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/favorites', methods=['GET'])
def get_favorites():
    try:
        # Check if the user is logged in
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401

        user_id = session['user_id']

        # Fetch favorite spoonacularIds from MySQL
        cursor.execute("SELECT spoonacularId FROM favorites WHERE user_id = %s", (user_id,))
        favorite_ids = [row[0] for row in cursor.fetchall()]  # Extract spoonacular IDs
        #print("Favorite IDs from MySQL:", favorite_ids)

        if not favorite_ids:
            return jsonify({"favorites": []}), 200

        # Send a request to server.js to fetch recipe details
        response = requests.post(
            "http://localhost:3000/fetch-recipes-by-ids",
            json={"spoonacularIds": favorite_ids}
        )
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch recipes from MongoDB."}), 500

        recipes = response.json().get("recipes", [])
        return jsonify({"favorites": recipes}), 200
    except Exception as e:
        print("Error in /favorites:", e)  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route('/favorites/<string:spoonacularId>', methods=['OPTIONS', 'DELETE'])
@cross_origin(origins="http://localhost:3001", methods=["DELETE", "OPTIONS"], supports_credentials=True)
def delete_favorite(spoonacularId):
    if request.method == 'OPTIONS':
        # Respond to preflight request
        response = jsonify({"message": "Preflight allowed"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3001"
        response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Content-Type"] = "application/json"
        return response, 200  # Use 200 OK for preflight responses

    try:
        # DELETE logic
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        cursor.execute(
            "DELETE FROM favorites WHERE user_id = %s AND spoonacularId = %s",
            (user_id, spoonacularId)
        )
        db.commit()
        return jsonify({"message": "Favorite removed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import requests

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    try:
        response = requests.get('http://127.0.0.1:4000/recipes')
        recipes = response.json()
        #print("Recipes from Node.js:", recipes)  # Debugging
        return jsonify(recipes)
    except Exception as e:
        print("Error in /recommendations:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000)
