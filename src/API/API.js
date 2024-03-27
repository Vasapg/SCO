let API = null;

/**
 * 
 * @param {win} win is the window element of a DOM  
 * @returns The API if it is found, null otherwise.
 */
function getAPI(win) 
{
    var nFindAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        nFindAPITries ++;
        if (nFindAPITries > 500) {
            console.error("Error in finding API -- too deeply nested.");
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

/**
 * init function is used to initialize the API, it should be called at the beginning of the application.
 * @returns 1 if successfull, 0 otherwise.
*/
function initAPI() 
{
    API = null;
    if ((window.parent) && (window.parent != window)){
        API = getAPI(window.parent);
    } 
    if ((API == null) && (window.opener != null)){
        API = getAPI(window.opener); 
    } 
    if (API == null) { 
        console.error("No API adapter found"); 
    } 
    else { 
        API.LMSInitialize(""); 
    }
    if (API != null)
        console.info('API found')
    else
        console.error('API not found')
}

/**
 * Finish the interaction of the API by setting the activity as completed.
 * @returns 1 if successfull, 0 otherwise.
 */
function finishAPI() 
{
    var API = getAPI(window);
    if (API != null) { 
        API.LMSSetValue("cmi.core.lesson_status","completed");
        API.LMSFinish("");
        return (1);
    }
    return (0);
}

/**
 * 
 * @param {score} score is the max score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */
function setScore(score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.LMSSetValue("cmi.core.score.raw", score);
    console.info("Score set to: " + score);
    return (1);
}

/**
 * 
 * @param {score} score is the max score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */

function setMaxScore(score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (0);
    }
    API.LMSSetValue("cmi.core.score.max", score);
    console.info("Max score set to: " + score);
    return (1);
}

/**
 * 
 * @param {score} score is the minimum score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */

function setMinScore(score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.LMSSetValue("cmi.core.score.min", score);
    console.info("Min score set to: " + score);
    return (1);
}

/**
 * 
 * @param {URL, parameters} URL is the the objective of the fetch, if specified, parameters is an array which defines what to retrieve from the xml document
 * and store in the localStorage
 * @returns 1 if successfull, 0 otherwise.
 */

function getDocument(URL, parameters){
    fetch(URL)
    .then(response => response.text())
    .then(data => {
        console.info("Document was retrived successffully")
		var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
        if (!parameters || parameters == null)
            return (xmlDoc);
	})
	.catch(error => console.error(error));
}

// function getConfig() {
//     return fetch("https://raw.githubusercontent.com/Vasapg/PIE-SCORM/main/Self-Assesment-4/exercises/config.xml")
//       .then(response => response.text())
//       .then(data => {	
//         var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
//         localStorage.setItem("nEjercicio", 0);
//         localStorage.setItem("maxEjercicio", parseInt(xmlDoc.getElementsByTagName("numExercises")[0].childNodes[0].nodeValue));
//         var titulos = [];
//         var urls = [];
        
//         // obtiene todas las etiquetas "title" y "url"
//         var titleTags = xmlDoc.getElementsByTagName("title");
//         var urlTags = xmlDoc.getElementsByTagName("url");
//         console.log(titleTags);
//         console.log(urlTags);
//         console.log("bruh");
        
//         // itera sobre las etiquetas y guarda los contenidos en los arrays
//         for (var i = 0; i < titleTags.length; i++) 
//         {
//           titulos.push(titleTags[i].textContent);
//           urls.push(urlTags[i].textContent);
//         }
//         console.log(titulos);
//         console.log(urls);
//         localStorage.setItem("urls", JSON.stringify(urls));
//         localStorage.setItem("titulos", JSON.stringify(titulos));
//       });
//   }
  