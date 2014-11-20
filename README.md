django
======
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support me][gittip-image]][gittip-url] [![Build Status][travis-image]][travis-url] [![Built with Grunt][grunt-image]][grunt-url]

An template wrapper of [Django][django-url] for [Express.js][express-url].


[Django][django-url]'s template syntax has many more differences from [twig](http://twig.sensiolabs.org) or [swig](paularmstrong.github.io/swig/).So I make a wrapper for it to work with [Express.js][express-url].

I setup a node-python bridge through shell script,so it may fail if the parameter is too long.Get the longest parameter on your system:

    
    $ getconf ARG_MAX

I'll find out a better way.

author
======
 - <yanni4night@gmail.com>

licence
======
 MIT


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
