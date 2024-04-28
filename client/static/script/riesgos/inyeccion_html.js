import { botonEditarAccion, botonEditarRiesgo, botonEliminarAccion, botonEliminarRiesgo } from "./model.js";
import { asignarSubcategorias, calcularImpactoEconomico, calcularNivelResultado, obtenerImpactos, obtenerProbabilidades } from "./view.js";

// INYECCION DE HTML EN LA TABLA
const tabla = document.getElementById('tabla_riesgos').getElementsByTagName('tbody')[0];
const tablaAcciones = document.getElementById('tabla_acciones').getElementsByTagName('tbody')[0];

export function inyectarNuevoRiesgo(data, promiseData) {
    let fila = tabla.insertRow(tabla.rows.length)
    fila.style.textAlign = 'center'
    
    let celdaIdItem1 = fila.insertCell(0)
    let pCeldaId = document.createElement('p')
    pCeldaId.innerHTML = promiseData.code
    pCeldaId.id = "riesgo_code"
    celdaIdItem1.appendChild(pCeldaId)
    
    let celdaFecha = fila.insertCell(1)
    let inputFecha = document.createElement("input")
    inputFecha.type = "date"
    inputFecha.value = data.Fecha
    inputFecha.readOnly = true
    celdaFecha.appendChild(inputFecha)

    let celdaTipo = fila.insertCell(2);
    let inputTipo = document.createElement("input");
    inputTipo.type = "text";
    inputTipo.value = data.Tipo;
    inputTipo.setAttribute("list", "tipo_riesgo");
    inputTipo.readOnly = true;
    celdaTipo.appendChild(inputTipo);

    let celdaCausa = fila.insertCell(3);
    let inputCausa = document.createElement("textarea");
    inputCausa.rows = "3";
    inputCausa.value = data.Causa;
    inputCausa.readOnly = true;
    celdaCausa.appendChild(inputCausa);

    let celdaCategoria = fila.insertCell(4);
    let inputCategoria = document.createElement("input");
    inputCategoria.type = "text";
    inputCategoria.value = data.Categoria;
    inputCategoria.className = "categorias";
    inputCategoria.setAttribute("list", "dt_categorias");
    inputCategoria.readOnly = true;
    celdaCategoria.appendChild(inputCategoria);

    let celdaSubcategoria = fila.insertCell(5);
    let inputSubcategoria = document.createElement("input");
    inputSubcategoria.type = "text";
    inputSubcategoria.value = data.Subcategoria;
    inputSubcategoria.className = "subcategoria";
    inputSubcategoria.readOnly = true;
    celdaSubcategoria.appendChild(inputSubcategoria);

    let celdaProbabilidad = fila.insertCell(6);
    let inputProbabilidad = document.createElement("input");
    inputProbabilidad.type = "number";
    inputProbabilidad.value = data.Probabilidad_riesgo;
    inputProbabilidad.classList.add("probabilidades","prob")
    inputProbabilidad.setAttribute("list", "probabilidad");
    inputProbabilidad.readOnly = true;
    celdaProbabilidad.appendChild(inputProbabilidad);

    let celdaEfecto = fila.insertCell(7);
    let inputEfecto = document.createElement("textarea");
    inputEfecto.rows = "3";
    inputEfecto.value = data.Efecto;
    inputEfecto.readOnly = true;
    celdaEfecto.appendChild(inputEfecto);

    let celdaArea = fila.insertCell(8);
    let inputArea = document.createElement("input");
    inputArea.type = "text";
    inputArea.value = data.Area;
    inputArea.setAttribute("list", "area_afectada");
    inputArea.readOnly = true;
    celdaArea.appendChild(inputArea);

    let celdaImpacto = fila.insertCell(9);
    let inputImpacto = document.createElement("input");
    inputImpacto.type = "number";
    inputImpacto.value = data.Impacto_riesgo;
    inputImpacto.readOnly = true;
    inputImpacto.setAttribute("list", "impacto");
    inputImpacto.classList.add("impactos","impt")
    celdaImpacto.appendChild(inputImpacto);

    let celdaResultado = fila.insertCell(10);
    let inputResultado = document.createElement("input");
    inputResultado.type = "number";
    inputResultado.value = data.Valor_riesgo;
    inputResultado.disabled = true;
    inputResultado.className = "resultado";
    celdaResultado.appendChild(inputResultado);

    let celdaNivel = fila.insertCell(11);
    let inputNivel = document.createElement("input");
    inputNivel.type = "text";
    inputNivel.value = data.Nivel_riesgo;
    inputNivel.className = "nivel";
    inputNivel.disabled = true;
    celdaNivel.appendChild(inputNivel);

    // INSERTAR VALORES NUEVA VERSION
    let celdaImpactoEconomico = fila.insertCell(12);
    let inputImpactoEconomico = document.createElement("input");
    inputImpactoEconomico.type = "number";
    inputImpactoEconomico.disabled = true;
    inputImpactoEconomico.className = "impactos_economicos";
    celdaImpactoEconomico.appendChild(inputImpactoEconomico);

    // BOTONES INYECTADOS
    let celdaEditar = fila.insertCell(13);
    let celdaBorrar = fila.insertCell(14);

    let botonEditar = document.createElement('button');
    botonEditar.innerHTML = 'Editar Riesgo';
    botonEditar.className = "edit_riesgo"
    botonEditar.id = promiseData.id_riesgo

    let botonBorrar = document.createElement('button');
    botonBorrar.innerHTML = 'Borrar Riesgo';
    botonBorrar.id = promiseData.id_riesgo
    botonBorrar.className = "delete_riesgo"

    celdaEditar.appendChild(botonEditar);
    celdaBorrar.appendChild(botonBorrar);
    
    botonEditar.addEventListener('click', function () {
        botonEditarRiesgo(botonEditar)
    })


    botonBorrar.addEventListener('click', function () {
        botonEliminarRiesgo(botonBorrar)
    })
    
    asignarSubcategorias()
    obtenerImpactos()
    obtenerProbabilidades()
    calcularNivelResultado()
    calcularImpactoEconomico()
}

