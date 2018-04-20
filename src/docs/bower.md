# Bower

## Quadrant
grow

## Type
tools

## Description
There are now more libraries and frameworks available for front-end development than ever before. It’s not uncommon to have five or more of these libraries involved in a single project. But keeping track of all these libraries and making sure they’re up-to-date can be tricky. Enter **Bower**, a package manager that makes it easy to manage all your application’s front-end dependencies.

In this blog post you are going to learn how to get up and running with Bower. You’ll start by installing the Bower command-line utility and then go on to learn about the various commands that are available for managing packages.

Lets get started!

## Prerequisites

There are some things you'll need before you can start working with Bower:

* The command line. Yup, it's a command line tool
* Node and NPM. Bower is a Node module so to get it you need NPM.
* Git. Bower packages are Git repos. Bower uses Git to understand where the package is, what version it's on—that sort of thing.
* Global Installation. Technically you could install it in every project but you'll probably want to have it everywhere.

To install Bower globally:

``` js
$ npm install -g bower
```
*Note: Depending on your setup you may have to use `sudo npm install -g bower` to install it globally.*


## Finding Packages

To add a new Bower package to your project you use the install command. This should be passed the name of the package you wish to install.

``` js
bower install <package>#<version>
```

## How to use the modules 
```
<script src="path/to/bower_components/jquery/jquery.min.js"></script>
```



## Resources
[Bower](https://bower.io/)

[Bower Search](https://bower.io/search/)

[Bower npm](https://www.npmjs.com/package/bower)

### Platform
web
