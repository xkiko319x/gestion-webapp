import { formularioNuevaAccion, formularioNuevoRiesgo, formularioNuevoPresupuesto } from "./model.js";
import { botonEliminarRiesgo, botonActualizarRiesgo,botonEditarRiesgo } from "./model.js";
import { botonEliminarAccion, botonActualizarAccion, botonEditarAccion } from "./model.js";

// onclicks y visualizacion de las ventanas modales de los formularios
var modalBtns = [...document.querySelectorAll(".botones-modales")];
modalBtns.forEach(function (btn) {
    btn.onclick = function () {
        let modal = btn.getAttribute("data-modal");
        document.getElementById(modal).style.display = "block";
    };
});

// close de las ventanas modales de los formularios
window.onclick = function (event) {
    if (event.target.className === "modal") {
        cancelarRiesgo()
        cancelarAccion()
        cancelarNuevoPrespuesto()
    }
};

document.getElementById("cancel-riesgo").addEventListener("click", function(){
    cancelarRiesgo()
})

// limpiar formulario
function cancelarRiesgo() {
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

    let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
    aclaracion.style.display = 'none'

    document.getElementById("estrategia_accion_nueva_riesgo").required = '';
    document.getElementById("actividades_accion_nueva_riesgo").required = '';
    document.getElementById("responsable_accion_nueva_riesgo").required = '';
    document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = '';
    document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = '';
    document.getElementById("valor_respuesta_accion_nueva_riesgo").required = '';
    document.getElementById("residual_accion_nueva_riesgo").required = '';
    document.getElementById("estado_riesgo_nuevo_riesgo").required = '';
    document.getElementById("estado_accion_nueva_riesgo").required = '';

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


    document.getElementById("estrategia_accion_nueva_riesgo").value = '';
    document.getElementById("actividades_accion_nueva_riesgo").value = '';
    document.getElementById("responsable_accion_nueva_riesgo").value = '';
    document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").value = '';
    document.getElementById("impacto_respuesta_accion_nueva_riesgo").value = '';
    document.getElementById("valor_respuesta_accion_nueva_riesgo").value = '';
    document.getElementById("residual_accion_nueva_riesgo").value = '';
    document.getElementById("nivel_accion_nueva_riesgo_respuesta").value= '';
    document.getElementById("nivel_accion_nueva_riesgo_respuesta").style.backgroundColor = "white";
    document.getElementById("estado_riesgo_nuevo_riesgo").value = '';
    document.getElementById("estado_accion_nueva_riesgo").value = '';
}

document.getElementById("cancel-accion").addEventListener("click", function(){
    cancelarAccion()
})

document.getElementById("cancel-presupuesto").addEventListener("click", function(){
    cancelarNuevoPrespuesto()
})

function cancelarNuevoPrespuesto(){
    let modal = document.getElementById("modalThree")
    modal.style.display = "none";
    document.getElementById("nuevo_presupuesto").value = ''
}

// limpiar formulario
function cancelarAccion() {
    let modal = document.getElementById("modalTwo")
    modal.style.display = "none";
    document.getElementById("riesgo_asociado").value = ''
    document.getElementById("estrategia_accion_nueva").value = ''
    document.getElementById("actividades_accion_nueva").value = ''
    document.getElementById("responsable_accion_nueva").value = ''
    document.getElementById("probabilidad_accion_nueva").value = ''
    document.getElementById("impacto_accion_nueva").value = ''
    document.getElementById("valor_accion_nueva").value = ''
    document.getElementById("nivel_accion_nueva").value = ''
    document.getElementById("nivel_accion_nueva").style.backgroundColor = "white"
    document.getElementById("residual_accion_nueva").value = ''
    document.getElementById("estado_riesgo_nuevo").value = ''
    document.getElementById("estado_accion_nueva").value = ''

    let estrategiaTitulo = document.getElementById("estrategia_titulo")
    estrategiaTitulo.innerHTML = 'Estrategia de respuesta'
    let actividadesTitulo = document.getElementById("actividades_titulo")
    actividadesTitulo.innerHTML = 'Actividades de respuesta'
    let responsableTitulo = document.getElementById("responsable_titulo")
    responsableTitulo.innerHTML = 'Responsable del tratamiento'
    let estadoAccionTitulo = document.getElementById("estado_accion_titulo")
    estadoAccionTitulo.innerHTML = 'Estado Acción'
    let probabilidadTitulo = document.getElementById("probabilidad_titulo")
    probabilidadTitulo.innerHTML = 'Probabilidad respuesta'
    let impactoTitulo = document.getElementById("impacto_titulo")
    impactoTitulo.innerHTML = 'Impacto respuesta'
    let valorTitulo = document.getElementById("valor_titulo")
    valorTitulo.innerHTML = 'Valor del riesgo de la respuesta'
    let nivelTitulo = document.getElementById("nivel_titulo")
    nivelTitulo.innerHTML = 'Nivel de acción'
    let residualTitulo = document.getElementById("residual_titulo")
    residualTitulo.innerHTML = 'Riesgo residual'
    let estadoRiesgoTitulo = document.getElementById("estado_riesgo_titulo")
    estadoRiesgoTitulo.innerHTML = 'Estado del riesgo'
}

