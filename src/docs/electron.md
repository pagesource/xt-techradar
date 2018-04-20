# Electron

## Quadrant
scale

## Type
Framework

## Description
If you can build a website, you can build a desktop app. Electron is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS. It takes care of the hard parts so you can focus on the core of your application.

``` js
import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';

let win;
function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)

```

## Resources
[Electronjs](https://electronjs.org/)


## Github
* https://github.com/electron

### Platform
web, desktop
