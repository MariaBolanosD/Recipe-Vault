from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'recipe_vault'

mysql = MySQL(app)

# REGISTER
@app.route('/register', methods=['POST'])
def register():
    data = request.json  # Ensure Flask is expecting JSON
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Extract required fields
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate fields
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    return jsonify({
        "message": f"User {username} registered successfully!",
        "data": data
    })
@app.route('/')
def home():
    return "Welcome to the User Service API!"

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    cursor = mysql.connection.cursor()
    cursor.execute(
        "SELECT * FROM usuarios WHERE correo_electronico = %s AND contraseña = %s",
        (data['email'], data['password'])
    )
    user = cursor.fetchone()
    cursor.close()
    if user:
        return jsonify({"message": "Inicio de sesión exitoso"})
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

# FAVORITES
@app.route('/favorites', methods=['GET', 'POST'])
def favorites():
    if request.method == 'POST':
        data = request.json
        return jsonify({"message": "Recipe added to favorites!", "recipe": data})
    elif request.method == 'GET':
        return jsonify({"favorites": ["Spaghetti", "Tacos"]})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