export function asignarSubcategorias() {
    var categorias = document.querySelectorAll(".categorias")
    categorias.forEach(function (input, index) {
        input.addEventListener('change', function () {
            subcategoriasRiesgos(index)
        })
    })
}
// carga en el formulario de nueva accion las subcategorias dependiendo
// de la categoria seleccionada
export function subcategoriasRiesgos(index) {
    // Objeto de subcategorias
    let subcategoriasTextos = {
        "De Carácter Técnico": ["Definición de requisitos", "Disponibilidad de la Información", "Uso de la tecnologías nuevas o no aprobadas", "Naturaleza/complejidad de diseño", "Disponibilidad de experiencia Técnica", "Productividad/Eficiencia del Equipo", "Calidad de los Trabajos"],
        "Del Entorno": ["Participación de Subcontratas/Consultoras", "Uso de Normativa Específica", "Condicionantes del mercado", "Relación con el Cliente (clima/expectativas)", "Relación con otros Interesados Externos"],
        "De la Organización": ["Naturaleza de la Organización", "Naturaleza del Proyecto en la Organización", "Condiciones Econ.-Financ. del Proy./Organización"],
        "De la Gestión del Proyecto": ["Ambigüedad del Contrato", "Penalizaciones Contractuales", "Definición de Supuestos", "Definición de la Planificación", "Definición de las Estimaciones de Coste", "Realización del Control/Seguimiento del Proyecto", "Gestión de las Comunicaciones", "Disponibilidad de Recursos", "Ubicación del Equipo de Trabajo"],
        "De Seguridad de Información": ["Desastres Naturales", "Origen Industrial", "Errores y Fallos Intencionados", "Ataques Intencionados"]
    }

    if (index == 0) {
        let categoria = document.getElementById('categoria_riesgo_nuevo')
        let subcategoria = document.getElementById('subcategoria_riesgo_nuevo')
        let categoriaSeleccionada = categoria.value

        // Se limpian las subcategorias
        subcategoria.innerHTML = '<option value="">Seleccione una Subcategoría...</option>'

        if (categoriaSeleccionada !== '') {
            // Se seleccionan las subcategorias y se ordenan
            categoriaSeleccionada = subcategoriasTextos[categoriaSeleccionada]
            categoriaSeleccionada.sort()

            // Insertamos las subctegorias
            categoriaSeleccionada.forEach(function (categoria) {
                let opcion = document.createElement('option')
                opcion.value = categoria
                opcion.text = categoria
                subcategoria.add(opcion)
            });
        }
    } else {
        let categorias = document.querySelectorAll(".categorias")
        let categoriaSeleccionada = categorias[index].value
        let subcategorias = document.querySelectorAll(".subcategoria")
        let subcategoria = subcategorias[index]

        subcategoria.placeholder = 'Seleccione una Subcategoría'

        if (categoriaSeleccionada !== '') {
            if (categoriaSeleccionada === "De Carácter Técnico") {
                subcategoria.setAttribute("list", "tecnico")
            } else {
                if (categoriaSeleccionada === "Del Entorno") {
                    subcategoria.setAttribute("list", "entorno")
                } else {
                    if (categoriaSeleccionada === "De la Organización") {
                        subcategoria.setAttribute("list", "organizacion")
                    } else {
                        if (categoriaSeleccionada === "De la Gestión del Proyecto") {
                            subcategoria.setAttribute("list", "gestion")
                        } else {
                            // informacion
                            subcategoria.setAttribute("list", "informacion")
                        }
                    }
                }
            } 
        }
    }
}

