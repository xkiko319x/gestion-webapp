




# # VISTAS PARA GESTION JEFES DE PROYECTOS ---> ADMIN ONLY
# @app.route("/jps")
# def index_jp():
#     return render_template('jps/index_jps.html')

# # view para crear nuevo proyecto
# @app.route('/jps/create', methods=("GET", "POST"))
# def formulario_crear_jp():

#     if request.method == 'GET':
#        return render_template("jps/jps_create.html")
#     if request.method == 'POST':
#         # model crear nuevo proyecto
#         return render_template("jps/resultado_jps_create.html")

# # view para visualizar + editar
# @app.route('/jps/view')
# def info_jps():
#     return render_template("jps/jps_visualizacion.html")

# # view para eliminar jps 
# @app.route('/jps/delete', methods=("GET", "POST"))
# def delete_jps():
#     if request.method == "GET":
#         return render_template('jps/jps_delete_view.html')
#     if request.method == "POST":
#         # model ---> eliminar jps por id
#         return render_template("jps/resultado_jps_delete.html")