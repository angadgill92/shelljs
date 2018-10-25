#!/usr/bin/env node
var childProcess = require('child_process');
// Note: can't use 3P modules or shelljs, because this must run before we
// download dependencies.

function Version(components) {
  this.components = components;
}

Version.prototype.isAtLeast = function (other) {
  if (this.components.length !== 3 || other.components.length !== 3) {
    throw new Error('version numbers must have 3 components.');
  }
  for (var k = 0; k < this.components.length; k++) {
    if (this.components[k] > other.components[k]) return true;
    if (this.components[k] < other.components[k]) return false;
  }
  // At this point, the components must be equal.
  return true;
};

var npmVersionComponents = childProcess.spawnSync('npm', ['--version'])
  .stdout.toString().trim().split('.').map(function (str) {
    return parseInt(str, 10);
  });
var npmVersion = new Version(npmVersionComponents);
var minimumVersionWithNpmCi = new Version([5, 7, 0]);

var subcommand = npmVersion.isAtLeast(minimumVersionWithNpmCi) ?
  'ci' :
  'install';

console.log('Executing `npm ' + subcommand + '`');
// Async. Node waits until this is finished.
childProcess.spawn('npm', [subcommand], { stdio: 'inherit' });
