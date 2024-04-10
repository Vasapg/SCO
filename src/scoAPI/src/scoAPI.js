let API = null;

/**
 * 
 * @param {win} win is the window element of a DOM  
 * @returns The API if it is found, null otherwise.
 */
sco.getAPI = function (win) 
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
sco.initAPI = function () 
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
    return (API);
}

/**
 * Finish the interaction of the API by setting the activity as completed.
 * @returns 1 if successfull, 0 otherwise.
 */
sco.finishAPI = function () 
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
sco.setGrade = function (score)
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

sco.setMaxGrade = function (score)
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

sco.setMinGrade =  function (score)
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
 * Allows to mantain run time information when the activity is ended or exit and be recovered when access again.
 * @returns 1 if successfull, 0 otherwise.
 */

sco.suspendSession = function()
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.LMSSetValue("cmi.core.exit", "suspend");
    console.info("exit set to suspend ");
    return (1);
}

/**
 * Allows to end and dump all run time information when the activity is ended or exit.
 * @returns 1 if successfull, 0 otherwise.
 */

sco.logoutSession = function()
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.set("cmi.core.exit", "logout");
    console.info("exit set to logout ");
    return (1);
}

/**
 * 
 * @param {URL, parameters} URL is the the objective of the fetch, if specified, parameters is an array which defines what to retrieve from the xml document
 * and store in the localStorage
 * @returns 1 if successfull, 0 otherwise.
 */

sco.getDocumentXML = function (URL, parameters){
    console.log("getDocumentXML started with URL: " + URL);
    fetch(URL)
    .then(response => response.text())
    .then(data => {
        console.info("XML Document was retrieved successfully")
        var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
        if (!parameters || parameters == null)
            return (xmlDoc);
        // If parameters are provided, find the tags in the XML document
        parameters.forEach(parameter => {
            console.log("Processing parameter: " + parameter);
            let tags = xmlDoc.getElementsByTagName(parameter);
            if (!tags || tags == null)
            {
                console.warn("Parameter: " + parameter + " not found");
                return;
            }
            let tagObjects = Array.from(tags).map(tag => {
                let obj = {};
                Array.from(tag.attributes).forEach(attr => {
                    obj[attr.name] = attr.value;
                });
                return obj;
            });
            // Save the tag objects in local storage
            localStorage.setItem(parameter, JSON.stringify(tagObjects));
            console.log("Saved parameter " + parameter + " to local storage");
        });
    })
    .catch(error => console.error("Error in getDocumentXML: ", error));
}

/**
 * 
 * @param {URL, parameters} URL is the the objective of the fetch, if specified, parameters is an array which defines what to retrieve from the JSON document
 * and store in the localStorage as JavaScript Objects.
 * @returns 1 if successfull, 0 otherwise.
 */

sco.getDocumentJSON = function (URL, parameters){
    console.log("getDocumentJSON started with URL: " + URL);

    function findInObject(obj, key) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }
        for (const element of Object.keys(obj)) {
            let found = findInObject(obj[element], key);
            if (found) {
                return found;
            }
        }
        return null;
    }

    fetch(URL)
    .then(response => response.json())
    .then(data => {
        console.info("JSON Document was retrieved successfully")

        // If parameters are provided, find the keys in the JSON document
        parameters.forEach(parameter => {
            console.log("Processing parameter: " + parameter);
            let value = findInObject(data, parameter);

            if (value !== null) {
                // Save the value in local storage
                localStorage.setItem(parameter, JSON.stringify(value));
                console.log("Saved parameter " + parameter + " to local storage");
            } else {
                console.warn("Parameter: " + parameter + " not found");
            }
        });
    })
    .catch(error => console.error("Error in getDocumentJSON: ", error));
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
  