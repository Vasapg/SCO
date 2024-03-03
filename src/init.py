#coding=utf-8
import xml.etree.ElementTree as ET
import os
import xml.dom.minidom


def create_javascript_file(project_name):
    javascript_code = """function FindAPI(win) 
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
    var API = null;
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

window.onload = init();"""

    # Escribir el código JavaScript en el archivo javascript.js
    with open(project_name + "/Scripts/javascript.js", "w") as f:
        f.write(javascript_code)

    print("Archivo javascript.js creado con éxito.")


def create_imsmanifest(project_title):
    # Crear el elemento raíz <manifest>
    identifier = project_title.replace(" ", "_")
    root = ET.Element("manifest")
    root.set("xmlns", "http://www.imsglobal.org/xsd/imscp_v1p1")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("xmlns:adlcp", "http://www.adlnet.org/xsd/adlcp_v1p3")
    root.set("xmlns:adlseq", "http://www.adlnet.org/xsd/adlseq_v1p3")
    root.set("xmlns:adlnav", "http://www.adlnet.org/xsd/adlnav_v1p3")
    root.set("xmlns:imsss", "http://www.imsglobal.org/xsd/imsss")
    root.set("identifier", identifier)
    root.set("version", "1")
    root.set("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd")

    # Agregar la sección <metadata>
    metadata = ET.SubElement(root, "metadata")
    schema = ET.SubElement(metadata, "schema")
    schema.text = "ADL SCORM"
    schemaversion = ET.SubElement(metadata, "schemaversion")
    schemaversion.text = "2004 3rd Edition"

    # Agregar la sección <organizations>
    organizations = ET.SubElement(root, "organizations")
    organizations.set("default", identifier + "_organization")
    organization = ET.SubElement(organizations, "organization")
    organization.set("identifier", identifier + "_org")
    title = ET.SubElement(organization, "title")
    title.text = project_title
    item = ET.SubElement(organization, "item")
    item.set("identifier", "item_1")
    item.set("identifierref", "resource_1")
    title = ET.SubElement(item, "title")
    title.text = project_title

    # Agregar la sección <resources>
    resources = ET.SubElement(root, "resources")
    resource = ET.SubElement(resources, "resource")
    resource.set("identifier", "resource_1")
    resource.set("type", "webcontent")
    resource.set("{http://www.adlnet.org/xsd/adlcp_v1p3}scormType", "sco")
    resource.set("href", "index.html")
    file = ET.SubElement(resource, "file")
    file.set("href", "index.html")

    # Crear el árbol XML
    tree = ET.ElementTree(root)

    # Convertir el árbol XML a una cadena de texto con formato
    xml_string = ET.tostring(root, encoding="utf-8")
    reparsed = xml.dom.minidom.parseString(xml_string)
    pretty_xml = reparsed.toprettyxml(indent="    ")  # Establece la indentación a 4

    # Escribir el árbol XML en el archivo imsmanifest.xml
    with open(project_name + "/imsmanifest.xml", "wb") as f:
        f.write(pretty_xml.encode("utf-8"))
    print("Archivo imsmanifest.xml creado con éxito.")


def create_scorm_project(project_name):
    # Define folder names
    folders = ['images', 'scripts', 'styles', 'data']

    # Create project folder
    os.mkdir(project_name)
    print(f"Created '{project_name}' folder.")

    # Create subfolders
    for folder in folders:
        folder_path = os.path.join(project_name, folder)
        os.mkdir(folder_path)
        print(f"Created '{folder}' folder.")

    # Create index.html file
    index_html = os.path.join(project_name, 'index.html')
    with open(index_html, 'w') as f:
        f.write('<!DOCTYPE html>\n<html>\n<head>\n<title>SCORM Project</title>\n</head>\n<body>\n<h1>Welcome to my SCORM project!</h1>\n</body>\n</html>')
    print("Created 'index.html' file.")
    create_imsmanifest(project_name)
    create_javascript_file(project_name)

    print("SCORM project structure created successfully.")

if __name__ == "__main__":
    project_name = input("Enter project name: ")
    create_scorm_project(project_name)