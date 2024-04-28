from flask import Flask, render_template, request, redirect, url_for
from os import path
"""Módulo que contiene la instancia de la aplicación de Flask.
Usando un patrón de producción"""
import os

from flask_login import LoginManager, login_required

# from server.auth.model import User



"""Factory Pattern para crear la instancia de la aplicación"""
    # Carga las variables

    # Configuración de la aplicación
app = Flask(
    __name__,
    instance_relative_config=True,
        template_folder="client/templates",
        static_folder="client/static",
)

    # app.secret_key = os.getenv("APP_SECRET_KEY")
    # login_manager = LoginManager(app)
    # login_manager.login_view = "auth.login"

    # # User loader para la identificación y autenticación
    # @login_manager.user_loader
    # def load_user(user_id):
    #     user = User.get_user_id(user_id)
    #     return user


from server.proyectos.view import bp as bp_proyectos
app.register_blueprint(bp_proyectos)

from server.jps.view import bp as bp_jps
app.register_blueprint(bp_jps)

from server.riesgos.view import bp as bp_riesgos
app.register_blueprint(bp_riesgos)

from server.auth.view import bp as bp_auth
app.register_blueprint(bp_auth)

@app.route("/")
def index():
    """Índice inicial de gestion"""
    return render_template("index.html")



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=63532)


# def create_app():
# return app


# app = Flask(__name__)
# app.template_folder = path.join('client', 'templates')
# app.static_folder = path.join('client','static')

# @app.route('/')
# def index():
#     return render_template('index.html')



# # continuar desarrollo
# @app.route('/login', methods=("GET", "POST"))
# def login():
#     if request.method == "GET":
#         return render_template("login.html")
    
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']

#         # Aquí puedes agregar la lógica de autenticación según tus necesidades
#         # Por ejemplo, puedes comparar con credenciales almacenadas en una base de datos

#         # En este ejemplo, simplemente redirigimos a una página de bienvenida si las credenciales son correctas
#         if username == 'a' and password == 'a':
#             return redirect(url_for('welcome', username=username))
#         else:
#             return render_template('login.html', error='Credenciales incorrectas')

# # prueba login
# # @app.route('/welcome/<username>')
# # def welcome(username):
# #     return render_template('index.html')

# if __name__ == '__main__':
#     app.run(debug=True)