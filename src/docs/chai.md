# Chai

## Quadrant
ubiquitous

## Type
frameworks

## Description
Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework. The Chai API is broken down by style or task.

**Assertion Styles**
* The Expect / Should API covers the BDD assertion styles.
* The Assert API covers the TDD assertion style.

**Plugins**
* The Plugin API will be of use to anyone interested in building plugins as helpers to DRY up your tests, or for release to the community.

**Tools**
* The Online Test Suite is a live run of Chai’s test suite. Use it to ensure browser compatibility.

``` js
var assert = require('chai').assert
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

assert.typeOf(foo, 'string'); // without optional message
assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
assert.equal(foo, 'bar', 'foo equal `bar`');
assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
```

## Resources
[Chai](https://chaijs.org)


## Github
* https://github.com/chaijs/chai

### Platform
web