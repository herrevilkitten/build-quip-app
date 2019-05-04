# build-quip-app
`build-quip-app` is a utility that makes it easier to  develop [Quip Live Apps](https://salesforce.quip.com/dev/liveapps/) by providing additional functionality and wrapping around the default build process.

## Updating the Version Name
The `version` command makes it easy to update the version name in a Quip manifest.  The command can use [semantic versioning](https://semver.org/) with the [semver](https://www.npmjs.com/package/semver) module or a custom version can be supplied.
```
build-quip-app version <version> <options>
```

If the manifest's version name is already in semantic versioning format, then `<version>` can be of 
```
major
minor
patch
premajor
preminor
prepatch
prerelease
```
to automatically update the version name appropriately.  For example, if the version name is `1.2.3` and the given version is `minor`, the new version name will be `1.3.0`.

If the manifest's versiona name is NOT in semantic versioning format, it will be set to whatever is given in `<version>`.  This may cause confusion if a semantic versioning name is used and the manifest is not configured appropriately.  In this case, a warning will be printed to the console for clarification.

### Options
Name|Description
------|-----------
`--manifest`|location of the manifest file to read from (default: `./app/manifest.json`)
`--output`|location of the manifest file to write to (default: `./app/manifest.json`)

### Environment Variables
Name|Description
----|-----------
`QUIP_VERSION_NAME`|Can be used instead of supplying the version name on the command line.

### Building a Live App
The `build` command is used to build the Live App.  It does modifying the manifest file and then running a defined build command (default: `npm run build`).  The most important modification that it makes to the manifest is updating the `version_number`.  It also supports modifying the live app's `id` and its `version_name`.  Note that version name changes are better handled with the [version](#Updating the Version Name) command.

```
build-quip-app build <options>
```

##### Version Numbers
By default, `build-quip-app` will take the `version_number` from the manifest and increment it by 1.  This behavior can be controlled with command-line options and environment variables.  With the `--version-number` option and `QUIP_VERSION_NUMBER` environment variable, the value can be set directly. The `--no-increment` option can be used to suppress the auto-incrementing.

For example, if the `version_number` in the manifest is 1
```
build-quip-app build
```
will set it to 2.
```
build-quip-app build --no-increment
```
will keep it at 1.
```
build-quip-app build --version-number=10
```
will set it to 10.
```
QUIP_VERSION_NUMBER=10 build-quip-app build
```
will also set it to 10.

---

### Options
Name|Description
------|-----------
`--manifest`|location of the manifest file to read from (default: `./app/manifest.json`)
`--output`|location of the manifest file to write to (default: `./app/manifest.json`)
`--no-increment`|Do not increment the version number during the build
`--no-build`|Do not run the build command
`--app-id`|Set the `id` in the manifest to the given value
`--version-name`|Set the `version_name` in the manifest to the given value
`--version-number`|Set the `version_number` in the manifest to the given value
`--build-command`|The command that is run after the manifest changes to build the Live App (default: `npm run start`)

### Environment Variables
Name|Description
----|-----------
`QUIP_APP_ID`|Can be used instead of supplying the app ID on the command line.
`QUIP_VERSION_NAME`|Can be used instead of supplying the version name on the command line.
`QUIP_VERSION_NUMBER`|Can be used instead of supplying the version number on the command line.