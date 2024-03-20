import os
import sys
import xml.etree.ElementTree as ET
import xml.dom.minidom

def prettify_xml(elem):
    """Retorna una versión con formato legible del elemento XML"""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = xml.dom.minidom.parseString(rough_string)
    lines = []
    for node in reparsed.childNodes:
        if node.nodeType == node.COMMENT_NODE:
            lines.append("<!--{}-->".format(node.data))
        else:
            lines.append(node.toxml())
    return "\n".join(lines)

def add_resource_to_imsmanifest(files):
    # Buscar el archivo imsmanifest.xml en el directorio actual
    current_directory = os.getcwd()
    xml_file = os.path.join(current_directory, "imsmanifest.xml")

    # Verificar si el archivo XML existe
    if not os.path.exists(xml_file):
        print("El archivo imsmanifest.xml no se encuentra en el directorio actual.")
        sys.exit(1)

    # Parsear el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Encontrar o crear el elemento de recursos
    resources = root.find("./{http://www.imsglobal.org/xsd/imscp_v1p1}resources")
    if resources is None:
        resources = ET.SubElement(root, "{http://www.imsglobal.org/xsd/imscp_v1p1}resources")

    # Verificar si el resource ya existe
    existing_resource = resources.find(f"./{{http://www.imsglobal.org/xsd/imscp_v1p1}}resource[@identifier='{os.path.basename(files[0])}']")
    if existing_resource is not None:
        # El resource ya existe, agregar solo los archivos que faltan
        for file_path in files:
            file_name = os.path.basename(file_path)
            existing_file = existing_resource.find(f"./{http://www.imsglobal.org/xsd/imscp_v1p1}file[@href='{file_name}']")
            if existing_file is None:
                file_element = ET.SubElement(existing_resource, "{http://www.imsglobal.org/xsd/imscp_v1p1}file")
                file_element.set("href", file_name)
                file_element.tail = '\n'  # Agregar salto de línea después de la etiqueta <file>
        existing_resource.tail = '\n'  # Agregar salto de línea después de la etiqueta <resource>
    else:
        # El resource no existe, crear uno nuevo y agregar archivos
        new_resource = ET.SubElement(resources, "{http://www.imsglobal.org/xsd/imscp_v1p1}resource")
        new_resource.set("identifier", os.path.basename(files[0]))
        new_resource.set("type", "webcontent")
        new_resource.set("{http://www.adlnet.org/xsd/adlcp_v1p3}scormType", "sco")
        for file_path in files:
            if not os.path.exists(file_path):
                print("El archivo " + file_path + " no existe")
                sys.exit(1)
            file_name = os.path.basename(file_path)
            file_element = ET.SubElement(new_resource, "{http://www.imsglobal.org/xsd/imscp_v1p1}file")
            file_element.set("href", file_name)
            file_element.tail = '\n'  # Agregar salto de línea después de la etiqueta <file>
        new_resource.tail = '\n'  # Agregar salto de línea después de la etiqueta <resource>

    # Escribir el árbol XML en el archivo imsmanifest.xml con formato legible
    with open(xml_file, "wb") as f:
        f.write(prettify_xml(root).encode('utf-8'))

    print(f"Archivos {', '.join(files)} añadidos al archivo imsmanifest.xml.")

if __name__ == "__main__":
    # Verificar que se pasó al menos un argumento
    if len(sys.argv) < 2:
        print("Uso: python script.py <archivo1> <archivo2> ...")
        sys.exit(1)

    files = sys.argv[1:]

    # Verificar si los archivos existen
    for file_path in files:
        if not os.path.exists(file_path):
            print(f"El archivo {file_path} no existe.")
            sys.exit(1)

    # Agregar los archivos al imsmanifest.xml
    add_resource_to_imsmanifest(files)
