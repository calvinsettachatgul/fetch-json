// Mocha Specification Cases

const fs =        require('fs');
const assert =    require('assert');
const { JSDOM } = require('jsdom');

const scripts = ['node_modules/whatwg-fetch/fetch.js', './fetch-json.js'];
const window = new JSDOM('', { runScripts: 'outside-only' }).window;
function loadScript(file) { window.eval(fs.readFileSync(file).toString()); }
scripts.forEach(loadScript);
const fetchJson = window.fetchJson;

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Module browser-fetch-json', () => {

   it('loads as an object', () => {
      const actual =   typeof fetchJson;
      const expected = 'object';
      assert.equal(actual, expected);
      });

   it('has functions for get(), post(), put(), patch(), and delete()', () => {
      const actual =   {
         get:    typeof fetchJson.get,
         post:   typeof fetchJson.post,
         put:    typeof fetchJson.put,
         patch:  typeof fetchJson.patch,
         delete: typeof fetchJson.delete
         };
      const expected = {
         get:    'function',
         post:   'function',
         put:    'function',
         patch:  'function',
         delete: 'function'
         };
      assert.deepEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Google Books API search result for "spacex" fetched by fetchJson.get()', () => {

   it('contains the correct "kind" value and "totalItems" as a number', (done) => {
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      function handleData(data) {
         const actual =   { total: typeof data.totalItems, kind: data.kind };
         const expected = { total: 'number',               kind: 'books#volumes' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('NASA Astronomy Picture of the Day resource fetched by fetchJson.get()', () => {

   it('contains an image with a URL', (done) => {
      const url = 'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      function handleData(data) {
         const actual =   { media: data.media_type, url: !!data.url };
         const expected = { media: 'image',         url: true };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      }).timeout(5000);  //Deep Space Network can be a little slow

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('GET response returned by httpbin.org', () => {

   it('contains empty params when none are supplied', (done) => {
      const url = 'https://httpbin.org/get';
      function handleData(data) {
         const actual =   data.args;
         const expected = { };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from the URL query string', (done) => {
      const url = 'https://httpbin.org/get?planet=Jupiter&max=3';
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', max: '3' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from an object', (done) => {
      const url = 'https://httpbin.org/get';
      const params = { planet: 'Jupiter', max: 3 };
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', max: '3' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      });

   it('contains the params from both the URL query string and an object', (done) => {
      const url = 'https://httpbin.org/get?sort=diameter';
      const params = { planet: 'Jupiter', max: 3 };
      function handleData(data) {
         const actual =   data.args;
         const expected = { sort: 'diameter', planet: 'Jupiter', max: '3' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Response returned by httpbin.org for a planet (object literal)', () => {

   it('from a POST contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/post';
      const resource = { name: 'Mercury', position: 1 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.post(url, resource).then(handleData);
      });

   it('from a PUT contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/put';
      const resource = { name: 'Venus', position: 2 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.put(url, resource).then(handleData);
      });

   it('from a PATCH contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/patch';
      const resource = { name: 'Mars', position: 4 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.patch(url, resource).then(handleData);
      });

   it('from a DELETE contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/delete';
      const resource = { name: 'Jupiter', position: 5 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.delete(url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The low-level fetchJson.request() function', () => {

   it('can successfully GET a planet', (done) => {
      const url = 'https://httpbin.org/get';
      const params = { planet: 'Neptune', max: 10 };
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Neptune', max: '10' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.request('get', url, params).then(handleData);
      });

   it('can successfully POST a planet', (done) => {
      const url = 'https://httpbin.org/post';
      const resource = { name: 'Saturn', position: 6 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.request('POST', url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function fetchJson.enableLogger()', () => {

   it('sets the logger to the function passed in', () => {
      function mockLogger() {}
      fetchJson.enableLogger(mockLogger);
      const actual =   { type: typeof fetchJson.logger, fn: fetchJson.logger };
      const expected = { type: 'function',              fn: mockLogger };
      assert.deepEqual(actual, expected);
      });

   it('disables the logger when passed false', () => {
      fetchJson.enableLogger(false);
      const actual =   { logger: fetchJson.logger, disabled: !fetchJson.logger };
      const expected = { logger: null,             disabled: true };
      assert.deepEqual(actual, expected);
      });

   it('passes a timestamp, methed, and URL to a custom logger on GET', (done) => {
      const url = 'https://httpbin.org/get';
      const isoTimestampLength = new Date().toISOString().length;
      function customLogger(logTimestamp, logMethod, logUrl) {
         fetchJson.enableLogger(false);
         const actual =   { timestamp: logTimestamp.length, method: logMethod, url: logUrl };
         const expected = { timestamp: isoTimestampLength,  method: 'GET',     url: url };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.enableLogger(customLogger);
      fetchJson.get(url);
      });

   });
