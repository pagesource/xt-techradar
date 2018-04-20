# Mocha

## Quadrant
ubiquitous

## Type
frameworks

## Description
Mocha is a feature-rich JavaScript test framework running on [Node.js](https://nodejs.org) and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

Mocha is a JavaScript test framework for Node.js programs, featuring browser support, asynchronous testing, test coverage reports, and use of any assertion library.

``` js
var assert = require("assert")
describe('Foo', function(){
  describe('#getBar(value)', function(){
    it('should return 100 when value is negative') // placeholder
    it('should return 0 when value is positive', function(){
      assert.equal(0, Foo.getBar(10));
    })
  })
})

```
## Resources
[Mocha](https://mochajs.org/)
[Codeburst](https://codeburst.io/how-to-test-javascript-with-mocha-the-basics-80132324752e?gi=66f9674d139f)


## Github
* https://github.com/mochajs/mocha

### Platform
web