export function inyectarNuevaAccion(data, promiseData) {
    let fila = tablaAcciones.insertRow(tablaAcciones.rows.length)
    fila.style.textAlign = 'center'

    let celdaIdItem = fila.insertCell(0);
    let inputCeldaIdAccion = document.createElement("input");
    inputCeldaIdAccion.type = "text";
    inputCeldaIdAccion.value = promiseData.code
    inputCeldaIdAccion.disabled = true;
    celdaIdItem.appendChild(inputCeldaIdAccion);

    let celdaRiesgoAsociado = fila.insertCell(1);
    
    let pCeldaRiesgoAsociado = document.createElement('p')
    if (data.Riesgo_asociado === null || data.Riesgo_asociado === '') {
        pCeldaRiesgoAsociado.innerHTML = promiseData.riesgo_asociado
        pCeldaRiesgoAsociado.id = "riesgo_code_asociado" 
    } else {
        pCeldaRiesgoAsociado.innerHTML = data.Riesgo_asociado
    }
    celdaRiesgoAsociado.appendChild(pCeldaRiesgoAsociado)

    let celdaEstrategia = fila.insertCell(2);
    let inputEstrategia = document.createElement("input");
    inputEstrategia.type = "text";
    inputEstrategia.value = data.Estrategia;
    inputEstrategia.setAttribute("list", "estrategias");
    inputEstrategia.readOnly = true;
    celdaEstrategia.appendChild(inputEstrategia);

    let celdaActividades = fila.insertCell(3);
    let inputActividades = document.createElement("textarea");
    inputActividades.fila = "3";
    inputActividades.value = data.Actividades;
    inputActividades.readOnly = true;
    celdaActividades.appendChild(inputActividades);

    let celdaResponsable = fila.insertCell(4);
    let inputResponsable = document.createElement("input");
    inputResponsable.type = "text";
    inputResponsable.value = data.Responsable;
    inputResponsable.readOnly = true;
    celdaResponsable.appendChild(inputResponsable);

    let celdaProbabilidadRespuesta = fila.insertCell(5);
    let inputProbabilidadRespuesta = document.createElement("input");
    inputProbabilidadRespuesta.type = "number";
    inputProbabilidadRespuesta.value = data.Probabilidad;
    inputProbabilidadRespuesta.classList.add("probabilidades","prob")
    inputProbabilidadRespuesta.setAttribute("list", "probabilidad");
    inputProbabilidadRespuesta.readOnly = true;
    celdaProbabilidadRespuesta.appendChild(inputProbabilidadRespuesta);

    let celdaImpactoRespuesta = fila.insertCell(6);
    let inputImpactoRespuesta = document.createElement("input");
    inputImpactoRespuesta.type = "number";
    inputImpactoRespuesta.value = data.Impacto;
    inputImpactoRespuesta.classList.add("impactos","impt")
    inputImpactoRespuesta.setAttribute("list", "impacto");
    inputImpactoRespuesta.readOnly = true;
    celdaImpactoRespuesta.appendChild(inputImpactoRespuesta);

    let celdaResultadoRespuesta = fila.insertCell(7);
    let inputValor = document.createElement("input");
    inputValor.type = "number";
    inputValor.value = data.Valor_respuesta;
    inputValor.className = "resultado";
    inputValor.disabled = true;
    celdaResultadoRespuesta.appendChild(inputValor);

    let celdaNivelRespuesta = fila.insertCell(8);
    let inputNivelRespuesta = document.createElement("input");
    inputNivelRespuesta.type = "text";
    inputNivelRespuesta.value = data.Nivel_respuesta;
    inputNivelRespuesta.disabled = true;
    inputNivelRespuesta.className = "nivel";
    celdaNivelRespuesta.appendChild(inputNivelRespuesta);

    let celdaEstadoAccion = fila.insertCell(9);
    let inputEstadoAccion = document.createElement("input");
    inputEstadoAccion.type = "text";
    inputEstadoAccion.value = data.Estado_accion;
    inputEstadoAccion.setAttribute("list", "estado_accion");
    inputEstadoAccion.readOnly = true;
    celdaEstadoAccion.appendChild(inputEstadoAccion);

    let celdaResidual = fila.insertCell(10);
    let inputResidual = document.createElement("input");
    inputResidual.type = "text";
    inputResidual.value = data.Residual;
    inputResidual.readOnly = true;
    inputResidual.autocomplete = "off";
    celdaResidual.appendChild(inputResidual);

    let celdaEstado = fila.insertCell(11);
    let inputEstado = document.createElement("input");
    inputEstado.type = "text";
    inputEstado.value = data.Estado_riesgo;
    inputEstado.setAttribute("list", "estado_riesgo");
    inputEstado.readOnly = true;
    inputEstado.autocomplete = "off";
    celdaEstado.appendChild(inputEstado);

    let celdaIdMetaAccion = fila.insertCell(12);
    let inputIdMetaAccion = document.createElement("input");
    inputIdMetaAccion.type = "text";
    inputIdMetaAccion.display = "none";
    inputIdMetaAccion.className = "oculto";
    celdaIdMetaAccion.className = "oculto";
    celdaIdMetaAccion.appendChild(inputIdMetaAccion);

    // BOTONES INYECTADOS
    let celdaEditar = fila.insertCell(13);
    let celdaBorrar = fila.insertCell(14);

    let botonEditar = document.createElement('button');
    botonEditar.innerHTML = 'Editar Acción';
    botonEditar.className = "edit_accion"
    botonEditar.id = promiseData.id_accion
    
    let botonBorrar = document.createElement('button');
    botonBorrar.innerHTML = 'Borrar Acción';
    botonBorrar.id = promiseData.id_accion
    botonBorrar.className = "delete_accion"

    celdaEditar.appendChild(botonEditar);
    celdaBorrar.appendChild(botonBorrar);

    botonEditar.addEventListener('click', function () {
        botonEditarAccion(botonEditar)
    })

    botonBorrar.addEventListener('click', function () {
        botonEliminarAccion(botonBorrar)
    })

    obtenerImpactos()
    obtenerProbabilidades()
    calcularNivelResultado()
}