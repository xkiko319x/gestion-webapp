import { createRiesgo, deleteRiesgo, updateRiesgo } from "./api.js";
import { createAccion, deleteAccion, updateAccion } from "./api.js";
import { updatePresupuesto } from "./api.js";
import { inyectarNuevaAccion, inyectarNuevoRiesgo } from "./inyeccion_html.js";
import { calcularImpactoEconomico, obtenerUpdateAccion, obtenerUpdateRiesgo } from "./view.js";

// variables de urls(para obtener el id de lproyecto)
const urlIdProyecto = window.location.pathname;
const idProyecto = urlIdProyecto.split('/').slice(3)

// función encargada de crear nuevo riesgo
export async function formularioNuevoRiesgo(datos) {
    let response = await createRiesgo(idProyecto, datos)
    // datos que devuelve la promise => id_riesgo creado y el codigo de riesgo
    var promiseData = response.data
    // inyectar el codigo del riesgo en el DOM para recuperarlo al inyectar la acción
    inyectarNuevoRiesgo(datos, promiseData)
    alert("Nuevo Riesgo Creado con código: " + promiseData.code)
    crearRiesgoAsociado(promiseData)
    return promiseData.id_riesgo
}

// función que crea nueva opción para seleccionar el riesgo asociado en el form de nueva acción
function crearRiesgoAsociado(promiseData) {
    let inputRiesgoAsociado = document.getElementById("riesgos")
    let option = document.createElement("option")
    option.value = promiseData.code
    option.textContent = promiseData.efecto
    inputRiesgoAsociado.append(option)
    // inputRiesgoAsociado.remove(option)
}

// función encargada de crear nueva acción
export async function formularioNuevaAccion(datos) {
    let response = await createAccion(idProyecto, datos)
    // datos que devuelve la promise => id_riesgo creado y el codigo de riesgo
    let promiseData = response.data
    inyectarNuevaAccion(datos, promiseData)
    alert("Nueva Acción Creada con código: " + promiseData.code)
}

export async function formularioNuevoPresupuesto(data){
    if (confirm("¿Está seguro de cambiar el presupuesto del proyecto?")) {
        await updatePresupuesto(idProyecto, data)
        alert("¡Presupuesto actualizado!")        
    }
}

// función encargada de poner en edición tanto el riesgo seleccionado como las acciones asociadas a este
export function botonEditarRiesgo(button) {
    let row = button.parentNode.parentNode
    let inputs = row.querySelectorAll('input');
    let buttonText = button.innerText;
    let textarea = row.querySelectorAll('textarea')
    inputs.forEach(function (input) {
        if (buttonText === 'Editar Riesgo') {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('readonly', 'true');
        }
    });
    textarea.forEach(function (textarea) {
        if (buttonText === 'Editar Riesgo') {
            textarea.removeAttribute('readonly');
        } else {
            textarea.setAttribute('readonly', 'true');
        }
    });
    if (buttonText != 'Editar Riesgo') {
        let datos = obtenerUpdateRiesgo(button)
        botonActualizarRiesgo(button, datos)
    }
    // Alternar el texto del botón entre "Editar" y "Guardar"
    button.innerText = (buttonText === 'Editar Riesgo') ? 'Guardar Riesgo' : 'Editar Riesgo';
}

// función para update del riesgo
export function botonActualizarRiesgo(button, datos) {
    // Conociendo el idRow
    let idRiesgo = button.id
    // Enviará al backend el contenido de la tabla.
    updateRiesgo(idRiesgo, datos)
    alert("¡Riesgo actualizado!")
}

// función para eliminar riesgo
export async function botonEliminarRiesgo(button) {
    // Conociendo el idRow
    let idRiesgo = button.id
    // fila del boton pulsado para eliminar
    var filaEliminar = button.parentNode.parentNode
    var codigoEliminar
    let confirmacion = confirm('¿Seguro de eliminar el riesgo y sus acciones asociadas?')
    if (confirmacion) {
        if (filaEliminar.cells[0].querySelector('input[type="text"]') === null) {
            codigoEliminar = filaEliminar.cells[0].querySelector('p').textContent
            eliminarAccionesAsociadas(codigoEliminar)
        } else {
            codigoEliminar = filaEliminar.cells[0].querySelector('input[type="text"]').value
            eliminarAccionesAsociadas(codigoEliminar)
        }
        // Eliminar de la interfaz el riesgo
        eliminarFila(filaEliminar)
        // Enviará al backend la orden de eliminar el riesgo
        let promise_data = await deleteRiesgo(idRiesgo)
        alert("¡Riesgo eliminado!")
        deleteRiesgoAsociado(promise_data)
    } 
    calcularImpactoEconomico()
}

