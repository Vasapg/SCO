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
 * init function is used to initialize the API, it should be called at the beginning of the course.
*/
function initializeSCORM() 
{
    API = null;
    if ((window.parent) && (window.parent != window)){
        API = FindAPI(window.parent);
    } 
    if ((API == null) && (window.opener != null)){
        API = FindAPI(window.opener); 
    } 
    if (API == null) { 
        console.error("No API adapter found"); 
    } 
    else { 
        API.LMSInitialize(""); 
    }
    if (API != null)
        console.info('API encontrada')
    else
        console.error('API no encontrada')
}

function setMaxScore(score)
{
    if (API == null)
    {
        console.error("API is not initialized");
        return (-1);
    }
    API.LMSSetValue("cmi.core.score.max", score);
    console.info("Max score set to: " + score);
    return (1);
}

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
*/

function finishSCORM() 
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