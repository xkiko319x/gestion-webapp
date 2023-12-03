
const tabla = document.getElementById("tabla_riesgos")
let filas = tabla.querySelectorAll("tr")

function addOptions(domElement, array) {
    var selector = document.getElementsByName(domElement)[0];
    for (categoria in array) {
        var opcion = document.createElement("option");
        opcion.text = array[categoria];
    
        opcion.value = array[categoria]
        selector.add(opcion);
    }
}

let categorias_seleccionar = document.querySelectorAll(".categorias")
let subcategorias_seleccionar = document.querySelectorAll(".subcategorias")

categorias_seleccionar.forEach(function(input, index) {
    input.addEventListener('input', function() {
        agregar_datalist_subcategorias(input, index)
    })
})

function agregar_datalist_subcategorias(input) {
    var categoria_seleccionada = input.value

    var fila = input.closest("tr")
    var subcategorias_seleccionada = fila.querySelector('.subcategorias');

    subcategorias_seleccionada.value = ''

    // seleccion de la subcategoria, dependiendo de la categoria seleccionada
    if (categoria_seleccionada === "De Carácter Técnico") {
        subcategorias_seleccionada.setAttribute("list", "tecnico")
    } else {
        if (categoria_seleccionada === "Del Entorno") {
            subcategorias_seleccionada.setAttribute("list", "entorno")
        } else {
            if (categoria_seleccionada === "De la Organización") {
                subcategorias_seleccionada.setAttribute("list", "organizacion")
            } else {
                if (categoria_seleccionada === "De la Gestión del Proyecto") {
                    subcategorias_seleccionada.setAttribute("list", "gestion")
                } else {
                    // informacion
                    subcategorias_seleccionada.setAttribute("list", "informacion")
                }
            }
        }
    }  
}

function eliminarRegistroRiesgo(url, datos) {

    fetch(url, {
        method: "DELETE",
        body: JSON.stringify(datos),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            let probabilidades1 = document.querySelectorAll(".probabilidades")
            let impactos1 = document.querySelectorAll(".impactos")
            calcular_impacto_economico1(probabilidades1,impactos1);
            alert("Riesgo y acciones asociadas eliminados")
        })
        .catch(error => {
            console.error("Error al borrar el registro");
            console.error(error);
        })

}

function borrar_riesgo(boton) {
    let id_meta = boton.id;
    let datos = (id_meta)
    const url_id_proyecto = window.location.pathname;
    const id_proyecto = url_id_proyecto.split('/').slice(3)

    let url = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto + "/delete"

    var confirmacion = window.confirm("¿Estás seguro de borrar el riesgo?")
    if (confirmacion === true) {
        var confirmacion2 = window.confirm("Se eliminarán las acciones asociadas a este riesgo. ¿Está seguro de eliminarlo?")
        if (confirmacion2===true) {
            var fila = boton.parentNode.parentNode;
            var campoId_item = fila.cells[0].querySelector('input[type="text"]')
            var campo_impt = fila.cells[9].querySelector('input[type="number"]')
            campo_impt.value = 0
            var id_item = campoId_item.value
            const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
            var code = id_item
            // Ocultar la fila
            fila.classList.add('ocultar-fila');

            for (var i = 1; i < tabla_respuesta.rows.length; i++) {
                var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
                if (code_buscado.value === code) {
                    var fila_tabla_respuesta = code_buscado.parentNode.parentNode
                    fila_tabla_respuesta.classList.add('ocultar-fila')
                }
            }
            // llama al fetch para eliminar el registro
            eliminarRegistroRiesgo(url, datos)  
            
            // var div_mensaje_borrar = document.getElementById("texto-borrar")
            // div_mensaje_borrar.style.display = "block"
        }
    } else {
        alert("Riesgo no borrado")
    }

}

function actualizar_datos_riesgos(url, datos_riesgo) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(datos_riesgo),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
           alert("Actualización del Riesgo y Acciones Asociadas")
        })
        .catch(error => {
            console.error("Error al enviar el formulario");
            console.error(error);
        })
}

function editar_riesgo(boton) {
    //boton editar
    var row = boton.parentNode.parentNode;
    var inputs = row.querySelectorAll('input');

    var campoId_item = row.cells[0].querySelector('input[type="text"]')
    var id_item = campoId_item.value
    const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
    var code = id_item

    for (var i = 1; i < tabla_respuesta.rows.length; i++) {
        var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
        if (code_buscado.value === code) {
            var fila_respuesta = code_buscado.parentNode.parentNode;
            var botonText = boton.innerText;
            var inputs_respuesta = fila_respuesta.querySelectorAll('input');
            var textarea = fila_respuesta.querySelectorAll('textarea')
            
            inputs_respuesta.forEach(function (input) {
                if (botonText === 'Editar Riesgo') {
                    input.removeAttribute('readonly');
                } else {
                    input.setAttribute('readonly', 'true');
                }
            });

            textarea.forEach(function (textarea) {
                if (botonText === 'Editar Riesgo') {
                    textarea.removeAttribute('readonly');
                } else {
                    textarea.setAttribute('readonly', 'true');
                }
            });


        }
    }

    var botonText = boton.innerText;
    var textarea = row.querySelectorAll('textarea')
    // var select = row.querySelectorAll('select')

    inputs.forEach(function (input) {
        if (botonText === 'Editar Riesgo') {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('readonly', 'true');
        }
    });

    textarea.forEach(function (textarea) {
        if (botonText === 'Editar Riesgo') {
            textarea.removeAttribute('readonly');
        } else {
            textarea.setAttribute('readonly', 'true');
        }
    });
    // Alternar el texto del botón entre "Editar" y "Guardar"
    
    boton.innerText = (botonText === 'Editar Riesgo') ? 'Guardar Riesgo' : 'Editar Riesgo';
    
}

function actualizar_riesgo(boton) {

    // campos de la primera tabla + id_meta de la page
    // ----------------PARTE DEL RIESGO-----------------
    let id_meta = boton.id
    var fila = boton.parentNode.parentNode;
    var fecha = fila.cells[1].querySelector('input[type="date"]').value
    var tipo = fila.cells[2].querySelector('input[type="text"]').value
    var causa = fila.cells[3].querySelector('textarea').value
    var categoria = fila.cells[4].querySelector('input[type="text"]').value
    var subcategoria = fila.cells[5].querySelector('input[type="text"]').value
    var probabilidad = fila.cells[6].querySelector('input[type="number"]').value
    var efecto = fila.cells[7].querySelector('textarea').value
    var area = fila.cells[8].querySelector('input[type="text"]').value
    var impacto = fila.cells[9].querySelector('input[type="number"]').value
    var resultado = fila.cells[10].querySelector('input[type="number"]').value
    var nivel = fila.cells[11].querySelector('input[type="text"]').value
    var ie =  fila.cells[12].querySelector('input[type="number"]').value

    var datos_riesgo = new Object()
    datos_riesgo = {
        Id_meta: id_meta,
        Fecha_deteccion: fecha,
        Tipo_riesgo: tipo,
        Causa: causa,
        Categoria: categoria,
        Subcategoria: subcategoria,
        Probabilidad: probabilidad,
        Efecto: efecto,
        Area_afectada: area,
        Impacto: impacto,
        Valor_riesgo: resultado,
        Nivel_riesgo: nivel,
        Impacto_Economico: ie,
    }

    const url_id_proyecto1 = window.location.pathname;
    const id_proyecto1 = url_id_proyecto1.split('/').slice(3)
    let url = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto1 + "/update"

    // primero pasa por el gms y luego se sube a notion
    var confirmacion = window.confirm("¿Estás seguro de actualizar los valores?")
    if (confirmacion === true) {
        // llama a fetch para actualizar el registro
        actualizar_datos_riesgos(url, datos_riesgo)
    } else {
        alert("Riesgo no actualizado")
    }

    // ---------------PARTE DE LAS ACCIONES--------------------
    const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
    var id_item = fila.cells[0].querySelector('input[type="text"]').value
    var code = id_item


    for (var i = 1; i < tabla_respuesta.rows.length; i++) {
        var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
        if (code_buscado.value === code) {
            var fila_respuesta = code_buscado.parentNode.parentNode;

            var estrategia = fila_respuesta.cells[2].querySelector('input[type="text"]').value
            var actividades = fila_respuesta.cells[3].querySelector('textarea').value
            var responsable = fila_respuesta.cells[4].querySelector('input[type="text"]').value
            var probabilidad_respuesta = fila_respuesta.cells[5].querySelector('input[type="number"]').value
            var impacto_respuesta = fila_respuesta.cells[6].querySelector('input[type="number"]').value
            var valorRespuesta = fila_respuesta.cells[7].querySelector('input[type="number"]').value
            var nivelRiesgo = fila_respuesta.cells[8].querySelector('input[type="text"]').value
            var estado_accion = fila_respuesta.cells[9].querySelector('input[type="text"]').value
            var riesgoResidual = fila_respuesta.cells[10].querySelector('input[type="text"]').value
            var estadoRiesgo = fila_respuesta.cells[11].querySelector('input[type="text"]').value
            var id_meta_accion = fila_respuesta.cells[12].querySelector('input[type="text"]').value

            var datos_accion = new Object()
            datos_accion = {
                Estado_del_riesgo: estadoRiesgo,
                Estrategia_de_Respuesta_al_Riesgo: estrategia,
                Actividades_de_Respuesta_Planificadas: actividades,
                Responsable_del_tratamiento: responsable,
                Probabilidad_respuesta: probabilidad_respuesta,
                Impacto_respuesta: impacto_respuesta,
                Valor_riesgo_respuesta: valorRespuesta,
                Riesgo_residual: riesgoResidual,
                Nivel_respuesta: nivelRiesgo,
                Estado_accion: estado_accion,
                id_meta_accion: id_meta_accion
            }
            const url_id_proyecto = window.location.pathname;
            const id_proyecto = url_id_proyecto.split('/').slice(3)
            let url_acciones = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto + "/update-acciones"
            actualizar_datos_acciones(url_acciones, datos_accion)
        }
    }
}

function actualizar_datos_acciones(url_acciones, datos_accion) {
    fetch(url_acciones, {
        method: "POST",
        body: JSON.stringify(datos_accion),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
        })
        .catch(error => {
            console.error("Error al enviar el formulario");
            console.error(error);
        })
}

// bloque para calculos en la tabla de riesgos

let probabilidades = document.querySelectorAll(".probabilidades")
let impactos = document.querySelectorAll(".impactos")
let resultados = document.querySelectorAll('.resultado');

