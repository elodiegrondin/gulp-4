# Basic Gulp 4 Tasks

This provides an example Gulp.js project which automates CSS tasks including:

* templates task : browsersync
* favicon task : copy favicon
* fonts task : copy fonts
* images task : optimize images
* styles task : compile and minify css
* scripts task : compile and minify scripts js
* vendors task : compile and minify vendors js


## Installation
To install on any Linux, Mac OS or Windows system, ensure [Node.js](https://nodejs.org/) is installed then clone the repository:

Install dependencies:

```bash
npm i
```

Note that module versions have been fixed to guarantee compatibility. Run `npm outdated` and update `package.json` as necessary.


## Usage
Run in live-reloading development mode:

```bash
gulp
```

Navigate to `http://localhost:8000/` or the `External` URL if accessing from another device. Further instructions are shown on the index page.


## Build production CSS
Set `NODE_ENV` to `production` so Gulp tasks produce final code, i.e. remove unused CSS, minify files, and disable sourcemap generation.

Linux/Mac OS:

```bash
NODE_ENV=production
gulp css
```

(or inline `NODE_ENV=production gulp css`)

Windows Powershell:

```powershell
$env:NODE_ENV="production"
gulp css
```

Windows legacy command line:

```cmd
set NODE_ENV=production
gulp css
```
