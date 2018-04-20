# Lighthouse

## Quadrant
incubate

## Type
Tool

## Description
Lighthouse is an open-source, automated tool for improving the quality of web pages. You can run it against any web page, public or requiring authentication. It analyzes web apps and web pages, collecting modern performance metrics and insights on developer best practices.

## Resources
[Lighthouse Docs](https://developers.google.com/web/tools/lighthouse/)

## Using Lighthouse in Chrome DevTools

Lighthouse is integrated directly into the Chrome Developer Tools, under the "Audits" panel.

**Installation**: install [Chrome](https://www.google.com/chrome/browser).

**Run it**: open Chrome DevTools, select the Audits panel, and hit "Perform an Audit...".

<img width="350px" alt="Lighthouse integration in Chrome DevTools" src="https://cloud.githubusercontent.com/assets/238208/26366636/ada298f8-3fa0-11e7-9da5-ede2c906d10c.png">

## Using the Node CLI

_Lighthouse requires Node 6 or later._

**Installation**:

```shell
npm install -g lighthouse
# or use yarn:
# yarn global add lighthouse
```

**Run it**: `lighthouse https://airhorner.com/`

By default, Lighthouse writes the report to an HTML file. You can control the output format by passing flags.

## Github
* https://github.com/GoogleChrome/lighthouse

### Platform
Web,Mobile