probabilidades.forEach(function(input, index) {
    input.addEventListener('input', function() {
        calculo_valor_riesgo(index)
        calcular_impacto_economico(index)
    })
})

impactos.forEach(function(input, index) {
    input.addEventListener('input', function() {
        calculo_valor_riesgo(index)
        calcular_impacto_economico(index)
    })
})

function calculo_valor_riesgo(index) {
    var prob = parseFloat(probabilidades[index].value)
    var impt = parseFloat(impactos[index].value)
    var result = prob* impt
    var inputResultado = resultados[index]
    inputResultado.value = result.toFixed(2)

    var resultado = result.toFixed(2) 
    actualizar_nivel_resultado(resultado, index)
}

function actualizar_nivel_resultado(resultado, index) {
    let nivel_riesgo = document.getElementsByClassName("nivel_riesgo")
    
    let nivel_resultado = nivel_riesgo[index]
    let valor_resultado = resultado
    if (valor_resultado > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
            //verde
            nivel_resultado.value = "Alto"
            nivel_resultado.style.backgroundColor = "#60F032";
            nivel_resultado.style.color = "black"
        } else {
            if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                // amarillo
                nivel_resultado.value = "Medio"
                nivel_resultado.style.backgroundColor = "#F0B732";
                nivel_resultado.style.color = "black"
            } else {
                //rojo
                nivel_resultado.value = "Bajo"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_resultado < 0) {
            if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {

                //rojo
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //verde
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#60F032";
                    nivel_resultado.style.color = "black"

                }
            }
        }
    }


}

function calcular_nivel_resultado() {
    let nivel_riesgo = document.getElementsByClassName("nivel_riesgo")
    for (let i = 0; i < resultados.length; i++) {
        let valor_resultado = resultados[i].value
        let nivel_resultado = nivel_riesgo[i]
        if (valor_resultado > 0) {
            // OPORTUNIDADES --> riesgos positivos
            if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
                //verde
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#60F032";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //rojo
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                }
            }
        } else {
            // AMENAZAS --> riesgos negativos
            if (valor_resultado < 0) {
                if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {
    
                    //rojo
                    nivel_resultado.value = "Alto"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                } else {
                    if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                        // amarillo
                        nivel_resultado.value = "Medio"
                        nivel_resultado.style.backgroundColor = "#F0B732";
                        nivel_resultado.style.color = "black"
                    } else {
                        //verde
                        nivel_resultado.value = "Bajo"
                        nivel_resultado.style.backgroundColor = "#60F032";
                        nivel_resultado.style.color = "black"
    
                    }
                }
            }
        }
    }

}

// bloque para calculos en la tabla de respuestas
let probabilidades_respuesta = document.querySelectorAll(".probabilidades_respuesta")
let impactos_respuesta = document.querySelectorAll(".impactos_respuesta")
let resultados_respuesta = document.querySelectorAll('.valor_riesgo_respuesta');

probabilidades_respuesta.forEach(function(input, index) {
    input.addEventListener('input', function() {
        calculo_valor_riesgo_respuesta(index)
    })
})

impactos_respuesta.forEach(function(input, index) {
    input.addEventListener('input', function() {
        calculo_valor_riesgo_respuesta(index)
    })
})

function calculo_valor_riesgo_respuesta(index) {
    var prob = parseFloat(probabilidades_respuesta[index].value)
    var impt = parseFloat(impactos_respuesta[index].value)
    var result = prob* impt
    var inputResultado = resultados_respuesta[index]
    inputResultado.value = result.toFixed(2);

    var resultado =result.toFixed(2)
    actualizar_nivel_resultado_respuesta(resultado, index)
}

function actualizar_nivel_resultado_respuesta(resultado, index) {
    let nivel_riesgo = document.getElementsByClassName("nivel_respuesta")
    
    let nivel_resultado = nivel_riesgo[index]
    let valor_resultado = resultado
    if (valor_resultado > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
            //verde
            nivel_resultado.value = "Alto"
            nivel_resultado.style.backgroundColor = "#60F032";
            nivel_resultado.style.color = "black"
        } else {
            if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                // amarillo
                nivel_resultado.value = "Medio"
                nivel_resultado.style.backgroundColor = "#F0B732";
                nivel_resultado.style.color = "black"
            } else {
                //rojo
                nivel_resultado.value = "Bajo"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_resultado < 0) {
            if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {

                //rojo
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //verde
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#60F032";
                    nivel_resultado.style.color = "black"

                }
            }
        }
    }


}

function calcular_nivel_resultado_respuesta() {
    let nivel_riesgo = document.getElementsByClassName("nivel_respuesta")
    for (let i = 0; i < resultados_respuesta.length; i++) {
        let valor_resultado = resultados_respuesta[i].value
        let nivel_resultado = nivel_riesgo[i]
        if (valor_resultado > 0) {
            // OPORTUNIDADES --> riesgos positivos
            if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
                //verde
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#60F032";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //rojo
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                }
            }
        } else {
            // AMENAZAS --> riesgos negativos
            if (valor_resultado < 0) {
                if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {
    
                    //rojo
                    nivel_resultado.value = "Alto"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                } else {
                    if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                        // amarillo
                        nivel_resultado.value = "Medio"
                        nivel_resultado.style.backgroundColor = "#F0B732";
                        nivel_resultado.style.color = "black"
                    } else {
                        //verde
                        nivel_resultado.value = "Bajo"
                        nivel_resultado.style.backgroundColor = "#60F032";
                        nivel_resultado.style.color = "black"
    
                    }
                }
            }
        }
    }

}

function filtrar_codigo() {
    var tabla_riesgos = document.getElementById('tabla_riesgos');
    var code_buscar = document.getElementById('code_buscar').value.toLowerCase();
    
    for (var i = 1; i < tabla_riesgos.rows.length; i++) {
        var cellsOfRow = tabla_riesgos.rows[i].getElementsByTagName('td');
        var found = false;

        var compareWith = cellsOfRow[0].innerHTML.toLowerCase();
        if (code_buscar.length == 0 || (compareWith.indexOf(code_buscar) > -1)) {
            found = true;
        }

        if (found) {
            tabla_riesgos.rows[i].style.display = '';
        } else {
            tabla_riesgos.rows[i].style.display = 'none';
        }
    }

    var tabla_accion = document.getElementById('tabla_respuestas_riesgos');
    for (var i = 1; i < tabla_accion.rows.length; i++) {
        var cellsOfRow = tabla_accion.rows[i].getElementsByTagName('td');
        var found = false;

        var compareWith = cellsOfRow[1].innerHTML;
        if (code_buscar.length == 0 || (compareWith.indexOf(code_buscar) > -1)) {
            found = true;
        }

        if (found) {
            tabla_accion.rows[i].style.display = '';
        } else {
            tabla_accion.rows[i].style.display = 'none';
        }
    }
}

function calcular_impacto_economico(){
    const presupuesto_total = document.getElementById("presupuesto_proyecto")
    let impactos_economicos = document.getElementsByClassName('impactos_economicos');
    let ie_total = document.getElementById("ie_total")
    ie_total.value = 0
    let total = 0.00
    for (let i = 0; i < impactos_economicos.length; i++) {
        var pproyecto = parseFloat(presupuesto_total.value)
        var prob = parseFloat(probabilidades[i].value)
        var impt = parseFloat(impactos[i].value)
        var resultado_ie = prob * impt * pproyecto
        var inputResultado = impactos_economicos[i]
        inputResultado.value = resultado_ie.toFixed(2)
        let resultado_decimales= resultado_ie
        total = total + resultado_decimales
        ie_total.value = total.toFixed(2)
    }
}

let modalBtns = [...document.querySelectorAll(".button")];
modalBtns.forEach(function (btn) {
    btn.onclick = function () {
        let modal = btn.getAttribute("data-modal");
        document.getElementById(modal).style.display = "block";
    };
});
let closeBtns = [...document.querySelectorAll(".close")];
closeBtns.forEach(function (btn) {
    btn.onclick = function () {
        let modal = btn.closest(".modal");
        modal.style.display = "none";
    };
});
window.onclick = function (event) {
    if (event.target.className === "modal") {
        cancelar_riesgo()
        cancelar_accion()
    }
};

// PARtE DEL JS ENCARGADA DEL FORMULARIO DE NUEVO RIESGO + ACCION

function subcategorias_riesgo() {
    // Objeto de subcategorias
    var subcategorias = {
        "De Carácter Técnico": ["Definición de requisitos", "Disponibilidad de la Información", "Uso de la tecnologías nuevas o no aprobadas", "Naturaleza/complejidad de diseño", "Disponibilidad de experiencia Técnica", "Productividad/Eficiencia del Equipo", "Calidad de los Trabajos"],
        "Del Entorno": ["Participación de Subcontratas/Consultoras", "Uso de Normativa Específica", "Condicionantes del mercado", "Relación con el Cliente (clima/expectativas)", "Relación con otros Interesados Externos"],
        "De la Organización": ["Naturaleza de la Organización", "Naturaleza del Proyecto en la Organización", "Condiciones Econ.-Financ. del Proy./Organización"],
        "De la Gestión del Proyecto": ["Ambigüedad del Contrato", "Penalizaciones Contractuales", "Definición de Supuestos", "Definición de la Planificación", "Definición de las Estimaciones de Coste", "Realización del Control/Seguimiento del Proyecto", "Gestión de las Comunicaciones", "Disponibilidad de Recursos", "Ubicación del Equipo de Trabajo"],
        "De Seguridad de Información": ["Desastres Naturales", "Origen Industrial", "Errores y Fallos Intencionados", "Ataques Intencionados"]
    }
    
    var categoria = document.getElementById('categoria_riesgo_nuevo')
    var subcategoria = document.getElementById('subcategoria_riesgo_nuevo')
    var categoriaSeleccionada = categoria.value
    
    // Se limpian las subcategorias
    subcategoria.innerHTML = '<option value="">Seleccione una Subcategoría...</option>'
    
    if(categoriaSeleccionada !== ''){
      // Se seleccionan las subcategorias y se ordenan
      categoriaSeleccionada = subcategorias[categoriaSeleccionada]
      categoriaSeleccionada.sort()
    
      // Insertamos las subctegorias
      categoriaSeleccionada.forEach(function(categoria){
        let opcion = document.createElement('option')
        opcion.value = categoria
        opcion.text = categoria
        subcategoria.add(opcion)
      });
    }
    
}
var probabilidad = document.getElementById("probabilidad_riesgo_nuevo")
var impacto = document.getElementById("impacto_riesgo_nuevo")
var resultado = document.getElementById("valor_riesgo_nuevo")

