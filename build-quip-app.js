#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs');

const semver = require('semver');
const commandLineArgs = require('command-line-args')
require('dotenv').config();

const definitions = [
  { name: 'command', defaultOption: true },
];
const options = commandLineArgs(definitions, { stopAtFirstUnknown: true });

if (!options.command) {
  console.error('build-quip-app: you must supply a build command');
  process.exit(1);
}

switch (options.command) {
  case 'build':
    buildQuip(options._unknown);
    break;
  case 'version':
    changeVersion(options._unknown);
    break;
  case 'vue':
    configureForVue(options._unknown);
    break;
  default:
    console.error(`build-quip-app: unknown build command '${options.command}'`);
    process.exit(1);
}

function buildQuip(args) {
  const definitions = [
    {
      name: 'manifest', alias: 'm', defaultValue: './app/manifest.json'
    },
    {
      name: 'output', alias: 'o', defaultValue: './app/manifest.json'
    },
    {
      name: 'no-increment', type: Boolean,
    },
    {
      name: 'no-build', type: Boolean,
    },
    {
      name: 'app-id', type: String,
    },
    {
      name: 'version-name', type: String,
    },
    {
      name: 'version-number', type: Number,
    },
    {
      name: 'build-command', type: String, default: 'npm run build',
    }
  ];
  const options = commandLineArgs(definitions, { argv: args, stopAtFirstUnknown: true });
  const manifest = require(options.manifest);
  manifest.id = process.env.QUIP_APP_ID || options['app-id'] || manifest.id;
  manifest.version_name = process.env.QUIP_VERSION_NAME || options['version-name'] || manifest.version_name;
  if (!options['no-increment']) {
    manifest.version_number = process.env.QUIP_VERSION_NUMBER || options['version-number'] || (manifest.version_number + 1);
    console.log(`build-quip-app: the new version number is ${manifest.version_number}`);
  }
  fs.writeFileSync(options.output || options.manifest, JSON.stringify(manifest, null, 4));
  if (!options['no-build']) {
    childProcess.execSync(options['build-command']);
  }
}

function changeVersion(args) {
  const VERSION_LEVELS = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];

  const definitions = [
    {
      name: 'manifest', alias: 'm', defaultValue: './app/manifest.json'
    },
    {
      name: 'output', alias: 'o', defaultValue: './app/manifest.json'
    },
    {
      name: 'version-name', type: String, defaultOption: true
    },
  ];
  const options = commandLineArgs(definitions, { argv: args, stopAtFirstUnknown: true });
  const manifest = require(options.manifest);
  const versionName = manifest.version_name;
  const increment = (options['version-name'] || '').toLowerCase().trim();
  if (!increment) {
    console.log(`build-quip-app: no version-name has been provided`);
    process.exit(0);
  }

  if (VERSION_LEVELS.find((item) => item === increment)) {
    if (!semver.valid(versionName)) {
      console.error(`build-quip-app: ${versionName} is not in semver format`);
      process.exit(1);
    }
    const newVersionName = semver.inc(versionName, increment, { loose: true });
    manifest.version_name = newVersionName;
  } else {
    if (increment === '' || increment === 'version') {
      console.error(`build-quip-app: version name must be one of ${VERSION_LEVELS.join(', ')} or the new version name`)
      process.exit(1);
    }
    manifest.version_name = increment;
  }

  console.log(`build-quip-app: the new version name is ${manifest.version_name}`);
  fs.writeFileSync(options.output || options.manifest, JSON.stringify(manifest, null, 4));
}

function configureForVue() {

}