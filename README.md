# mxbuild.docker
Mendix Build Docker Helper/Commandline Utility

## Usage: ToDo

## Downloading a distribution
`ts-node src/index.ts --download-version 8.1.1`

## Distribution location
Most of the distribution files are uploaded to a temporary private server hosted at files.herman.codes,
but these files can be hosted anywhere and updated in the ${project-folder}/artefacts/versions.json

```json
{
  "versions": [
    {
      "version": "8.1.1",
      "modelerUrl": "http://files.herman.codes/mx-files/mendix-8.1.1.58432.zip",
      "dockerImage": "ubuntu:19.10",
      "javaVersion": 11
    },
    {
      "version": "6.10.10",
      "modelerUrl": "http://files.herman.codes/mx-files/mendix-6.10.10.zip",
      "dockerImage": "gizmotronic/oracle-java:java8",
      "javaVersion": 8
    }
  ]
}
```

Once a version is downloaded, it unzips the content in ${project-folder}/tmp which is the same folder 
containing the zip-file.