probabilidad.addEventListener('input', calcRiesgoNuevo);
impacto.addEventListener('input', calcRiesgoNuevo);

var probabilidad_respuesta_riesgo_nuevo = document.getElementById("probabilidad_respuesta_riesgo_nuevo1")
var impacto_respuesta_riesgo_nuevo = document.getElementById("impacto_respuesta_riesgo_nuevo1")
var valor_respuesta_riesgo_nuevo = document.getElementById("valor_respuesta_riesgo_nuevo1")

probabilidad_respuesta_riesgo_nuevo.addEventListener('input', calcRiesgoNuevo);
impacto_respuesta_riesgo_nuevo.addEventListener('input', calcRiesgoNuevo);

// NUEVO RIESGO + ACCION
// FUNCION QUE PINTA LA CELDA DE NIVEL, PONE EL TEXTO DEPENDIENDO DEL VALOR DEL RIESGO Y QUE PONE LOS INPUTS DE LA ACCION EN REQUIRED/NOT REQUIRED 

function calcRiesgoNuevo() {
    var prob = probabilidad.value
    var impt = impacto.value

    if (!isNaN(prob) && !isNaN(impt)) {
        var result = prob * impt;
        resultado.value = result.toFixed(2)
    }else{
        resultado.value = '';
    }

    let nivel_riesgo_nuevo = document.getElementById("nivel_riesgo_nuevo")

    if (resultado.value > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (resultado.value >= 0.18 && resultado.value <= 0.72) {
            //verde
            nivel_riesgo_nuevo.value = 'Alto'
            nivel_riesgo_nuevo.style.backgroundColor = "#60F032";
            nivel_riesgo_nuevo.style.color = "black"
            let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
            aclaracion.style.display = 'none'
            document.getElementById("estrategia_riesgo_nuevo1").required = '';
            document.getElementById("actividades_riesgo_nuevo1").required = '';
            document.getElementById("responsable_riesgo_nuevo1").required = '';
            document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = '';
            document.getElementById("impacto_respuesta_riesgo_nuevo1").required = '';
            document.getElementById("valor_respuesta_riesgo_nuevo1").required = '';
            document.getElementById("residual_riesgo_nuevo1").required = '';
            document.getElementById("estado_riesgo_nuevo1").required = '';
            document.getElementById("estado_accion_nuevo1").required = '';

            let estrategia_titulo = document.getElementById("estrategia_titulo")
            estrategia_titulo.innerHTML = 'Estrategia de respuesta'
            let actividades_titulo = document.getElementById("actividades_titulo")
            actividades_titulo.innerHTML = 'Actividades de respuesta'
            let responsable_titulo = document.getElementById("responsable_titulo")
            responsable_titulo.innerHTML = 'Responsable del tratamiento'
            let estado_accion_titulo = document.getElementById("estado_accion_titulo")
            estado_accion_titulo.innerHTML = 'Estado Acción'
            let probabilidad_titulo = document.getElementById("probabilidad_titulo")
            probabilidad_titulo.innerHTML = 'Probabilidad respuesta'
            let impacto_titulo = document.getElementById("impacto_titulo")
            impacto_titulo.innerHTML = 'Impacto respuesta'
            let valor_titulo = document.getElementById("valor_titulo")
            valor_titulo.innerHTML = 'Valor del riesgo de la respuesta'
            let nivel_titulo = document.getElementById("nivel_titulo")
            nivel_titulo.innerHTML = 'Nivel de acción'
            let residual_titulo = document.getElementById("residual_titulo")
            residual_titulo.innerHTML = 'Riesgo residual'
            let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
            estado_riesgo_titulo.innerHTML = 'Estado del riesgo'
        } else {
            if (resultado.value >= 0.06 && resultado.value <= 0.14) {
                // amarillo
                nivel_riesgo_nuevo.value = "Medio"
                nivel_riesgo_nuevo.style.backgroundColor = "#F0B732";
                nivel_riesgo_nuevo.style.color = "black"
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'none'
                document.getElementById("estrategia_riesgo_nuevo1").required = '';
                document.getElementById("actividades_riesgo_nuevo1").required = '';
                document.getElementById("responsable_riesgo_nuevo1").required = '';
                document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("impacto_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("valor_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("residual_riesgo_nuevo1").required = '';
                document.getElementById("estado_riesgo_nuevo1").required = '';
                document.getElementById("estado_accion_nuevo1").required = '';

                let estrategia_titulo = document.getElementById("estrategia_titulo")
                estrategia_titulo.innerHTML = 'Estrategia de respuesta'
                let actividades_titulo = document.getElementById("actividades_titulo")
                actividades_titulo.innerHTML = 'Actividades de respuesta'
                let responsable_titulo = document.getElementById("responsable_titulo")
                responsable_titulo.innerHTML = 'Responsable del tratamiento'
                let estado_accion_titulo = document.getElementById("estado_accion_titulo")
                estado_accion_titulo.innerHTML = 'Estado Acción'
                let probabilidad_titulo = document.getElementById("probabilidad_titulo")
                probabilidad_titulo.innerHTML = 'Probabilidad respuesta'
                let impacto_titulo = document.getElementById("impacto_titulo")
                impacto_titulo.innerHTML = 'Impacto respuesta'
                let valor_titulo = document.getElementById("valor_titulo")
                valor_titulo.innerHTML = 'Valor del riesgo de la respuesta'
                let nivel_titulo = document.getElementById("nivel_titulo")
                nivel_titulo.innerHTML = 'Nivel de acción'
                let residual_titulo = document.getElementById("residual_titulo")
                residual_titulo.innerHTML = 'Riesgo residual'
                let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
                estado_riesgo_titulo.innerHTML = 'Estado del riesgo'
            } else {
                //rojo
                nivel_riesgo_nuevo.value = "Bajo"
                nivel_riesgo_nuevo.style.backgroundColor = "#DF1904";
                nivel_riesgo_nuevo.style.color = "black"
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'none'
                document.getElementById("estrategia_riesgo_nuevo1").required = '';
                document.getElementById("actividades_riesgo_nuevo1").required = '';
                document.getElementById("responsable_riesgo_nuevo1").required = '';
                document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("impacto_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("valor_respuesta_riesgo_nuevo1").required = '';
                document.getElementById("residual_riesgo_nuevo1").required = '';
                document.getElementById("estado_riesgo_nuevo1").required = '';
                document.getElementById("estado_accion_nuevo1").required = '';

                let estrategia_titulo = document.getElementById("estrategia_titulo")
                estrategia_titulo.innerHTML = 'Estrategia de respuesta'
                let actividades_titulo = document.getElementById("actividades_titulo")
                actividades_titulo.innerHTML = 'Actividades de respuesta'
                let responsable_titulo = document.getElementById("responsable_titulo")
                responsable_titulo.innerHTML = 'Responsable del tratamiento'
                let estado_accion_titulo = document.getElementById("estado_accion_titulo")
                estado_accion_titulo.innerHTML = 'Estado Acción'
                let probabilidad_titulo = document.getElementById("probabilidad_titulo")
                probabilidad_titulo.innerHTML = 'Probabilidad respuesta'
                let impacto_titulo = document.getElementById("impacto_titulo")
                impacto_titulo.innerHTML = 'Impacto respuesta'
                let valor_titulo = document.getElementById("valor_titulo")
                valor_titulo.innerHTML = 'Valor del riesgo de la respuesta'
                let nivel_titulo = document.getElementById("nivel_titulo")
                nivel_titulo.innerHTML = 'Nivel de acción'
                let residual_titulo = document.getElementById("residual_titulo")
                residual_titulo.innerHTML = 'Riesgo residual'
                let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
                estado_riesgo_titulo.innerHTML = 'Estado del riesgo'
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (resultado.value < 0) {
            if (resultado.value <= -0.18 && resultado.value >= -0.72) {
                //rojo
                nivel_riesgo_nuevo.value = "Alto"
                nivel_riesgo_nuevo.style.backgroundColor = "#DF1904";
                nivel_riesgo_nuevo.style.color = "black"
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'block'
                document.getElementById("estrategia_riesgo_nuevo1").required = 'true';
                document.getElementById("actividades_riesgo_nuevo1").required = 'true';
                document.getElementById("responsable_riesgo_nuevo1").required = 'true';
                document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = 'true';
                document.getElementById("impacto_respuesta_riesgo_nuevo1").required = 'true';
                document.getElementById("valor_respuesta_riesgo_nuevo1").required = 'true';
                document.getElementById("residual_riesgo_nuevo1").required = 'true';
                document.getElementById("estado_riesgo_nuevo1").required = 'true';
                document.getElementById("estado_accion_nuevo1").required = 'true';

                let estrategia_titulo = document.getElementById("estrategia_titulo")
                estrategia_titulo.innerHTML = 'Estrategia de respuesta <span class="required-input">*</span>'
                let actividades_titulo = document.getElementById("actividades_titulo")
                actividades_titulo.innerHTML = 'Actividades de respuesta <span class="required-input">*</span>'
                let responsable_titulo = document.getElementById("responsable_titulo")
                responsable_titulo.innerHTML = 'Responsable del tratamiento <span class="required-input">*</span>'
                let estado_accion_titulo = document.getElementById("estado_accion_titulo")
                estado_accion_titulo.innerHTML = 'Estado Acción <span class="required-input">*</span>'
                let probabilidad_titulo = document.getElementById("probabilidad_titulo")
                probabilidad_titulo.innerHTML = 'Probabilidad respuesta <span class="required-input">*</span>'
                let impacto_titulo = document.getElementById("impacto_titulo")
                impacto_titulo.innerHTML = 'Impacto respuesta <span class="required-input">*</span>'
                let valor_titulo = document.getElementById("valor_titulo")
                valor_titulo.innerHTML = 'Valor del riesgo de la respuesta <span class="required-input">*</span>'
                let nivel_titulo = document.getElementById("nivel_titulo")
                nivel_titulo.innerHTML = 'Nivel de acción <span class="required-input">*</span>'
                let residual_titulo = document.getElementById("residual_titulo")
                residual_titulo.innerHTML = 'Riesgo residual <span class="required-input">*</span>'
                let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
                estado_riesgo_titulo.innerHTML = 'Estado del riesgo <span class="required-input">*</span>'
            } else {
                if (resultado.value <= -0.06 && resultado.value >= -0.14) {
                    // amarillo
                    nivel_riesgo_nuevo.value = "Medio"
                    nivel_riesgo_nuevo.style.backgroundColor = "#F0B732";
                    nivel_riesgo_nuevo.style.color = "black"
                    let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                    aclaracion.style.display = 'block'
                    document.getElementById("estrategia_riesgo_nuevo1").required = 'true';
                    document.getElementById("actividades_riesgo_nuevo1").required = 'true';
                    document.getElementById("responsable_riesgo_nuevo1").required = 'true';
                    document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = 'true';
                    document.getElementById("impacto_respuesta_riesgo_nuevo1").required = 'true';
                    document.getElementById("valor_respuesta_riesgo_nuevo1").required = 'true';
                    document.getElementById("residual_riesgo_nuevo1").required = 'true';
                    document.getElementById("estado_riesgo_nuevo1").required = 'true';
                    document.getElementById("estado_accion_nuevo1").required = 'true';

                    let estrategia_titulo = document.getElementById("estrategia_titulo")
                    estrategia_titulo.innerHTML = 'Estrategia de respuesta <span class="required-input">*</span>'
                    let actividades_titulo = document.getElementById("actividades_titulo")
                    actividades_titulo.innerHTML = 'Actividades de respuesta <span class="required-input">*</span>'
                    let responsable_titulo = document.getElementById("responsable_titulo")
                    responsable_titulo.innerHTML = 'Responsable del tratamiento <span class="required-input">*</span>'
                    let estado_accion_titulo = document.getElementById("estado_accion_titulo")
                    estado_accion_titulo.innerHTML = 'Estado Acción <span class="required-input">*</span>'
                    let probabilidad_titulo = document.getElementById("probabilidad_titulo")
                    probabilidad_titulo.innerHTML = 'Probabilidad respuesta <span class="required-input">*</span>'
                    let impacto_titulo = document.getElementById("impacto_titulo")
                    impacto_titulo.innerHTML = 'Impacto respuesta <span class="required-input">*</span>'
                    let valor_titulo = document.getElementById("valor_titulo")
                    valor_titulo.innerHTML = 'Valor del riesgo de la respuesta <span class="required-input">*</span>'
                    let nivel_titulo = document.getElementById("nivel_titulo")
                    nivel_titulo.innerHTML = 'Nivel de acción <span class="required-input">*</span>'
                    let residual_titulo = document.getElementById("residual_titulo")
                    residual_titulo.innerHTML = 'Riesgo residual <span class="required-input">*</span>'
                    let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
                    estado_riesgo_titulo.innerHTML = 'Estado del riesgo <span class="required-input">*</span>'
                } else {
                    //verde
                    nivel_riesgo_nuevo.value = "Bajo"
                    nivel_riesgo_nuevo.style.backgroundColor = "#60F032";
                    nivel_riesgo_nuevo.style.color = "black"
                    let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                    aclaracion.style.display = 'none'
                    document.getElementById("estrategia_riesgo_nuevo1").required = '';
                    document.getElementById("actividades_riesgo_nuevo1").required = '';
                    document.getElementById("responsable_riesgo_nuevo1").required = '';
                    document.getElementById("probabilidad_respuesta_riesgo_nuevo1").required = '';
                    document.getElementById("impacto_respuesta_riesgo_nuevo1").required = '';
                    document.getElementById("valor_respuesta_riesgo_nuevo1").required = '';
                    document.getElementById("residual_riesgo_nuevo1").required = '';
                    document.getElementById("estado_riesgo_nuevo1").required = '';
                    document.getElementById("estado_accion_nuevo1").required = '';

                    let estrategia_titulo = document.getElementById("estrategia_titulo")
                    estrategia_titulo.innerHTML = 'Estrategia de respuesta'
                    let actividades_titulo = document.getElementById("actividades_titulo")
                    actividades_titulo.innerHTML = 'Actividades de respuesta'
                    let responsable_titulo = document.getElementById("responsable_titulo")
                    responsable_titulo.innerHTML = 'Responsable del tratamiento'
                    let estado_accion_titulo = document.getElementById("estado_accion_titulo")
                    estado_accion_titulo.innerHTML = 'Estado Acción'
                    let probabilidad_titulo = document.getElementById("probabilidad_titulo")
                    probabilidad_titulo.innerHTML = 'Probabilidad respuesta'
                    let impacto_titulo = document.getElementById("impacto_titulo")
                    impacto_titulo.innerHTML = 'Impacto respuesta'
                    let valor_titulo = document.getElementById("valor_titulo")
                    valor_titulo.innerHTML = 'Valor del riesgo de la respuesta'
                    let nivel_titulo = document.getElementById("nivel_titulo")
                    nivel_titulo.innerHTML = 'Nivel de acción'
                    let residual_titulo = document.getElementById("residual_titulo")
                    residual_titulo.innerHTML = 'Riesgo residual'
                    let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
                    estado_riesgo_titulo.innerHTML = 'Estado del riesgo'
                }
            }
        }
    }

    var prob_respuesta = probabilidad_respuesta_riesgo_nuevo.value
    var impt_respuesta = impacto_respuesta_riesgo_nuevo.value
    if (!isNaN(prob_respuesta) && !isNaN(impt_respuesta)) {
        var result = prob_respuesta * impt_respuesta;
        valor_respuesta_riesgo_nuevo.value = result.toFixed(2)
    }else{
        valor_respuesta_riesgo_nuevo.value = '';
    }
    
    var nivel_riesgo_nuevo_respuesta = document.getElementById("nivel_riesgo_nuevo_respuesta1")

    if (valor_respuesta_riesgo_nuevo.value > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_respuesta_riesgo_nuevo.value >= 0.18 && valor_respuesta_riesgo_nuevo.value <= 0.72) {
            //verde
            nivel_riesgo_nuevo_respuesta.value = "Alto"
            nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#60F032";
            nivel_riesgo_nuevo_respuesta.style.color = "black"
        } else {
            if (valor_respuesta_riesgo_nuevo.value >= 0.06 && valor_respuesta_riesgo_nuevo.value <= 0.14) {
                // amarillo
                nivel_riesgo_nuevo_respuesta.value = "Medio"
                nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#F0B732";
                nivel_riesgo_nuevo_respuesta.style.color = "black"
            } else {
                //rojo
                nivel_riesgo_nuevo_respuesta.value = "Bajo"
                nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#DF1904";
                nivel_riesgo_nuevo_respuesta.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_respuesta_riesgo_nuevo.value < 0) {
            if (valor_respuesta_riesgo_nuevo.value <= -0.18 && valor_respuesta_riesgo_nuevo.value >= -0.72) {

                //rojo
                nivel_riesgo_nuevo_respuesta.value = "Alto"
                nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#DF1904";
                nivel_riesgo_nuevo_respuesta.style.color = "black"
            } else {
                if (valor_respuesta_riesgo_nuevo.value <= -0.06 && valor_respuesta_riesgo_nuevo.value >= -0.14) {
                    // amarillo
                    nivel_riesgo_nuevo_respuesta.value = "Medio"
                    nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#F0B732";
                    nivel_riesgo_nuevo_respuesta.style.color = "black"
                } else {
                    //verde
                    nivel_riesgo_nuevo_respuesta.value = "Bajo"
                    nivel_riesgo_nuevo_respuesta.style.backgroundColor = "#60F032";
                    nivel_riesgo_nuevo_respuesta.style.color = "black"

                }
            }
        }
    }
}

// NUEVA ACCION
// FUNCION QUE PINTA LA CELDA DE NIVEL, PONE EL TEXTO DEPENDIENDO DEL VALOR DEL RIESGO Y QUE PONE LOS INPUTS DE LA ACCION EN REQUIRED/NOT REQUIRED 

var probabilidad_nueva_accion = document.getElementById("probabilidad_nueva_acccion")
var impacto_nueva_accion = document.getElementById("impacto_nueva_accion")
var valor_nueva_accion = document.getElementById("valor_nueva_accion")

probabilidad_nueva_accion.addEventListener('input', calcAccionNueva);
impacto_nueva_accion.addEventListener('input', calcAccionNueva);

function calcAccionNueva() {
    var prob = probabilidad_nueva_accion.value
    var impt = impacto_nueva_accion.value

    if (!isNaN(prob) && !isNaN(impt)) {
        var result = prob * impt;
        valor_nueva_accion.value = result.toFixed(2)
    }else{
        valor_nueva_accion.value = '';
    }

    let nivel_nueva_accion = document.getElementById("nivel_nueva_accion")

    if (valor_nueva_accion.value > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_nueva_accion.value >= 0.18 && valor_nueva_accion.value <= 0.72) {
            //verde
            nivel_nueva_accion.value = 'Alto'
            nivel_nueva_accion.style.backgroundColor = "#60F032";
            nivel_nueva_accion.style.color = "black"
        } else {
            if (valor_nueva_accion.value >= 0.06 && valor_nueva_accion.value <= 0.14) {
                // amarillo
                nivel_nueva_accion.value = "Medio"
                nivel_nueva_accion.style.backgroundColor = "#F0B732";
                nivel_nueva_accion.style.color = "black"
            } else {
                //rojo
                nivel_nueva_accion.value = "Bajo"
                nivel_nueva_accion.style.backgroundColor = "#DF1904";
                nivel_nueva_accion.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_nueva_accion.value < 0) {
            if (valor_nueva_accion.value <= -0.18 && valor_nueva_accion.value >= -0.72) {
                //rojo
                nivel_nueva_accion.value = "Alto"
                nivel_nueva_accion.style.backgroundColor = "#DF1904";
                nivel_nueva_accion.style.color = "black"
            } else {
                if (valor_nueva_accion.value <= -0.06 && valor_nueva_accion.value >= -0.14) {
                    // amarillo
                    nivel_nueva_accion.value = "Medio"
                    nivel_nueva_accion.style.backgroundColor = "#F0B732";
                    nivel_nueva_accion.style.color = "black"
                } else {
                    //verde
                    nivel_nueva_accion.value = "Bajo"
                    nivel_nueva_accion.style.backgroundColor = "#60F032";
                    nivel_nueva_accion.style.color = "black"
                }
            }
        }
    }
}

document.getElementById("nuevo_riesgo_form").addEventListener("submit", function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    obtener_valores_nuevo_riesgo()
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_valores_nuevo_riesgo() {
    let fecha_deteccion = document.getElementById("fecha_nuevo_riesgo").value
    let tipo_riesgo_nuevo = document.getElementById("tipo_riesgo_nuevo").value
    let causa_riesgo_nuevo = document.getElementById("causa_riesgo_nuevo").value

    let categoria_riesgo_nuevo = document.getElementById("categoria_riesgo_nuevo").value
    let subcategoria_riesgo_nuevo = document.getElementById("subcategoria_riesgo_nuevo").value

    let probabilidad_riesgo_nuevo = document.getElementById("probabilidad_riesgo_nuevo").value
    let efecto_riesgo_nuevo = document.getElementById("efecto_riesgo_nuevo").value

    let area_afectada_nuevo = document.getElementById("area_afectada_nuevo").value
    let impacto_riesgo_nuevo = document.getElementById("impacto_riesgo_nuevo").value

    let valor_riesgo_nuevo = document.getElementById("valor_riesgo_nuevo").value
    let nivel_riesgo_nuevo = document.getElementById("nivel_riesgo_nuevo").value

    let estrategia = document.getElementById("estrategia_riesgo_nuevo1").value
    let actividades = document.getElementById("actividades_riesgo_nuevo1").value
    let responsable = document.getElementById("responsable_riesgo_nuevo1").value
    let probabiblidad = document.getElementById("probabilidad_respuesta_riesgo_nuevo1").value
    let impacto = document.getElementById("impacto_respuesta_riesgo_nuevo1").value
    let valor_respuesta = document.getElementById("valor_respuesta_riesgo_nuevo1").value
    let nivel_respuesta = document.getElementById("nivel_riesgo_nuevo_respuesta1").value
    let residual = document.getElementById("residual_riesgo_nuevo1").value
    let estado_riesgo = document.getElementById("estado_riesgo_nuevo1").value
    let estado_accion = document.getElementById("estado_accion_nuevo1").value
    
    let data = new Object()
    data={
        Fecha: fecha_deteccion,
        Tipo: tipo_riesgo_nuevo,
        Causa: causa_riesgo_nuevo,
        Categoria: categoria_riesgo_nuevo,
        Subcategoria: subcategoria_riesgo_nuevo,
        Probabilidad_riesgo_nuevo: probabilidad_riesgo_nuevo,
        Efecto: efecto_riesgo_nuevo,
        Area: area_afectada_nuevo,
        Impacto_riesgo_nuevo: impacto_riesgo_nuevo,
        Valor_riesgo_nuevo: valor_riesgo_nuevo,
        Nivel_riesgo_nuevo: nivel_riesgo_nuevo,
        Estrategia:estrategia,
        Actividades:actividades,
        Responsable:responsable,
        Probabilidad:probabiblidad,
        Impacto: impacto,
        Valor_respuesta:valor_respuesta,
        Nivel_respuesta:nivel_respuesta,
        Residual:residual,
        Estado_riesgo: estado_riesgo,
        Estado_accion:estado_accion

    }

    
    // INYECCION DE HTML EN LA TABLA
    
    const tabla = document.getElementById('tabla_riesgos').getElementsByTagName('tbody')[0];
    let filas = tabla.insertRow(tabla.rows.length)
    filas.style.textAlign = 'center'

    const celda_id_item1 = filas.insertCell(0)
    var input_celda_id = document.createElement("input")
    input_celda_id.type = "text"
    // disabled
    input_celda_id.disabled = true
    celda_id_item1.appendChild(input_celda_id)

    const celda_fecha = filas.insertCell(1)
    var input_fecha = document.createElement("input")
    input_fecha.type = "date"
    input_fecha.value = data.Fecha
    input_fecha.readOnly = true
    celda_fecha.appendChild(input_fecha)

    const celda_tipo = filas.insertCell(2)
    var input_tipo = document.createElement("input")
    input_tipo.type = "text"
    input_tipo.value = data.Tipo
    input_tipo.setAttribute("list", "tipo_riesgo");
    input_tipo.readOnly = true
    celda_tipo.appendChild(input_tipo)
//////////////////////////////////////////////////////////////////////////////
    const celda_causa = filas.insertCell(3)
    var input_causa = document.createElement("textarea")
    input_causa.rows = "3"
    input_causa.value = data.Causa
    input_causa.readOnly = true
    celda_causa.appendChild(input_causa)

    const celda_categoria = filas.insertCell(4)
    var input_categoria = document.createElement("input")
    input_categoria.type = "text"
    input_categoria.value = data.Categoria
    input_categoria.className = "categorias"
    input_categoria.setAttribute("list", "categorias");
    input_categoria.readOnly = true
    celda_categoria.appendChild(input_categoria)

    const celda_subcategoria = filas.insertCell(5)
    var input_subcategoria = document.createElement("input")
    input_subcategoria.type = "text"
    input_subcategoria.value = data.Subcategoria
    input_subcategoria.className = "subcategorias"
    input_subcategoria.readOnly = true
    celda_subcategoria.appendChild(input_subcategoria)

    const celda_probabilidad = filas.insertCell(6)
    var input_probabilidad = document.createElement("input")
    input_probabilidad.type = "number"
    input_probabilidad.value = data.Probabilidad_riesgo_nuevo
    input_probabilidad.className = "probabilidades"
    input_probabilidad.setAttribute("list", "probabilidad");
    input_probabilidad.readOnly = true
    celda_probabilidad.appendChild(input_probabilidad)
//////////////////////////////////////////////////////////////////////////////
    const celda_efecto = filas.insertCell(7)
    var input_efecto = document.createElement("textarea")
    input_efecto.rows = "3"
    input_efecto.value = data.Efecto
    input_efecto.readOnly = true
    celda_efecto.appendChild(input_efecto)

    const celda_area = filas.insertCell(8)
    var input_area = document.createElement("input")
    input_area.type = "text"
    input_area.value = data.Area
    input_area.setAttribute("list", "area_afectada");
    input_area.readOnly = true
    celda_area.appendChild(input_area)

    const celda_impacto = filas.insertCell(9)
    var input_impacto = document.createElement("input")
    input_impacto.type = "number"
    input_impacto.value = data.Impacto_riesgo_nuevo
    input_impacto.readOnly = true
    input_impacto.setAttribute("list", "impacto");
    input_impacto.className = "impactos"
    celda_impacto.appendChild(input_impacto)

    const celda_resultado = filas.insertCell(10)
    var input_resultado = document.createElement("input")
    input_resultado.type = "number"
    input_resultado.value = data.Valor_riesgo_nuevo
    input_resultado.disabled = true
    input_resultado.className = "resultado"
    celda_resultado.appendChild(input_resultado)

    const celda_nivel = filas.insertCell(11)
    var input_nivel = document.createElement("input")
    input_nivel.type = "text"
    input_nivel.value = data.Nivel_riesgo_nuevo
    input_nivel.className = "nivel_riesgo"
    input_nivel.disabled = true
    celda_nivel.appendChild(input_nivel)
    
    // INSERTAR VALORES NUEVA VERSION
    const celda_impacto_economico = filas.insertCell(12)
    var input_impacto_economico = document.createElement("input")
    input_impacto_economico.type = "number"
    input_impacto_economico.readOnly = true
    input_impacto_economico.className = "impactos_economicos"
    celda_impacto_economico.appendChild(input_impacto_economico)

    // BOTONES INYECTADOS
    const celda_editar = filas.insertCell(13)
    const celda_actualizar = filas.insertCell(14)
    const celda_borrar = filas.insertCell(15)

    const botonEditar = document.createElement('button');
    botonEditar.innerHTML = 'Editar Riesgo';
    
    const botonActualizar = document.createElement('button');
    botonActualizar.innerHTML = 'Actualizar Riesgo';
 
    const botonBorrar = document.createElement('button');
    botonBorrar.innerHTML = 'Borrar Riesgo';
    
    celda_editar.appendChild(botonEditar)
    celda_actualizar.appendChild(botonActualizar)
    celda_borrar.appendChild(botonBorrar)

    const tabla_acciones = document.getElementById('tabla_respuestas_riesgos').getElementsByTagName('tbody')[0];
    let rows = tabla_acciones.insertRow(tabla_acciones.rows.length)

    // DESDE NOTION
    const celda_id_item_2 = rows.insertCell(0)
    var input_celda_id_accion = document.createElement("input")
    input_celda_id_accion.type = "text"
    // disabled
    input_celda_id_accion.disabled = true
    celda_id_item_2.appendChild(input_celda_id_accion)

    const celda_riesgo_asociado = rows.insertCell(1)
    var input_riesgo_asociado = document.createElement("input")
    input_riesgo_asociado.type = "text"
    input_riesgo_asociado.disabled = true
    celda_riesgo_asociado.appendChild(input_riesgo_asociado)

    const celda_estrategia = rows.insertCell(2)
    var input_estrategia = document.createElement("input")
    input_estrategia.type = "text"
    input_estrategia.value = data.Estrategia
    input_estrategia.setAttribute("list", "estrategias");
    input_estrategia.readOnly = true
    celda_estrategia.appendChild(input_estrategia)

    const celda_actividades = rows.insertCell(3)
    var input_actividades = document.createElement("textarea")
    input_actividades.rows = "3"
    input_actividades.value = data.Actividades
    input_actividades.readOnly = true
    celda_actividades.appendChild(input_actividades)

    const celda_responsable = rows.insertCell(4)
    var input_responsable = document.createElement("input")
    input_responsable.type = "text"
    input_responsable.value = data.Responsable
    input_responsable.readOnly = true
    celda_responsable.appendChild(input_responsable)

    const celda_probabilidad_respuesta = rows.insertCell(5)
    var input_probabilidad = document.createElement("input")
    input_probabilidad.type = "number"
    input_probabilidad.value = data.Probabilidad
    input_probabilidad.className = "probabilidades_respuesta"
    input_probabilidad.setAttribute("list", "probabilidad");
    input_probabilidad.readOnly = true
    celda_probabilidad_respuesta.appendChild(input_probabilidad)

    const celda_impacto_respuesta = rows.insertCell(6)
    var input_impacto = document.createElement("input")
    input_impacto.type = "number"
    input_impacto.value = data.Impacto
    input_impacto.className = "impactos_respuesta"
    input_impacto.setAttribute("list", "impacto");
    input_impacto.readOnly = true
    celda_impacto_respuesta.appendChild(input_impacto)

    const celda_resultado_respuesta = rows.insertCell(7)
    var input_valor = document.createElement("input")
    input_valor.type = "number"
    input_valor.value = data.Valor_respuesta
    input_valor.className = "valor_riesgo_respuesta"
    input_valor.disabled = true
    celda_resultado_respuesta.appendChild(input_valor)

    const celda_nivel_respuesta = rows.insertCell(8)
    var input_nivel = document.createElement("input")
    input_nivel.type = "text"
    input_nivel.value = data.Nivel_respuesta
    input_nivel.disabled = true
    input_nivel.className = "nivel_respuesta"
    celda_nivel_respuesta.appendChild(input_nivel)

    const celda_estado_accion = rows.insertCell(9)
    var input_estado_accion = document.createElement("input")
    input_estado_accion.type = "text"
    input_estado_accion.value = data.Estado_accion
    input_estado_accion.setAttribute("list", "estado_accion");
    input_estado_accion.readOnly = true
    celda_estado_accion.appendChild(input_estado_accion)

    const celda_residual = rows.insertCell(10)
    var input_residual = document.createElement("input")
    input_residual.type = "text"
    input_residual.value = data.Residual
    input_residual.readOnly = true
    input_residual.autocomplete = "off"
    celda_residual.appendChild(input_residual)

    const celda_estado = rows.insertCell(11)
    var input_estado = document.createElement("input")
    input_estado.type = "text"
    input_estado.value = data.Estado_riesgo
    input_estado.setAttribute("list", "estado_riesgo");
    input_estado.readOnly = true
    input_estado.autocomplete = "off"
    celda_estado.appendChild(input_estado)

    const celda_id_meta_accion = rows.insertCell(12)
    var input_id_meta_accion = document.createElement("input")
    input_id_meta_accion.type = "text"
    input_id_meta_accion.display = "none"
    input_id_meta_accion.className ="oculto"
    celda_id_meta_accion.className = "oculto"
    celda_id_meta_accion.appendChild(input_id_meta_accion)


    
    
    const url_id_proyecto = window.location.pathname;
    const id_proyecto = url_id_proyecto.split('/').slice(3)
    let url = "/proyectos/formulario_nuevo_riesgo/"+ id_proyecto

    ///////////////////////////////////////////////////////////  BLOQUE DE CALCULOS PARA NUEVOS RIESGOS     ////////////////////////////////////////////////////////////////
    let categorias_seleccionar = document.querySelectorAll(".categorias")
    categorias_seleccionar.forEach(function(input, index) {
        input.addEventListener('input', function() {
            agregar_datalist_subcategorias(input, index)
        })
    })

    let probabilidades1 = document.querySelectorAll(".probabilidades")
    let impactos1 = document.querySelectorAll(".impactos")
    let resultados1 = document.querySelectorAll('.resultado');


    let resultados_respuesta1 = document.querySelectorAll('.valor_riesgo_respuesta');


    probabilidades1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo1(index,probabilidades1,impactos1,resultados1)
            calcular_impacto_economico1(probabilidades1,impactos1)
        })
    })

    impactos1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo1(index,probabilidades1,impactos1,resultados1)
            calcular_impacto_economico1(probabilidades1, impactos1)
        })
    })

    let probabilidades_respuesta1 = document.querySelectorAll(".probabilidades_respuesta")
    let impactos_respuesta1 = document.querySelectorAll(".impactos_respuesta")
    
    probabilidades_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1,impactos_respuesta1, resultados_respuesta1)
        })
    })

    impactos_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1, impactos_respuesta1,resultados_respuesta1)
        })
    })



    calcular_nivel_resultado1(resultados1)
    calcular_nivel_resultado_respuesta1(resultados_respuesta1)
    calcular_impacto_economico1(probabilidades1, impactos1);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    enviar_nuevo_riesgo(url, data, input_riesgo_asociado, input_celda_id, input_celda_id_accion,input_id_meta_accion, botonEditar,botonActualizar,botonBorrar)
    
}

