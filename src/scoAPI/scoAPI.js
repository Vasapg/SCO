var nFindAPITries = 0;
var API = null;
var maxTries = 500;
/**
 * getAPI function attempts to find the SCORM API in the window hierarchy.
 * @param {Window} win - The window to start searching for the API.
 * @returns {object|null} - The SCORM API object if found, otherwise null.
 */
function getAPI(win) {
    while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win))
    {
       nFindAPITries++;
       if (nFindAPITries > maxTries)
       {
          return null;
       }
       win = win.parent;
    }
    return win.API_1484_11;
}

/**
 * initAPI function initializes the SCORM API.
 * @returns {object|null} - The initialized SCORM API object if successful, otherwise null.
 */
function initAPI() {
    var API = null;
    // Attempt to find API in parent window
    if ((window.parent) && (window.parent != window)) {
        API = getAPI(window.parent);
    }
    // If not found in parent window, try to find it in opener window (for popup windows)
    if ((API == null) && (window.opener != null)) {
        API = getAPI(window.opener);
    }
    // If API found, initialize it
    if (API != null) {
        var result = API.Initialize(""); // Initialize the API
        console.log("API initialized:", result);
        console.info('API found');
    } else {
        console.error('API not found');
    }
    return API; // Return the initialized API object or null
}


/**
 * Finish the interaction of the API by setting the activity as completed.
 * @returns 1 if successfull, 0 otherwise.
 */
function finishAPI() 
{
    if (API == null || API == undefined)
        API = getAPI(window);
    if (API != null) { 
        API.SetValue("cmi.completion_status","completed");
        API.Commit("");
        API.Terminate("");
        return (1);
    }
    return (0);
}

/**
 * 
 * @param {score} score is the max score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */
function setGrade(score)
{
    if (API == null || API == undefined)
        API = getAPI(window);
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.SetValue("cmi.score.raw", score);
    API.Commit("");
    console.info("Score set to: " + score);
    return (1);
}

/**
 * 
 * @param {score} score is the max score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */

function setMaxGrade (score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (0);
    }
    API.SetValue("cmi.score.max", score);
    API.Commit("");
    console.info("Max score set to: " + score);
    return (1);
}

/**
 * 
 * @param {score} score is the minimum score of the lesson to be set.
 * @returns 1 if successfull, 0 otherwise.
 */

function setMinGrade(score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.SetValue("cmi.score.min", score);
    API.Commit("");
    console.info("Min score set to: " + score);
    return (1);
}

/**
 * 
 * Allows to mantain run time information when the activity is ended or exit and be recovered when access again.
 * @returns 1 if successfull, 0 otherwise.
 */

function suspendSession()
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.SetValue("cmi.exit", "suspend");
    API.Commit("");
    console.info("exit set to suspend ");
    return (1);
}

/**
 * Allows to end and dump all run time information when the activity is ended or exit.
 * @returns 1 if successfull, 0 otherwise.
 */

function logoutSession()
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.SetValue("cmi.exit", "logout");
    API.Commit("");
    console.info("exit set to logout ");
    return (1);
}

/**
 * 
 * @param {URL, parameters} URL is the the objective of the fetch, if specified, parameters is an array which defines what to retrieve from the xml document
 * and store in the localStorage
 * @returns 1 if successfull, 0 otherwise.
 */

async function getDocumentXML(URL, parameters){
    console.log("getDocumentXML started with URL: " + URL);
    return new Promise((resolve, reject) => {
        fetch(URL)
        .then(response => response.text())
        .then(data => {
            console.info("XML Document was retrieved successfully")
            var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
            if (!parameters || parameters == null)
                resolve(xmlDoc);
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
            resolve(xmlDoc);
        })
        .catch(error => {
            console.error("Error in getDocumentXML: ", error);
            reject(error);
        });
    });
}

/**
 * 
 * @param {URL, parameters} URL is the the objective of the fetch, if specified, parameters is an array which defines what to retrieve from the JSON document
 * and store in the localStorage as JavaScript Objects.
 * @returns 1 if successfull, 0 otherwise.
 */

async function getDocumentJSON(URL, parameters){
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
    return new Promise((resolve, reject) => {
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.info("JSON Document was retrieved successfully")
            console.info('dos:' + data);
            // If parameters are provided, find the keys in the JSON document
            if (!parameters || parameters == null)
                resolve(data);
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
            resolve(data);
        })
        .catch(error => {
            console.error("Error in getDocumentJSON: ", error);
            reject(error);
        });
    });
}
 
// Exporting multiple functions
// module.exports = {
//     getDocumentJSON,
//     getDocumentXML,
//     initAPI,
//     finishAPI,
//     setGrade,
//     setMaxGrade,
//     setMinGrade,
//     suspendSession,
//     logoutSession
// };