function deleteRiesgoAsociado(promise_data) {
    let code = promise_data.data.code
    let option = filtrarOpcionesRiesgoAsociado(code)
    option.id = "eliminar"

    var optionDelete = document.querySelector("#eliminar");
    optionDelete.remove(0);
}

function filtrarOpcionesRiesgoAsociado(code) {
    let inputRiesgoAsociado = document.getElementById("riesgos")
    let option = {"code":"","id": ""}
    for (var i = 0; i < inputRiesgoAsociado.options.length; i++) {
        if (inputRiesgoAsociado.options[i].value === code) {
            option = inputRiesgoAsociado.options[i]
            break;
        }
    }
    return option
}

function eliminarAccionesAsociadas(code){
    let tablaAccion = document.getElementById("tabla_acciones")
    var code_asociado = ''
    var celda_eliminar
    for (var i = 1; i < tablaAccion.rows.length; i++) {
        if (tablaAccion.rows[i].cells[1].querySelector('input[type="text"]') === null) {
            code_asociado = tablaAccion.rows[i].cells[1].querySelector('p').textContent
            celda_eliminar = tablaAccion.rows[i].cells[1]
        }else{
            code_asociado = tablaAccion.rows[i].cells[1].querySelector('input[type="text"]').value
            celda_eliminar = tablaAccion.rows[i].cells[1]
        }
        
        if (code === code_asociado) {
            let filaEliminar = celda_eliminar.parentNode
            let botonEliminar = filaEliminar.cells[13].querySelector('button')
            botonEliminarAccionConRiesgo(botonEliminar)
        }
    }
}

export function botonEditarAccion(button) {
    // Conociendo el Row
    let row = button.parentNode.parentNode
    // Habilitará la edición de la tabla.
    var inputs = row.querySelectorAll('input');
    var textarea = row.querySelectorAll('textarea')
    var buttonText = button.innerText;
    var textarea = row.querySelectorAll('textarea')
    inputs.forEach(function (input) {
        if (buttonText === 'Editar Acción') {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('readonly', 'true');
        }
    });
    textarea.forEach(function (textarea) {
        if (buttonText === 'Editar Acción') {
            textarea.removeAttribute('readonly');
        } else {
            textarea.setAttribute('readonly', 'true');
        }
    });
    if (buttonText != 'Editar Acción') {
        let datos = obtenerUpdateAccion(button)
        botonActualizarAccion(button, datos)
    }
    // Alternar el texto del botón entre "Editar" y "Guardar"
    button.innerText = (buttonText === 'Editar Acción') ? 'Guardar Acción' : 'Editar Acción';
}

export function botonActualizarAccion(button, datos) {
    // Conociendo el Row
    let idAccion = button.id
    // Enviará al backend el contenido de la tabla.
    updateAccion(idAccion, datos)
    alert("¡Acción actualizada!")
}

export async function botonEliminarAccionConRiesgo(button) {
    // Conociendo el idRow
    let idAccion = button.id
    let fila = button.parentNode.parentNode
    // Eliminar de la interfaz el riesgo
    // Enviará al backend la orden de eliminar el riesgo
    await deleteAccion(idAccion)
    eliminarFila(fila)     
}

export async function botonEliminarAccion(button) {
    // Conociendo el idRow
    let idAccion = button.id
    let fila = button.parentNode.parentNode
    // Eliminar de la interfaz el riesgo
    // Enviará al backend la orden de eliminar el riesgo
    if (confirm("¿Está seguro de borrar esta acción?")) {
        await deleteAccion(idAccion)
        eliminarFila(fila)
        alert("Acción eliminada")        
    }
}

// función que elimina la fila de la UI
function eliminarFila(fila) {
    const tabla = fila.parentNode;
    tabla.deleteRow(fila.rowIndex);
}