function calcular_impacto_economico1(probabilidades1,impactos1){
    const presupuesto_total = document.getElementById("presupuesto_proyecto")
    let impactos_economicos = document.getElementsByClassName('impactos_economicos');
    let ie_total = document.getElementById("ie_total")
    ie_total.value = 0
    let total = 0.00
    for (let i = 0; i < impactos_economicos.length; i++) {
        var pproyecto = parseFloat(presupuesto_total.value)
        var prob = parseFloat(probabilidades1[i].value)
        var impt = parseFloat(impactos1[i].value)
        var resultado_ie = prob * impt * pproyecto
        var inputResultado = impactos_economicos[i]
        inputResultado.value = resultado_ie.toFixed(2)
        let resultado_decimales= resultado_ie
        total = total + resultado_decimales
        ie_total.value = total.toFixed(2)
    }
}

function calculo_valor_riesgo1(index,probabilidades1,impactos1,resultados1) {
    var prob = parseFloat(probabilidades1[index].value)
    var impt = parseFloat(impactos1[index].value)
    var result = prob* impt
    var inputResultado = resultados1[index]
    inputResultado.value = result.toFixed(2)

    var resultado = result.toFixed(2) 
    actualizar_nivel_resultado1(resultado, index)
}

function actualizar_nivel_resultado1(resultado, index) {
    let nivel_riesgo = document.getElementsByClassName("nivel_riesgo")
    
    let nivel_resultado = nivel_riesgo[index]
    let valor_resultado = resultado
    if (valor_resultado > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
            //verde
            nivel_resultado.value = "Alto"
            nivel_resultado.style.backgroundColor = "#60F032";
            nivel_resultado.style.color = "black"
        } else {
            if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                // amarillo
                nivel_resultado.value = "Medio"
                nivel_resultado.style.backgroundColor = "#F0B732";
                nivel_resultado.style.color = "black"
            } else {
                //rojo
                nivel_resultado.value = "Bajo"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_resultado < 0) {
            if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {

                //rojo
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //verde
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#60F032";
                    nivel_resultado.style.color = "black"

                }
            }
        }
    }


}

