/* global describe, it */
'use strict';

const assert = require('assert');
const exec = require('child_process').exec;
const path = require('path');


describe('pay-to-contract bin', function() {
  var cmd = 'node ' + path.join(__dirname, '../bin/ptc') + ' ';
  console.log(cmd);

  it('--help should run without errors', function(done) {
    exec(cmd + '--help', function(error, stdout, stderr) {
      assert(!error);
      done();
    });
  });

  it('--version should run without errors', function(done) {
    exec(cmd + '--version', function(error, stdout, stderr) {
      assert(!error);
      done();
    });
  });

  it('should return error on missing command', function(done) {
    this.timeout(4000);

    exec(cmd, function(error, stdout, stderr) {
      assert(error);
      assert.equal(error.code, 1);
      done();
    });
  });

  it('should return error on unknown command', function(done) {
    this.timeout(4000);

    exec(cmd + 'junkcmd', function(error, stdout, stderr) {
      assert(error);
      assert.equal(error.code, 1);
      done();
    });
  });
});
