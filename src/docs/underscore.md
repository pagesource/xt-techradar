# Underscore

## Quadrant
ubiquitous

## Type
tools

## What is Underscore .?

Underscore is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects. It’s the answer to the question: “If I sit down in front of a blank HTML page, and want to start being productive immediately, what do I need?” … and the tie to go along with jQuery's tux and Backbone's suspenders.

Underscore provides over 100 functions that support both your favorite workaday functional helpers: map, filter, invoke — as well as more specialized goodies: function binding, javascript templating, creating quick indexes, deep equality testing, and so on.

### How to Underscorejs

Using Node
```
npm install underscore
```

Using Meteor
```
meteor add underscore
```

Using Bower 

```
bower install underscore
```


### Example

```js
/*
each_.each(list, iteratee, [context]) Alias: forEach 
Iterates over a list of elements, yielding each in turn to an iteratee function. The iteratee is bound to the context object, if one is passed. Each invocation of iteratee is called with three arguments: (element, index, list). If list is a JavaScript object, iteratee's arguments will be (value, key, list). Returns the list for chaining.
*/

_.each([1, 2, 3], alert);
//alerts each number in turn...

_.each({one: 1, two: 2, three: 3}, alert);
// alerts each number value in turn...
```


## Resources
[underscore](http://underscorejs.org/)

[Collections](http://underscorejs.org/#collections)

[Github](https://github.com/jashkenas/underscore)


### Platform
web, mobile