function calcular_nivel_resultado1(resultados1) {
    let nivel_riesgo = document.getElementsByClassName("nivel_riesgo")
    for (let i = 0; i < resultados1.length; i++) {
        let valor_resultado = resultados1[i].value
        let nivel_resultado = nivel_riesgo[i]
        if (valor_resultado > 0) {
            // OPORTUNIDADES --> riesgos positivos
            if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
                //verde
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#60F032";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //rojo
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                }
            }
        } else {
            // AMENAZAS --> riesgos negativos
            if (valor_resultado < 0) {
                if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {
    
                    //rojo
                    nivel_resultado.value = "Alto"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                } else {
                    if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                        // amarillo
                        nivel_resultado.value = "Medio"
                        nivel_resultado.style.backgroundColor = "#F0B732";
                        nivel_resultado.style.color = "black"
                    } else {
                        //verde
                        nivel_resultado.value = "Bajo"
                        nivel_resultado.style.backgroundColor = "#60F032";
                        nivel_resultado.style.color = "black"
    
                    }
                }
            }
        }
    }

}

function calcular_nivel_resultado_respuesta1(resultados_respuesta1) {
    let nivel_riesgo = document.getElementsByClassName("nivel_respuesta")
    for (let i = 0; i < resultados_respuesta1.length; i++) {
        let valor_resultado = resultados_respuesta1[i].value
        let nivel_resultado = nivel_riesgo[i]
        if (valor_resultado > 0) {
            // OPORTUNIDADES --> riesgos positivos
            if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
                //verde
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#60F032";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //rojo
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                }
            }
        } else {
            // AMENAZAS --> riesgos negativos
            if (valor_resultado < 0) {
                if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {
    
                    //rojo
                    nivel_resultado.value = "Alto"
                    nivel_resultado.style.backgroundColor = "#DF1904";
                    nivel_resultado.style.color = "black"
                } else {
                    if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                        // amarillo
                        nivel_resultado.value = "Medio"
                        nivel_resultado.style.backgroundColor = "#F0B732";
                        nivel_resultado.style.color = "black"
                    } else {
                        //verde
                        nivel_resultado.value = "Bajo"
                        nivel_resultado.style.backgroundColor = "#60F032";
                        nivel_resultado.style.color = "black"
    
                    }
                }
            }
        }
    }

}

