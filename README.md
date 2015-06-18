# StreetViewAnimator

[![Project Status](http://stillmaintained.com/hellopablo/streetviewanimator.png)](https://stillmaintained.com/hellopablo/streetviewanimator)

A simple tool for easily creating Google Street View frame based animations. [Demo](http://hellopablo.github.io/streetviewanimator)


## How to use

### Basic Usage

The easiest way to install streetveiwanimator.js is via [Bower](http://bower.io).

    bower install streetviewanimator

Include the JS in your page, rememebring to include the dependencies: Google Maps and jQuery. Note that you will require an API key and also specify that we load the geometry library.

    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry"></script>
    <script type="text/javascript" src="assets/bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="assets/bower_components/streetviewanimator/dist/streetviewanimator.min.js"></script>

Instantiate streetviewanimator like so:

	[@todo]

## Options

The following options are available to you:

	[@todo]

## How to Contribute

I welcome contirbutions to streetviewanimator. Fork the repo and submit a pull request. Please ensure that streetviewanimator.js compiles and that any relevant documentation is updated before sending the pull request.

### Compiling LESS and JS

I use Grunt to compile everything. Firstly, install `grunt-cli` globally. It's recommended to run the grunt client on a per-project basis, so if you have it installed globally, remove it.

    npm install -g grunt-cli

Install the dev dependancies

    npm install

Calling `grunt` in the project root will start the watcher causing changes to the JS to be compiled automatically.

    grunt
