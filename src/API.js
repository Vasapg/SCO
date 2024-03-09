let API = null;

function FindAPI(win) 
{
    var nFindAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        nFindAPITries ++;
        if (nFindAPITries > 500) {
            alert("Error in finding API -- too deeply nested.");
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

function init() 
{
    API = null;
    if ((window.parent) && (window.parent != window)){
        API = FindAPI(window.parent);
    } 
    if ((API == null) && (window.opener != null)){
        API = FindAPI(window.opener); 
    } 
    if (API == null) { 
        alert("No API adapter found"); 
    } 
    else { 
        API.LMSInitialize(""); 
    }
    if (API != null)
        console.log('API encontrada')
    else
        console.log('API no encontrada')
}

function finish() 
{
    var API = FindAPI(window);
    if (API != null) { 
        API.LMSSetValue("cmi.core.lesson_status","completed");
        API.LMSSetValue("cmi.core.score.max", "");
        API.LMSSetValue("cmi.core.score.min", "0");
        API.LMSSetValue("cmi.core.score.raw", "10");
        API.LMSFinish("");
    } 
}

window.onload = init();

// Variable de JavaScript para almacenar el texto
var texto = API.LMSGetValue("cmi.texto");


// Función para guardar el texto en la API de SCORM
function guardarTexto() {
    var nuevoTexto = document.getElementById("input-text").value;

    // Suponiendo que "api" es un objeto que representa la API de SCORM
    // y que tiene un método "guardarTexto" para guardar el texto en la API
    // Esta parte del código puede variar dependiendo de la implementación de SCORM
    API.LMSSetValue("cmi.texto", nuevoTexto);
    API.LMSCommit("");
    console.log("Error API: " + API.LMSGetLastError());
    console.log("Error API: " + API.LMSGetErrorString()());
    // Actualizar la variable de JavaScript con el nuevo texto
    texto = nuevoTexto;
}