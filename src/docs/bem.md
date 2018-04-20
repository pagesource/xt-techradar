# BEM (Block Element Modifier)

## Quadrant
grow

## Type
concepts

## Description
**BEM** - Block Element Modifier is a methodology that helps you to create reusable components and code sharing in front-end development.
BEM is -

* **Easy** - To use BEM, you only need to employ BEM’s naming convention.

* **Modular** - Independent blocks and CSS selectors make your code reusable and modular.

* **Flexible** - Using BEM, methodologies and tools can be recomposed and configured the way you like.

BEM is a highly useful, powerful, and simple naming convention that makes your front-end code easier to read and understand, easier to work with, easier to scale, more robust and explicit, and a lot more strict.

**Naming**
The BEM approach ensures that everyone who participates in the development of a website works with a single codebase and speaks the same language. Using BEM’s proper naming convention will better prepare you for design changes made to your website.

**Block**

Encapsulates a standalone entity that is meaningful on its own. While blocks can be nested and interact with each other, semantically they remain equal; there is no precedence or hierarchy. Holistic entities without DOM representation (such as controllers or models) can be blocks as well. Block names may consist of Latin letters, digits, and dashes. To form a CSS class, add a short prefix for namespacing: .block

<div class="block">...</div>

.block { color: #042; }

**Element**

Parts of a block and have no standalone meaning. Any element is semantically tied to its block. Element names may consist of Latin letters, digits, dashes and underscores. CSS class is formed as block name plus two underscores plus element name: .block__elem

<div class="block">
	  ...
	  <span class="block__elem"></span>
</div>

.block__elem { color: #042; }

**Modifier**

Flags on blocks or elements. Use them to change appearance, behavior or state. Modifier names may consist of Latin letters, digits, dashes and underscores. CSS class is formed as block’s or element’s name plus two dashes: .block--mod or .block__elem--mod and .block--color-black with .block--color-red. Spaces in complicated modifiers are replaced by dash.
```
<div class="block block--mod">...</div>
<div class="block block--size-big block--shadow-yes">...</div>

.block--mod .block__elem { }
```
```
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>

.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```

## Resources
[BEM](http://getbem.com/)

## Github
* https://github.com/getbem/getbem.com/

### Platform
web,mobile