// valores del form de riesgo --> se envian al backend
document.getElementById("riesgo_accion").onclick = function (event) {
    comprobarRiesgo()
    if (camposRequeridosLlenos()) {
        // comprobarRiesgo()
        NuevoRiesgoAccion()
        let modal = document.getElementById("modalOne")
        modal.style.display = "none";
    } else {
        event.preventDefault()
    }
}

document.getElementById("form_presupuesto").onclick = function (event) {
    if (document.getElementById("form_presupuesto").checkValidity()) {
        nuevoPresupuesto()
        modificarPresupuesto()
        cancelarNuevoPrespuesto()
    } else {
        event.preventDefault()
    }
}
function camposRequeridosLlenos() {
    // Verifica si los campos requeridos están llenos
    return (
        document.getElementById("estrategia_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("actividades_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("responsable_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("impacto_respuesta_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("valor_respuesta_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("nivel_accion_nueva_riesgo_respuesta").checkValidity() &&
        document.getElementById("residual_accion_nueva_riesgo").checkValidity() &&
        document.getElementById("estado_riesgo_nuevo_riesgo").checkValidity() &&
        document.getElementById("estado_accion_nueva_riesgo").checkValidity()
    )
}

document.getElementById("valor_riesgo_nuevo").addEventListener('input', comprobarRiesgo)

function comprobarRiesgo() {
    let resultado = document.getElementById("valor_riesgo_nuevo").value
    if (resultado> 0) {
        if (resultado>= 0.18 && resultado <= 0.72) {
            //verde
            let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
            aclaracion.style.display = 'none'
            document.getElementById("estrategia_accion_nueva_riesgo").required = '';
            document.getElementById("actividades_accion_nueva_riesgo").required = '';
            document.getElementById("responsable_accion_nueva_riesgo").required = '';
            document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = '';
            document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = '';
            document.getElementById("valor_respuesta_accion_nueva_riesgo").required = '';
            document.getElementById("residual_accion_nueva_riesgo").required = '';
            document.getElementById("estado_riesgo_nuevo_riesgo").required = '';
            document.getElementById("estado_accion_nueva_riesgo").required = '';

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
            if (resultado >= 0.06 && resultado <= 0.14) {
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'none'
                document.getElementById("estrategia_accion_nueva_riesgo").required = '';
                document.getElementById("actividades_accion_nueva_riesgo").required = '';
                document.getElementById("responsable_accion_nueva_riesgo").required = '';
                document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("valor_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("residual_accion_nueva_riesgo").required = '';
                document.getElementById("estado_riesgo_nuevo_riesgo").required = '';
                document.getElementById("estado_accion_nueva_riesgo").required = '';

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
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'none'
                document.getElementById("estrategia_accion_nueva_riesgo").required = '';
                document.getElementById("actividades_accion_nueva_riesgo").required = '';
                document.getElementById("responsable_accion_nueva_riesgo").required = '';
                document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("valor_respuesta_accion_nueva_riesgo").required = '';
                document.getElementById("residual_accion_nueva_riesgo").required = '';
                document.getElementById("estado_riesgo_nuevo_riesgo").required = '';
                document.getElementById("estado_accion_nueva_riesgo").required = '';

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
        if (resultado < 0) {
            if (resultado <= -0.18 && resultado >= -0.72) {
                let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                aclaracion.style.display = 'block'
                document.getElementById("estrategia_accion_nueva_riesgo").required = 'true';
                document.getElementById("actividades_accion_nueva_riesgo").required = 'true';
                document.getElementById("responsable_accion_nueva_riesgo").required = 'true';
                document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = 'true';
                document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = 'true';
                document.getElementById("valor_respuesta_accion_nueva_riesgo").required = 'true';
                document.getElementById("residual_accion_nueva_riesgo").required = 'true';
                document.getElementById("estado_riesgo_nuevo_riesgo").required = 'true';
                document.getElementById("estado_accion_nueva_riesgo").required = 'true';

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
                if (resultado <= -0.06 && resultado >= -0.14) {
                    let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                    aclaracion.style.display = 'block'
                    document.getElementById("estrategia_accion_nueva_riesgo").required = 'true';
                    document.getElementById("actividades_accion_nueva_riesgo").required = 'true';
                    document.getElementById("responsable_accion_nueva_riesgo").required = 'true';
                    document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = 'true';
                    document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = 'true';
                    document.getElementById("valor_respuesta_accion_nueva_riesgo").required = 'true';
                    document.getElementById("residual_accion_nueva_riesgo").required = 'true';
                    document.getElementById("estado_riesgo_nuevo_riesgo").required = 'true';
                    document.getElementById("estado_accion_nueva_riesgo").required = 'true';

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
                    let aclaracion = document.getElementById("aclaracion-nuevo-riesgo")
                    aclaracion.style.display = 'none'
                    document.getElementById("estrategia_accion_nueva_riesgo").required = '';
                    document.getElementById("actividades_accion_nueva_riesgo").required = '';
                    document.getElementById("responsable_accion_nueva_riesgo").required = '';
                    document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").required = '';
                    document.getElementById("impacto_respuesta_accion_nueva_riesgo").required = '';
                    document.getElementById("valor_respuesta_accion_nueva_riesgo").required = '';
                    document.getElementById("residual_accion_nueva_riesgo").required = '';
                    document.getElementById("estado_riesgo_nuevo_riesgo").required = '';
                    document.getElementById("estado_accion_nueva_riesgo").required = '';

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
}

// función que recoge los valores del formulario de nuevo riesgo
async function viewNuevoRiesgo() {
    let nuevoRiesgo = new Object()
    nuevoRiesgo = {
        Fecha: document.getElementById("fecha_nuevo_riesgo").value,
        Tipo: document.getElementById("tipo_riesgo_nuevo").value,
        Causa: document.getElementById("causa_riesgo_nuevo").value,
        Categoria: document.getElementById("categoria_riesgo_nuevo").value,
        Subcategoria: document.getElementById("subcategoria_riesgo_nuevo").value,
        Probabilidad_riesgo: document.getElementById("probabilidad_riesgo_nuevo").value,
        Efecto: document.getElementById("efecto_riesgo_nuevo").value,
        Area: document.getElementById("area_afectada_nuevo").value,
        Impacto_riesgo: document.getElementById("impacto_riesgo_nuevo").value,
        Valor_riesgo: document.getElementById("valor_riesgo_nuevo").value,
        Nivel_riesgo: document.getElementById("nivel_riesgo_nuevo").value,
    }
    
    return await formularioNuevoRiesgo(nuevoRiesgo)
}

async function viewNuevaAccion(idRiesgo){
    let nuevaAccion = new Object()
    nuevaAccion = {
        id_riesgo: idRiesgo,
        Riesgo_asociado : '',
        Estrategia: document.getElementById("estrategia_accion_nueva_riesgo").value,
        Actividades: document.getElementById("actividades_accion_nueva_riesgo").value,
        Responsable: document.getElementById("responsable_accion_nueva_riesgo").value,
        Probabilidad: document.getElementById("probabilidad_respuesta_accion_nueva_riesgo").value,
        Impacto: document.getElementById("impacto_respuesta_accion_nueva_riesgo").value,
        Valor_respuesta: document.getElementById("valor_respuesta_accion_nueva_riesgo").value,
        Nivel_respuesta: document.getElementById("nivel_accion_nueva_riesgo_respuesta").value,
        Residual: document.getElementById("residual_accion_nueva_riesgo").value,
        Estado_riesgo: document.getElementById("estado_riesgo_nuevo_riesgo").value,
        Estado_accion: document.getElementById("estado_accion_nueva_riesgo").value
    }
    return await formularioNuevaAccion(nuevaAccion)
}

function NuevoRiesgoAccion(){
    viewNuevoRiesgo().then((response)=>{
        viewNuevaAccion(response)
        cancelarRiesgo()
    })
}


document.getElementById("formAccion").addEventListener("submit", function (event) {
    event.preventDefault();
    nuevaAccionAsociar()
})

function modificarPresupuesto() {
    let nuevo_presupuesto = document.getElementById("nuevo_presupuesto").value
    let campo_presupuesto = document.getElementById("presupuesto_proyecto")
    campo_presupuesto.value = nuevo_presupuesto
    calcularImpactoEconomico()
}
async function nuevoPresupuesto() {
    let data = {
        nuevo_presupuesto: document.getElementById("nuevo_presupuesto").value
    }
    return await formularioNuevoPresupuesto(data)
}

function nuevaAccionAsociar() {
    crearNuevaAccion()
    cancelarAccion()
}

async function crearNuevaAccion(){
    let nuevaAccion = new Object()
    nuevaAccion = {
        Riesgo_asociado: document.getElementById("riesgo_asociado").value,
        Estrategia: document.getElementById("estrategia_accion_nueva").value,
        Actividades: document.getElementById("actividades_accion_nueva").value,
        Responsable: document.getElementById("responsable_accion_nueva").value,
        Probabilidad: document.getElementById("probabilidad_accion_nueva").value,
        Impacto: document.getElementById("impacto_accion_nueva").value,
        Valor_respuesta: document.getElementById("valor_accion_nueva").value,
        Nivel_respuesta: document.getElementById("nivel_accion_nueva").value,
        Residual: document.getElementById("residual_accion_nueva").value,
        Estado_riesgo: document.getElementById("estado_riesgo_nuevo").value,
        Estado_accion: document.getElementById("estado_accion_nueva").value
    }
    return await formularioNuevaAccion(nuevaAccion)
}

// filtro por código de riesgo para ambas tablas
document.getElementById("code_buscar").onkeyup = function filtrar() {
    var tablaRiesgos = document.getElementById('tabla_riesgos');
    var codeBuscar = document.getElementById('code_buscar').value.toUpperCase();

    for (var i = 1; i < tablaRiesgos.rows.length; i++) {
        var cellsOfRow = tablaRiesgos.rows[i].getElementsByTagName('td');
        var found = false;

        var compareWith = cellsOfRow[0].innerHTML.toUpperCase();
        if (codeBuscar.length == 0 || (compareWith.indexOf(codeBuscar) > -1)) {
            found = true;
        }
        if (found) {
            tablaRiesgos.rows[i].style.display = '';
        } else {
            tablaRiesgos.rows[i].style.display = 'none';
        }
    }
    var tablaAccion = document.getElementById('tabla_acciones');
    for (var i = 1; i < tablaAccion.rows.length; i++) {
        var cellsOfRow = tablaAccion.rows[i].getElementsByTagName('td');
        var found = false;

        var compareWith = cellsOfRow[1].innerHTML;
        if (codeBuscar.length == 0 || (compareWith.indexOf(codeBuscar) > -1)) {
            found = true;
        }
        if (found) {
            tablaAccion.rows[i].style.display = '';
        } else {
            tablaAccion.rows[i].style.display = 'none';
        }
    }
}

// event listener a todos los botones con la clase delete_riesgo -> llama a la función para eliminar
var deleteRiesgo = document.querySelectorAll(".delete_riesgo")
deleteRiesgo.forEach(function (button) {
    button.addEventListener('click', function () {
        botonEliminarRiesgo(button)
    })
})

// event listener a todos los botones con la clase edit_riesgo -> llama a la función para editar
var editRiesgo = document.querySelectorAll(".edit_riesgo")
editRiesgo.forEach(function (button) {
    button.addEventListener('click', function () {
        botonEditarRiesgo(button)
    })
})

// event listener a todos los botones con la clase update_riesgo -> llama a la función para actualizar 
var updateRiesgo = document.querySelectorAll(".update_riesgo")
updateRiesgo.forEach(function (button) {
    button.addEventListener('click', function () {
        let datos = obtenerUpdateRiesgo(button)
        botonActualizarRiesgo(button, datos)
    })
})

// función que obtiene los datos de la tabla de riesgos
export function obtenerUpdateRiesgo(button) {
    var fila = button.parentNode.parentNode;
    var riesgoUpdate = new Object()
    riesgoUpdate = {
        Fecha_deteccion: fila.cells[1].querySelector('input[type="date"]').value,
        Tipo_riesgo: fila.cells[2].querySelector('input[type="text"]').value,
        Causa: fila.cells[3].querySelector('textarea').value,
        Categoria: fila.cells[4].querySelector('input[type="text"]').value,
        Subcategoria: fila.cells[5].querySelector('input[type="text"]').value,
        Probabilidad: fila.cells[6].querySelector('input[type="number"]').value,
        Efecto: fila.cells[7].querySelector('textarea').value,
        Area_afectada: fila.cells[8].querySelector('input[type="text"]').value,
        Impacto: fila.cells[9].querySelector('input[type="number"]').value,
        Valor_riesgo: fila.cells[10].querySelector('input[type="number"]').value,
        Nivel_riesgo: fila.cells[11].querySelector('input[type="text"]').value,
    }
    return riesgoUpdate
}

// parte de las acciones 
var editAccion = document.querySelectorAll(".edit_accion")
editAccion.forEach(function (button) {
    button.addEventListener('click', function () {
        botonEditarAccion(button)
    })
})

var updateAccion = document.querySelectorAll(".update_accion")
updateAccion.forEach(function (button) {
    button.addEventListener('click', function () {
        let datos = obtenerUpdateAccion(button)
        botonActualizarAccion(button, datos)
    })
})

export function obtenerUpdateAccion(button) {
    var datosAccion = new Object()
    var filaAccion = button.parentNode.parentNode
    datosAccion = {    
        Estrategia: filaAccion.cells[2].querySelector('input[type="text"]').value,
        Actividades: filaAccion.cells[3].querySelector('textarea').value,
        Responsable: filaAccion.cells[4].querySelector('input[type="text"]').value,
        Probabilidad_accion: filaAccion.cells[5].querySelector('input[type="number"]').value,
        Impacto_accion: filaAccion.cells[6].querySelector('input[type="number"]').value,
        Valor_accion: filaAccion.cells[7].querySelector('input[type="number"]').value,
        Nivel_accion: filaAccion.cells[8].querySelector('input[type="text"]').value,
        Estado_accion: filaAccion.cells[9].querySelector('input[type="text"]').value,
        Riesgo_residual: filaAccion.cells[10].querySelector('input[type="text"]').value,
        Estado_riesgo: filaAccion.cells[11].querySelector('input[type="text"]').value,
    }
    return datosAccion
}

var deleteAccion = document.querySelectorAll(".delete_accion")
deleteAccion.forEach(function (button) {
    button.addEventListener('click', function () {
        botonEliminarAccion(button)
    })
})

// CÁLCULOS Y PINTAR CELDAS
export function obtenerProbabilidades(){
    let probabilidades = document.querySelectorAll(".probabilidades")
    probabilidades.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calcularValor(index)
            calcularImpactoEconomico()
        })
    })
}

export function obtenerImpactos(){
    let impactos = document.querySelectorAll(".impactos")
    impactos.forEach(function(input, index) {
        input.addEventListener('input', function() {
            calcularValor(index)
            calcularImpactoEconomico()
        })
    })
}

function calcularValor(index) {
    let probabilidades = document.querySelectorAll(".probabilidades")
    let impactos = document.querySelectorAll(".impactos")
    let resultados = document.querySelectorAll('.resultado');

    let prob = parseFloat(probabilidades[index].value)
    let impt = parseFloat(impactos[index].value)
    let result = prob* impt
    let inputResultado = resultados[index]
    inputResultado.value = result.toFixed(2)

    let resultado = result.toFixed(2) 
    actualizarNivel(resultado, index)
}

function actualizarNivel(resultado, index) {
    let nivelRiesgo = document.getElementsByClassName("nivel")
    let nivelResultado = nivelRiesgo[index]
    let valorResultado = resultado
    if (valorResultado > 0) {
        // OPORTUNIDADES --> riesgos positivos
        if (valorResultado >= 0.18 && valorResultado <= 0.72) {
            //verde
            nivelResultado.value = "Alto"
            nivelResultado.style.backgroundColor = "#60F032";
            nivelResultado.style.color = "black"
        } else {
            if (valorResultado > 0.05 && valorResultado <= 0.14) {
                // amarillo
                nivelResultado.value = "Medio"
                nivelResultado.style.backgroundColor = "#F0B732";
                nivelResultado.style.color = "black"
            } else {
                //rojo
                nivelResultado.value = "Bajo"
                nivelResultado.style.backgroundColor = "#DF1904";
                nivelResultado.style.color = "black"
            }
        }
    } else {
        // AMENAZAS --> riesgos negativos
        if (valorResultado < 0) {
            if (valorResultado <= -0.18 && valorResultado >= -0.72) {

                //rojo
                nivelResultado.value = "Alto"
                nivelResultado.style.backgroundColor = "#DF1904";
                nivelResultado.style.color = "black"
            } else {
                if (valorResultado < -0.05 && valorResultado >= -0.14) {
                    // amarillo
                    nivelResultado.value = "Medio"
                    nivelResultado.style.backgroundColor = "#F0B732";
                    nivelResultado.style.color = "black"
                } else {
                    //verde
                    nivelResultado.value = "Bajo"
                    nivelResultado.style.backgroundColor = "#60F032";
                    nivelResultado.style.color = "black"
                }
            }
        }
    }
}

export function calcularNivelResultado() {
    let nivelRiesgo = document.getElementsByClassName("nivel")
    let resultados = document.querySelectorAll('.resultado');
    for (let i = 0; i < resultados.length; i++) {
        let valorResultado = resultados[i].value
        let nivelResultado = nivelRiesgo[i]
        if (valorResultado > 0) {
            // OPORTUNIDADES --> riesgos positivos
            if (valorResultado >= 0.18 && valorResultado <= 0.72) {
                //verde
                nivelResultado.value = "Alto"
                nivelResultado.style.backgroundColor = "#60F032";
                nivelResultado.style.color = "black"
            } else {
                if (valorResultado > 0.05 && valorResultado <= 0.14) {
                    // amarillo
                    nivelResultado.value = "Medio"
                    nivelResultado.style.backgroundColor = "#F0B732";
                    nivelResultado.style.color = "black"
                } else {
                    //rojo
                    nivelResultado.value = "Bajo"
                    nivelResultado.style.backgroundColor = "#DF1904";
                    nivelResultado.style.color = "black"
                }
            }
        } else {
            // AMENAZAS --> riesgos negativos
            if (valorResultado < 0) {
                if (valorResultado <= -0.18 && valorResultado >= -0.72) {
    
                    //rojo
                    nivelResultado.value = "Alto"
                    nivelResultado.style.backgroundColor = "#DF1904";
                    nivelResultado.style.color = "black"
                } else {
                    if (valorResultado < -0.05 && valorResultado >= -0.14) {
                        // amarillo
                        nivelResultado.value = "Medio"
                        nivelResultado.style.backgroundColor = "#F0B732";
                        nivelResultado.style.color = "black"
                    } else {
                        //verde
                        nivelResultado.value = "Bajo"
                        nivelResultado.style.backgroundColor = "#60F032";
                        nivelResultado.style.color = "black"
    
                    }
                }
            }
        }
    }
}

export function calcularImpactoEconomico(){
    const presupuesto_total = document.getElementById("presupuesto_proyecto").value
    let impactos_economicos = document.getElementsByClassName('impactos_economicos');
    let ie_total = document.getElementById("ie_total")
    ie_total.value = 0
    var total = 0.00
    let probabilidades = document.querySelectorAll(".prob")
    let impactos = document.querySelectorAll(".impt")
    for (let i = 0; i < impactos_economicos.length; i++) {
        var pproyecto = parseFloat(presupuesto_total)
        var prob = parseFloat(probabilidades[i].value)
        var impt = parseFloat(impactos[i].value)
        var resultado_ie = prob * impt * pproyecto
        var inputResultado = impactos_economicos[i]
        inputResultado.value = resultado_ie.toFixed(2)
        
        if (isNaN(resultado_ie) || resultado_ie === null) {
            ie_total.value = total.toFixed(2)
        } else {
            total = total + resultado_ie
            ie_total.value = total.toFixed(2)
        }
    }
}


// llamadas iniciales a las funciones
asignarSubcategorias()
obtenerImpactos()
obtenerProbabilidades()
calcularNivelResultado()
calcularImpactoEconomico()