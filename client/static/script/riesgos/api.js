import { HOST } from "/static/script/base.js"

export async function createRiesgo(idProyecto, data) {
    const url = `${HOST}/calidad/riesgos_app/${idProyecto}/riesgo/create`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function updateRiesgo(idRiesgo, data) {
    const url = `${HOST}/calidad/riesgos_app/riesgo/${idRiesgo}/update`;
    const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function deleteRiesgo(idRiesgo) {
    const url = `${HOST}/calidad/riesgos_app/riesgo/${idRiesgo}/delete`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function createAccion(idProyecto, data) {
    const url = `${HOST}/calidad/riesgos_app/${idProyecto}/accion/create`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function updateAccion(idAccion, data) {
    const url = `${HOST}/calidad/riesgos_app/accion/${idAccion}/update`;
    const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function deleteAccion(idAccion) {
    const url = `${HOST}/calidad/riesgos_app/accion/${idAccion}/delete`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

export async function updatePresupuesto(idProyecto, data){
    const url = `${HOST}/calidad/riesgos_app/proyecto/${idProyecto}/presupuesto`;
    await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}