var nock, should, wd;

wd = require('../common/wd-with-cov');

nock = require('nock');

should = require('should');

describe("wd", function() {
  describe("unit", function() {
    describe("callback tests", function() {
      var server;
      server = null;
      before(function(done) {
        server = nock('http://127.0.0.1:5555').filteringRequestBody(/.*/, '*');
        if (process.env.WD_COV === null) {
          server.log(console.log);
        }
        server.post('/wd/hub/session', '*').reply(303, "OK", {
          'Location': '/wd/hub/session/1234'
        });
        done(null);
      });
      describe("simplecallback empty returns", function() {
        var browser;
        browser = null;
        describe("browser initialization", function() {
          it("should initialize browser", function(done) {
            browser = wd.remote({
              port: 5555
            });
            browser.init({}, function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe("simplecallback with empty return", function() {
          it("should get url", function(done) {
            server.post('/wd/hub/session/1234/url', '*').reply(200, "");
            browser.get("www.google.com", function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe("simplecallback with 200 OK", function() {
          it("should get url", function(done) {
            server.post('/wd/hub/session/1234/url', '*').reply(200, "OK");
            browser.get("www.google.com", function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe("simplecallback with empty JSON data", function() {
          it("should get url", function(done) {
            server.post('/wd/hub/session/1234/url', '*').reply(200, '{"sessionId":"1234","status":0,"value":{}}');
            browser.get("www.google.com", function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
      });
    });
  });
});
