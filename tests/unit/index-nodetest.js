'use strict';

var assert = require('ember-cli/tests/helpers/assert');

describe('the index', function() {
  var subject;

  before(function() {
    subject = require('../../index');
  });

  it('has a name', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(result.name, 'test-plugin');
  });

  it('implements the correct hooks', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(typeof result.didBuild, 'function');
  });

  describe('willDeploy hook', function() {
    it('resolves if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'tag'
      });

      var context = {
        deployment: {
          ui: {
            write: function() {},
            writeLine: function() {}
          },
          config: {
            tag: {
              type: 'index-hash',
              filePattern: 'eeee'
            }
          }
        }
      };

      return assert.isFulfilled(plugin.willDeploy.call(plugin, context))
    });
  });

  describe('didBuild hook', function() {
    it ('returns the tag data', function() {
      var plugin = subject.createDeployPlugin({
        name: 'tag'
      });

      var context = {
        distDir: process.cwd() + '/tests/fixtures',
        distFiles: ['index.html'],
        deployment: {
          ui: {
            write: function() {},
            writeLine: function() {}
          },
          config: {
            tag: {
              type: 'index-hash',
              filePattern: 'index.html'
            },
          }
        }
      };

      return assert.isFulfilled(plugin.didBuild.call(plugin, context))
        .then(function(result) {
          assert.equal(result.tag, 'ae1569f72495012cd5e8588e0f2f5d49');
        });
    });
  });
});

