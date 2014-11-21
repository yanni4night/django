##django
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support me][gittip-image]][gittip-url] [![Build Status][travis-image]][travis-url] [![Built with Grunt][grunt-image]][grunt-url]

An template wrapper of [Django][django-url] for [Express.js][express-url].


[Django][django-url]'s template syntax has quite a lot of differences from [twig](http://twig.sensiolabs.org),[jinja2](http://jinja.pocoo.org/) or [swig](http://paularmstrong.github.io/swig/).I make a wrapper so it can work with [Express.js][express-url].

I setup a node-python bridge by shell script,it may fail if the parameter is too long.Get the longest parameter on your system:

    
    $ getconf ARG_MAX

I'll find out a better way later.

##install

First you have to install [Django][django-url] framework by [pip][pip-url] or [easy_install][easyinstall-url]:

    
    # pip install -v Django==1.7
    //or
    # easy_install "Django==1.7"


Make sure it's installed successfully.

Set django as a template engine for [Express.js][express-url]:

    
    var express = require('express');
    var path = require('path');
    var django = require('django');
    
    django.configure({
        template_dirs: path.join(__dirname, 'template')
    });

    var app = express();

    app.engine('html', django.renderFile);
    app.set('views', path.join(__dirname, 'template'));
    app.set('view engine', 'html');

##usage

######1.configure(options)

Setup configurations.This should be called first.

######2.renderFile(tpl, data, callback)

Render a template file with data.

##options
All the following options should be set by _configure_.

######1.template_dirs

The root directory of the template files,this is necessary when templates _extend_/_include_.

##attention

 - only **utf8** encoding is supported
 - django **cannot** render from source code for now

##author
 - <yanni4night@gmail.com>

##licence
 MIT

[pip-url]:https://pypi.python.org/pypi/pip
[easyinstall-url]:https://pythonhosted.org/setuptools/easy_install.html

[django-url]:https://djangoproject.com/
[express-url]:http://expressjs.jser.us/

[gittip-url]: https://www.gittip.com/yanni4night/
[gittip-image]: http://img.shields.io/gittip/yanni4night.svg

[downloads-image]: http://img.shields.io/npm/dm/django.svg
[npm-url]: https://npmjs.org/package/django
[npm-image]: http://img.shields.io/npm/v/django.svg

[travis-url]: https://travis-ci.org/yanni4night/django
[travis-image]: http://img.shields.io/travis/yanni4night/django.svg

[grunt-url]:http://gruntjs.com/
[grunt-image]: http://img.shields.io/badge/BUILT%20WITH-GRUNT-yellow.svg