function calculo_valor_riesgo_respuesta1(index, impactos_respuesta1,probabilidades_respuesta1, resultados_respuesta1) {
    var prob = parseFloat(probabilidades_respuesta1[index].value)
    var impt = parseFloat(impactos_respuesta1[index].value)
    var result = prob* impt
    var inputResultado = resultados_respuesta1[index]
    inputResultado.value = result.toFixed(2);

    var resultado =result.toFixed(2)
    actualizar_nivel_resultado_respuesta1(resultado, index)
}

function actualizar_nivel_resultado_respuesta1(resultado, index) {
    let nivel_riesgo = document.getElementsByClassName("nivel_respuesta")
    
    let nivel_resultado = nivel_riesgo[index]
    let valor_resultado = resultado
    if (valor_resultado > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valor_resultado >= 0.18 && valor_resultado <= 0.72) {
            //verde
            nivel_resultado.value = "Alto"
            nivel_resultado.style.backgroundColor = "#60F032";
            nivel_resultado.style.color = "black"
        } else {
            if (valor_resultado > 0.05 && valor_resultado <= 0.14) {
                // amarillo
                nivel_resultado.value = "Medio"
                nivel_resultado.style.backgroundColor = "#F0B732";
                nivel_resultado.style.color = "black"
            } else {
                //rojo
                nivel_resultado.value = "Bajo"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valor_resultado < 0) {
            if (valor_resultado <= -0.18 && valor_resultado >= -0.72) {

                //rojo
                nivel_resultado.value = "Alto"
                nivel_resultado.style.backgroundColor = "#DF1904";
                nivel_resultado.style.color = "black"
            } else {
                if (valor_resultado < -0.05 && valor_resultado >= -0.14) {
                    // amarillo
                    nivel_resultado.value = "Medio"
                    nivel_resultado.style.backgroundColor = "#F0B732";
                    nivel_resultado.style.color = "black"
                } else {
                    //verde
                    nivel_resultado.value = "Bajo"
                    nivel_resultado.style.backgroundColor = "#60F032";
                    nivel_resultado.style.color = "black"

                }
            }
        }
    }


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function enviar_nuevo_riesgo(url, datos, input_riesgo_asociado, input_celda_id, input_celda_id_accion,input_id_meta_accion, botonEditar, botonActualizar, botonBorrar) {
    let modal = document.getElementById("modalOne")
    modal.style.display = "none";
    fetch(url, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(cancelar_riesgo())
        .then(response => response.json())
        .then(data => {
            // alert("¡Nuevo registro guardado!") 
            let datos = Object.values(data)

            input_celda_id.value = datos[0]
            
            console.log(input_celda_id.value);
            input_riesgo_asociado.value = datos[0]
            input_celda_id_accion.value = datos[1]
            input_id_meta_accion.value = datos[3]

            // SET DE LOS ID_META DE LOS RIESGOS A LOS BOTONES CREADOS
            // document.getElementById("borrar_nuevo").setAttribute("id",datos[2])
            // document.getElementById("actualizar_nuevo").setAttribute("id",datos[2])

            botonBorrar.id = datos[2]
            botonActualizar.id = datos [2]

            // SET DE LAS FUNCIONES A LOS BOTONES
            botonEditar.onclick = editar_riesgo_creado
            botonActualizar.onclick = actualizar_riesgo_creado
            botonBorrar.onclick = borrar_riesgo_creado
            alert("Nuevo Riesgo creado")
            alert("Recargando página")
            location.reload()
        })
        .catch(error => {
            console.error("Error al enviar el registro");
            console.error(error);
        })

}

function editar_riesgo_creado(event) {
    let boton = event.target
    event.preventDefault();

    var row = boton.parentNode.parentNode;
    var inputs = row.querySelectorAll('input');

    var campoId_item = row.cells[0].querySelector('input[type="text"]')
    var id_item = campoId_item.value
    const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
    var code = id_item

    for (var i = 1; i < tabla_respuesta.rows.length; i++) {
        var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
        if (code_buscado.value === code) {
            var fila_respuesta = code_buscado.parentNode.parentNode;
            var botonText = boton.innerText;
            var inputs_respuesta = fila_respuesta.querySelectorAll('input');
            var textarea = fila_respuesta.querySelectorAll('textarea')
            
            inputs_respuesta.forEach(function (input) {
                if (botonText === 'Editar Riesgo') {
                    input.removeAttribute('readonly');
                } else {
                    input.setAttribute('readonly', 'true');
                }
            });

            textarea.forEach(function (textarea) {
                if (botonText === 'Editar Riesgo') {
                    textarea.removeAttribute('readonly');
                } else {
                    textarea.setAttribute('readonly', 'true');
                }
            });


        }
    }

    let probabilidades_respuesta1 = document.querySelectorAll(".probabilidades_respuesta")
    let impactos_respuesta1 = document.querySelectorAll(".impactos_respuesta")    
    let resultados_respuesta1 = document.querySelectorAll('.valor_riesgo_respuesta');
    console.log(resultados_respuesta1);

    probabilidades_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1,impactos_respuesta1, resultados_respuesta1)
        })
    })
    
    impactos_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1, impactos_respuesta1,resultados_respuesta1)
        })
    })

    var botonText = boton.innerText;
    var textarea = row.querySelectorAll('textarea')
    // var select = row.querySelectorAll('select')

    inputs.forEach(function (input) {
        if (botonText === 'Editar Riesgo') {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('readonly', 'true');
        }
    });

    textarea.forEach(function (textarea) {
        if (botonText === 'Editar Riesgo') {
            textarea.removeAttribute('readonly');
        } else {
            textarea.setAttribute('readonly', 'true');
        }
    });
    // Alternar el texto del botón entre "Editar" y "Guardar"
    
    boton.innerText = (botonText === 'Editar Riesgo') ? 'Guardar Riesgo' : 'Editar Riesgo';

   // calculo_valor_riesgo_respuesta1(index, probabilidades_respuesta1, impactos_respuesta1,resultados_respuesta1)
}

