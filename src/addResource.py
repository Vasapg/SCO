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

def add_resource_to_imsmanifest(file_path):
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

    # Agregar un nuevo recurso
    resources = root.find("./{http://www.imsglobal.org/xsd/imscp_v1p1}resources")
    resource = ET.SubElement(resources, "{http://www.imsglobal.org/xsd/imscp_v1p1}resource")
    resource.set("identifier", os.path.basename(file_path))
    resource.set("type", "webcontent")
    resource.set("{http://www.adlnet.org/xsd/adlcp_v1p3}scormType", "sco")
    resource.set("href", os.path.basename(file_path))

    file = ET.SubElement(resource, "{http://www.imsglobal.org/xsd/imscp_v1p1}file")
    file.set("href", os.path.basename(file_path))

    # Escribir el árbol XML en el archivo imsmanifest.xml con formato legible
    with open(xml_file, "wb") as f:
        f.write(prettify_xml(root).encode('utf-8'))

    print(f"Recurso {file_path} añadido al archivo imsmanifest.xml.")

if __name__ == "__main__":
    # Verificar que se pasó el argumento correctamente
    if len(sys.argv) != 2:
        print("Uso: python script.py <archivo>")
        sys.exit(1)

    file_path = sys.argv[1]

    # Verificar si el archivo a agregar como recurso existe
    if not os.path.exists(file_path):
        print("El archivo a agregar como recurso no existe.")
        sys.exit(1)

    # Agregar el recurso al imsmanifest.xml
    add_resource_to_imsmanifest(file_path)
