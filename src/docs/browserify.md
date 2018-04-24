# Browserify

## Quadrant
de-emphasize

## Type
tools

## Description
Browserify is a development tool that allows us to write node.js-style modules that compile for use in the browser. 

Just like node, we write our modules in separate files, exporting external methods and properties using the module.exports and exports variables. We can even require other modules using the require function, and if we omit the relative path it’ll resolve to the module in the node_modules directory.

## Resources
[WebLink](http://browserify.org/)
[Handbook](https://github.com/browserify/browserify-handbook)

### Install
```js
npm install -g browserify
```

### Sample Code
```js
var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

console.log(unique(data));
```

Now recursively bundle up all the required modules starting at main.js into a single file called bundle.js with the browserify command:

```js
browserify main.js -o bundle.js
```

Drop a single `<script>` tag into your html and you're done!

```js
<script src="bundle.js"></script>
```


## Github
* https://github.com/browserify/browserify

### Platform
web