function actualizar_riesgo_creado(event) {
    let boton = event.target
    event.preventDefault();

    let id_meta = boton.id
    var fila = boton.parentNode.parentNode;
    var fecha = fila.cells[1].querySelector('input[type="date"]').value
    var tipo = fila.cells[2].querySelector('input[type="text"]').value
    var causa = fila.cells[3].querySelector('textarea').value
    var categoria = fila.cells[4].querySelector('input[type="text"]').value
    var subcategoria = fila.cells[5].querySelector('input[type="text"]').value
    var probabilidad = fila.cells[6].querySelector('input[type="number"]').value
    var efecto = fila.cells[7].querySelector('textarea').value
    var area = fila.cells[8].querySelector('input[type="text"]').value
    var impacto = fila.cells[9].querySelector('input[type="number"]').value
    var resultado = fila.cells[10].querySelector('input[type="number"]').value
    var nivel = fila.cells[11].querySelector('input[type="text"]').value
    var ie =  fila.cells[12].querySelector('input[type="number"]').value

    var datos_riesgo = new Object()
    datos_riesgo = {
        Id_meta: id_meta,
        Fecha_deteccion: fecha,
        Tipo_riesgo: tipo,
        Causa: causa,
        Categoria: categoria,
        Subcategoria: subcategoria,
        Probabilidad: probabilidad,
        Efecto: efecto,
        Area_afectada: area,
        Impacto: impacto,
        Valor_riesgo: resultado,
        Nivel_riesgo: nivel,
        Impacto_Economico: ie,
    }

    const url_id_proyecto1 = window.location.pathname;
    const id_proyecto1 = url_id_proyecto1.split('/').slice(3)
    let url = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto1 + "/update"

    // primero pasa por el gms y luego se sube a notion
    var confirmacion = window.confirm("¿Estás seguro de actualizar los valores?")
    if (confirmacion === true) {
        // llama a fetch para actualizar el registro
        actualizar_datos_riesgos(url, datos_riesgo)
    } else {
        alert("Riesgo no actualizado")
    }

    // ---------------PARTE DE LAS ACCIONES--------------------
    const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
    var id_item = fila.cells[0].querySelector('input[type="text"]').value
    var code = id_item


    for (var i = 1; i < tabla_respuesta.rows.length; i++) {
        var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
        if (code_buscado.value === code) {
            var fila_respuesta = code_buscado.parentNode.parentNode;

            var estrategia = fila_respuesta.cells[2].querySelector('input[type="text"]').value
            var actividades = fila_respuesta.cells[3].querySelector('textarea').value
            var responsable = fila_respuesta.cells[4].querySelector('input[type="text"]').value
            var probabilidad_respuesta = fila_respuesta.cells[5].querySelector('input[type="number"]').value
            var impacto_respuesta = fila_respuesta.cells[6].querySelector('input[type="number"]').value
            var valorRespuesta = fila_respuesta.cells[7].querySelector('input[type="number"]').value
            var nivelRiesgo = fila_respuesta.cells[8].querySelector('input[type="text"]').value
            var estado_accion = fila_respuesta.cells[9].querySelector('input[type="text"]').value
            var riesgoResidual = fila_respuesta.cells[10].querySelector('input[type="text"]').value
            var estadoRiesgo = fila_respuesta.cells[11].querySelector('input[type="text"]').value
            var id_meta_accion = fila_respuesta.cells[12].querySelector('input[type="text"]').value

            var datos_accion = new Object()
            datos_accion = {
                Estado_del_riesgo: estadoRiesgo,
                Estrategia_de_Respuesta_al_Riesgo: estrategia,
                Actividades_de_Respuesta_Planificadas: actividades,
                Responsable_del_tratamiento: responsable,
                Probabilidad_respuesta: probabilidad_respuesta,
                Impacto_respuesta: impacto_respuesta,
                Valor_riesgo_respuesta: valorRespuesta,
                Riesgo_residual: riesgoResidual,
                Nivel_respuesta: nivelRiesgo,
                Estado_accion: estado_accion,
                id_meta_accion: id_meta_accion
            }

            const url_id_proyecto = window.location.pathname;
            const id_proyecto = url_id_proyecto.split('/').slice(3)
            let url_acciones = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto + "/update-acciones"
            actualizar_datos_acciones(url_acciones, datos_accion)
        }
    }
}
function borrar_riesgo_creado(event) {
    let boton = event.target
    event.preventDefault();

    let id_meta = boton.id;
    let datos = (id_meta)
    const url_id_proyecto = window.location.pathname;
    const id_proyecto = url_id_proyecto.split('/').slice(3)

    let url = "http://127.0.0.1:5010/proyectos/gestion_riesgos/" + id_proyecto + "/delete"

    var confirmacion = window.confirm("¿Estás seguro de borrar el riesgo?")
    if (confirmacion === true) {
        var confirmacion2 = window.confirm("Se eliminarán las acciones asociadas a este riesgo. ¿Está seguro de eliminarlo?")
        if (confirmacion2===true) {
            var fila = boton.parentNode.parentNode;
            var campoId_item = fila.cells[0].querySelector('input[type="text"]')
            var campo_impt = fila.cells[9].querySelector('input[type="number"]')
            campo_impt.value = 0
            var id_item = campoId_item.value
            const tabla_respuesta = document.getElementById("tabla_respuestas_riesgos")
            var code = id_item
            // Ocultar la fila
            fila.classList.add('ocultar-fila');
            
            for (var i = 1; i < tabla_respuesta.rows.length; i++) {
                var code_buscado = tabla_respuesta.rows[i].cells[1].querySelector('input[type="text"]')
                if (code_buscado.value === code) {
                    var fila_tabla_respuesta = code_buscado.parentNode.parentNode
                    fila_tabla_respuesta.classList.add('ocultar-fila')
                }
            }
           
            // llama al fetch para eliminar el registro
            eliminarRegistroRiesgo(url, datos)  
            // var div_mensaje_borrar = document.getElementById("texto-borrar")
            // div_mensaje_borrar.style.display = "block"
        }
    } else {
        alert("Riesgo no borrado")
    }

    
}

document.getElementById("nueva_accion_form").addEventListener("submit", function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    obtener_valores_nueva_accion()
})

