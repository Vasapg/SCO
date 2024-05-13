# SCO: SCORM Content Automation

SCO is a comprehensive package designed to automate the development and deployment of SCORM content. It consist of a set of python scritps to manage the imsmanifest.xml file and a javaScript library to simplify SCORM's API managament.

## Table of Contents

- [Installation](#installation)
- [scocli](#scocli)
- [scoapi](#scoapi)
- [First Steps](#firstSteps)
- [License](#license)

## Installation

To install the SCO package, follow the steps below:

```bash
$ pip install scocli 
```
If facing the next problem while installing:

![Externally manage enviroment](docs/Images/ExternallyManageError.png)

create a virtual enviroment and activate with:

```bash
$ virtualenv myenv
$ source myenv/bin/activate
```
And then try to use pip install again

## scocli
scocli is a package of python scripts to manage the imsmanifest.xml file which defines a SCORM application. The available script are:

### build
build.py allows you to create a SCORM application as a template, installing algo the javaScript API library. The structure of the template is as follows:

```
./SCORM_application
├── index.html
├── package-lock.json
├── html/
├── images/
├── package.json
├── imsmanifest.xml
├── node_modules/
│   ├── scoapi/
│   │   ├── scoAPI.js
│   │   ├── .babelrc
│   │   └── package.json
│   └── .package-lock.json
├── javascript/
│   └── APIinit.js
└── css/
```

The main elements here are:
* imsmanifest.xml: Is the file which our package will interact with
* node_module: Is where or API library is stored, for it to be used, it must be importated:
```javascript
<script src = "node_modules/scoapi/scoAPI.js"> </script>
```

### addResource

Create a new resource in the SCORM manifest, and also adds a new element to the organization, which refers to the new resource.

#### Usage

Run it from the command line and pass the paths of the files you want to add to the new resource in the `imsmanifest.xml`. For example:

```bash
python script.py file1.html file2.css -i [identifier]
```
Then, you will be prompted to add an identifier for the new resource and a title. Do not declare two resource with the same identifier.

If you provide an identifier, then the files selected will be added to the already created resource.

### removeResource

Deletes a resource from the manifest, deleting all the organization items that refer to the destroyed resource.

#### Usage

Run it from the command line and specifie the identifier of the resource to be deleted
```bash
removeResource.py identifier
```

### seeManifest

Prints the manifest in a pretiffy format

#### Usage

Run it from the terminal in the imsmanifest.xml directory.

```bash
seeManifest.py
```

