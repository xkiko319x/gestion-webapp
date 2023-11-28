from flask import Flask, render_template, request, redirect, url_for
from os import path
app = Flask(__name__)

app.template_folder = path.join('client', 'templates')
app.static_folder = path.join('client','static')

@app.route('/')
def index():
    return render_template('index.html')



# continuar desarrollo
@app.route('/login', methods=("GET", "POST"))
def login():
    if request.method == "GET":
        return render_template("login.html")
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Aquí puedes agregar la lógica de autenticación según tus necesidades
        # Por ejemplo, puedes comparar con credenciales almacenadas en una base de datos

        # En este ejemplo, simplemente redirigimos a una página de bienvenida si las credenciales son correctas
        if username == 'a' and password == 'a':
            return redirect(url_for('welcome', username=username))
        else:
            return render_template('login.html', error='Credenciales incorrectas')

# prueba login
# @app.route('/welcome/<username>')
# def welcome(username):
#     return render_template('index.html')

# VISTAS DE PROYECTOS ---> ADMIN ONLY
@app.route("/proyecto")
def index_proyectos():
    return render_template('proyectos/index_proyecto.html')

# view para crear nuevo proyecto
@app.route('/proyecto/create', methods=("GET", "POST"))
def formulario_crear_proyecto():

    if request.method == 'GET':
       return render_template("proyectos/proyecto_create.html")
    if request.method == 'POST':
        # model crear nuevo proyecto
        return render_template("proyectos/resultado_proyecto_create.html")

# view para visualizar + editar
@app.route('/proyecto/view')
def info_proyecto():
    return render_template("proyectos/proyecto_visualizacion.html")

# view para eliminar proyecto 
@app.route('/proyecto/delete', methods=("GET", "POST"))
def delete_proyecto():
    if request.method == "GET":
        return render_template('proyectos/proyecto_delete_view.html')
    if request.method == "POST":
        # model ---> eliminar proyecto por id
        return render_template("proyectos/resultado_proyecto_delete.html")






# VISTAS PARA GESTION JEFES DE PROYECTOS ---> ADMIN ONLY
@app.route("/jps")
def index_jp():
    return render_template('jps/index_jps.html')

# view para crear nuevo proyecto
@app.route('/jps/create', methods=("GET", "POST"))
def formulario_crear_jp():

    if request.method == 'GET':
       return render_template("jps/jps_create.html")
    if request.method == 'POST':
        # model crear nuevo proyecto
        return render_template("jps/resultado_jps_create.html")

# view para visualizar + editar
@app.route('/jps/view')
def info_jps():
    return render_template("jps/jps_visualizacion.html")

# view para eliminar jps 
@app.route('/jps/delete', methods=("GET", "POST"))
def delete_jps():
    if request.method == "GET":
        return render_template('jps/jps_delete_view.html')
    if request.method == "POST":
        # model ---> eliminar jps por id
        return render_template("jps/resultado_jps_delete.html")























if __name__ == '__main__':
    app.run(debug=True)