function obtener_valores_nueva_accion() {
    let riesgo = document.getElementById("riesgo_asociado").value
    let estrategia = document.getElementById("estrategia_riesgo_nuevo").value
    let actividades = document.getElementById("actividades_riesgo_nuevo").value
    let responsable = document.getElementById("responsable_riesgo_nuevo").value
    let probabiblidad = document.getElementById("probabilidad_nueva_acccion").value
    let impacto = document.getElementById("impacto_nueva_accion").value
    let valor_respuesta = document.getElementById("valor_nueva_accion").value
    let nivel_respuesta = document.getElementById("nivel_nueva_accion").value
    let residual = document.getElementById("residual_riesgo_nuevo").value
    let estado_riesgo = document.getElementById("estado_riesgo_nuevo").value
    let estado_accion = document.getElementById("estado_accion_nuevo").value
    
    let data = new Object()
    data={
        Riesgo:riesgo,
        Estrategia:estrategia,
        Actividades:actividades,
        Responsable:responsable,
        Probabilidad:probabiblidad,
        Impacto: impacto,
        Valor_respuesta:valor_respuesta,
        Nivel_respuesta:nivel_respuesta,
        Residual:residual,
        Estado_riesgo: estado_riesgo,
        Estado_accion:estado_accion
    }
    
    // INYECCION DE HTML EN LA TABLA
    
    const tabla_acciones = document.getElementById('tabla_respuestas_riesgos').getElementsByTagName('tbody')[0];
    let rows = tabla_acciones.insertRow(tabla_acciones.rows.length)

    // DESDE NOTION
    const celda_id_item_2 = rows.insertCell(0)
    var input_celda_id_accion = document.createElement("input")
    input_celda_id_accion.type = "text"
    // disabled
    input_celda_id_accion.disabled = true
    celda_id_item_2.appendChild(input_celda_id_accion)

    // DESDE NOTION
    const celda_riesgo_asociado = rows.insertCell(1)
    var input_riesgo_asociado = document.createElement("input")
    input_riesgo_asociado.type = "text"
    input_riesgo_asociado.disabled = true
    celda_riesgo_asociado.appendChild(input_riesgo_asociado)

    const celda_estrategia = rows.insertCell(2)
    var input_estrategia = document.createElement("input")
    input_estrategia.type = "text"
    input_estrategia.value = data.Estrategia
    input_estrategia.setAttribute("list", "estrategias");
    input_estrategia.readOnly = true
    celda_estrategia.appendChild(input_estrategia)

    const celda_actividades = rows.insertCell(3)
    var input_actividades = document.createElement("textarea")
    input_actividades.rows = "3"
    input_actividades.value = data.Actividades
    input_actividades.readOnly = true
    celda_actividades.appendChild(input_actividades)

    const celda_responsable = rows.insertCell(4)
    var input_responsable = document.createElement("input")
    input_responsable.type = "text"
    input_responsable.value = data.Responsable
    input_responsable.readOnly = true
    celda_responsable.appendChild(input_responsable)

    const celda_probabilidad_respuesta = rows.insertCell(5)
    var input_probabilidad = document.createElement("input")
    input_probabilidad.type = "number"
    input_probabilidad.value = data.Probabilidad
    input_probabilidad.className = "probabilidades_respuesta"
    input_probabilidad.setAttribute("list", "probabilidad");
    input_probabilidad.readOnly = true
    celda_probabilidad_respuesta.appendChild(input_probabilidad)

    const celda_impacto_respuesta = rows.insertCell(6)
    var input_impacto = document.createElement("input")
    input_impacto.type = "number"
    input_impacto.value = data.Impacto
    input_impacto.className = "impactos_respuesta"
    input_impacto.setAttribute("list", "impacto");
    input_impacto.readOnly = true
    celda_impacto_respuesta.appendChild(input_impacto)

    const celda_resultado_respuesta = rows.insertCell(7)
    var input_valor = document.createElement("input")
    input_valor.type = "number"
    input_valor.value = data.Valor_respuesta
    input_valor.className = "valor_riesgo_respuesta"
    input_valor.disabled = true
    celda_resultado_respuesta.appendChild(input_valor)

    const celda_nivel_respuesta = rows.insertCell(8)
    var input_nivel = document.createElement("input")
    input_nivel.type = "text"
    input_nivel.value = data.Nivel_respuesta
    input_nivel.className = "nivel_respuesta"
    input_nivel.disabled = true
    celda_nivel_respuesta.appendChild(input_nivel)

    const celda_estado_accion = rows.insertCell(9)
    var input_estado_accion = document.createElement("input")
    input_estado_accion.type = "text"
    input_estado_accion.value = data.Estado_accion
    input_estado_accion.setAttribute("list", "estado_accion");
    input_estado_accion.readOnly = true
    celda_estado_accion.appendChild(input_estado_accion)

    const celda_residual = rows.insertCell(10)
    var input_residual = document.createElement("input")
    input_residual.type = "text"
    input_residual.value = data.Residual
    input_residual.readOnly = true
    celda_residual.appendChild(input_residual)

    const celda_estado = rows.insertCell(11)
    var input_estado = document.createElement("input")
    input_estado.type = "text"
    input_estado.value = data.Estado_riesgo
    input_estado.setAttribute("list", "estado_riesgo");
    input_estado.readOnly = true
    celda_estado.appendChild(input_estado)

    const celda_id_meta_accion = rows.insertCell(12)
    var input_id_meta_accion = document.createElement("input")
    input_id_meta_accion.type = "text"
    input_id_meta_accion.display = "none"
    input_id_meta_accion.className ="oculto"
    celda_id_meta_accion.className = "oculto"
    celda_id_meta_accion.appendChild(input_id_meta_accion)

    let resultados_respuesta1 = document.querySelectorAll('.valor_riesgo_respuesta');
    console.log(resultados_respuesta1);
    let probabilidades_respuesta1 = document.querySelectorAll(".probabilidades_respuesta")
    let impactos_respuesta1 = document.querySelectorAll(".impactos_respuesta")
    
    probabilidades_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1,impactos_respuesta1,resultados_respuesta1)
        })
    })

    impactos_respuesta1.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calculo_valor_riesgo_respuesta1(index,probabilidades_respuesta1,impactos_respuesta1,resultados_respuesta1)
        })
    })
    calcular_nivel_resultado_respuesta1(resultados_respuesta1)
    const url_id_proyecto = window.location.pathname;
    const id_proyecto = url_id_proyecto.split('/').slice(3)
    let url = "/proyectos/formulario_nueva_accion/"+ id_proyecto
    enviar_nueva_accion(url, data, input_celda_id_accion, input_riesgo_asociado, input_id_meta_accion)
}

function enviar_nueva_accion(url, datos, input_celda_id_accion, input_riesgo_asociado, input_id_meta_accion) {
    
    fetch(url, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(cancelar_accion())
    .then(response => response.json()) 
    .then(data =>{
        // alert("¡Nuevo registro guardado!") 
        let datos = Object.values(data)
        input_celda_id_accion.value = datos[0]
        input_riesgo_asociado.value = datos[1]
        input_id_meta_accion.value = datos[0]
        alert("Nueva Acción creada")
        })
        .catch(error => {
            console.error("Error al enviar el registro");
            console.error(error);
        })
    
}

function cancelar_riesgo(){
    let modal = document.getElementById("modalOne")
    modal.style.display = "none";
    let mensaje = document.getElementById("aclaracion-nuevo-riesgo")
    mensaje.style.display = "none"
    document.getElementById("fecha_nuevo_riesgo").value = ''
    document.getElementById("tipo_riesgo_nuevo").value = ''
    document.getElementById("causa_riesgo_nuevo").value = ''
    document.getElementById("categoria_riesgo_nuevo").value = ''
    document.getElementById("subcategoria_riesgo_nuevo").value = ''
    document.getElementById("probabilidad_riesgo_nuevo").value = ''
    document.getElementById("efecto_riesgo_nuevo").value = ''
    document.getElementById("area_afectada_nuevo").value = ''
    document.getElementById("impacto_riesgo_nuevo").value = ''
    document.getElementById("valor_riesgo_nuevo").value = ''
    document.getElementById("nivel_riesgo_nuevo").value = ''
    document.getElementById("nivel_riesgo_nuevo").style.backgroundColor = "white"
    document.getElementById("estrategia_riesgo_nuevo1").value = ''
    document.getElementById("actividades_riesgo_nuevo1").value = ''
    document.getElementById("responsable_riesgo_nuevo1").value = ''
    document.getElementById("probabilidad_respuesta_riesgo_nuevo1").value = ''
    document.getElementById("impacto_respuesta_riesgo_nuevo1").value = ''
    document.getElementById("valor_respuesta_riesgo_nuevo1").value = ''
    document.getElementById("nivel_riesgo_nuevo_respuesta1").value = ''
    document.getElementById("nivel_riesgo_nuevo_respuesta1").style.backgroundColor = "white"
    document.getElementById("residual_riesgo_nuevo1").value = ''
    document.getElementById("estado_riesgo_nuevo1").value = ''
    document.getElementById("estado_accion_nuevo1").value = ''

    let estrategia_titulo = document.getElementById("estrategia_titulo")
    estrategia_titulo.innerHTML = 'Estrategia de respuesta'
    let actividades_titulo = document.getElementById("actividades_titulo")
    actividades_titulo.innerHTML = 'Actividades de respuesta'
    let responsable_titulo = document.getElementById("responsable_titulo")
    responsable_titulo.innerHTML = 'Responsable del tratamiento'
    let estado_accion_titulo = document.getElementById("estado_accion_titulo")
    estado_accion_titulo.innerHTML = 'Estado Acción'
    let probabilidad_titulo = document.getElementById("probabilidad_titulo")
    probabilidad_titulo.innerHTML = 'Probabilidad respuesta'
    let impacto_titulo = document.getElementById("impacto_titulo")
    impacto_titulo.innerHTML = 'Impacto respuesta'
    let valor_titulo = document.getElementById("valor_titulo")
    valor_titulo.innerHTML = 'Valor del riesgo de la respuesta'
    let nivel_titulo = document.getElementById("nivel_titulo")
    nivel_titulo.innerHTML = 'Nivel de acción'
    let residual_titulo = document.getElementById("residual_titulo")
    residual_titulo.innerHTML = 'Riesgo residual'
    let estado_riesgo_titulo = document.getElementById("estado_riesgo_titulo")
    estado_riesgo_titulo.innerHTML = 'Estado del riesgo'
}

function cancelar_accion(){
    let modal = document.getElementById("modalTwo")
    modal.style.display = "none";

    document.getElementById("riesgo_asociado").value = ''
    document.getElementById("estrategia_riesgo_nuevo").value = ''
    document.getElementById("actividades_riesgo_nuevo").value = ''
    document.getElementById("responsable_riesgo_nuevo").value = ''
    document.getElementById("probabilidad_nueva_acccion").value = ''
    document.getElementById("impacto_nueva_accion").value = ''
    document.getElementById("valor_nueva_accion").value = ''
    document.getElementById("nivel_nueva_accion").value = ''
    document.getElementById("residual_riesgo_nuevo").value = ''
    document.getElementById("estado_riesgo_nuevo").value = ''
    document.getElementById("estado_accion_nuevo").value = ''
}

// metodos de calculo
calcular_nivel_resultado()
calcular_nivel_resultado_respuesta()
calcular_impacto_economico();

