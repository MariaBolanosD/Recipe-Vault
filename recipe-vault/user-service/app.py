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

# Registro de usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nombre_usuario, correo_electronico, contraseña) VALUES (%s, %s, %s)",
        (data['username'], data['email'], data['password'])
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Usuario registrado con éxito"})

@app.route('/')
def home():
    return "Welcome to the User Service API!"

# Inicio de sesión
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
