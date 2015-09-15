# NOTE: This app has been retired in favor of [this AGOL app](http://utah.maps.arcgis.com/apps/Viewer/index.html?appid=573dfdb6220d4fada6d833def633b866)
[![Build Status](https://travis-ci.org/agrc/public-utilities.svg?branch=master)](https://travis-ci.org/agrc/public-utilities)
public utilities
===================================

To Use
======

### Step 1 - Boilerplate

```
git clone https://github.com/agrc/public-utilities.git
cd public-utilities
npm install
bower install
```

Run `grunt` to automatically lint your files and run unit tests (see `_SpecRunner.html` for unit tests).

### Step 2 - Optimize

Run `grunt build` to run the dojo build, replace the script tags in the index page, and optimize images.

Notes
=====

The build script uses a special AMD build of the ESRI api to get all modules into a single built layer file (`dojo/dojo.js`).
