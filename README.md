##django
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build status][appveyor-image]][appveyor-url] [![Dependency Status][david-dm-image]][david-dm-url] [![Dev Dependency Status][david-dm-dev-image]][david-dm-url] [![Build Status][codeship-image]][codeship-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Build with Grunt][grunt-image]][grunt-url]

A wrapper of [Django][django-url]'s template engine for _[Express.js][express-url]_.It's designed only for development on web front-end side.**DO NOT** use it for production.


[Django][django-url]'s template syntax is quite different from [twig](http://twig.sensiolabs.org/),[jinja2](http://jinja.pocoo.org/) or [swig](http://paularmstrong.github.io/swig/).For now,there is no replacement like _django.js_ can simulate the syntax and the interfaces.But we can make [Django][django-url] itself working with _[node.js](http://nodejs.org/)_,even _[Express.js][express-url]_.So a wrapper is required.

I setup a node-python bridge through standard in/out stream.It can handle with any size of mock data or source template file theoretically.The shell script below shows how it works:

    
    #echo '{"name":"django"}' | python django.py ./templates index.html

##install

First you have to install [Django][django-url] framework, _[pip][pip-url]_ or _[easy\_install][easyinstall-url]_ is recommended:

    
    # pip install -v Django==1.7
    //or
    # easy_install "Django==1.7"


Make sure it's installed successfully.

Set django as a template engine for _[Express.js][express-url]_:

    
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

##API

######1.configure(configurations)
 - param **configurations**: \[Object\]\[Required\] the configurations object
 - since _0.1.0_
 - return **this**

Set the configurations.It should be called at first.

######2.renderFile(tpl, data, callback)
 - param **tpl**: \[String\]\[Required\] template file name
 - param **data**: \[Object\]\[Optional\] plain object to render a template
 - param **callback**: \[Function\]\[Required\] render callback function
 - since _0.1.0_
 - return **undefined**

Render a template file with data.

######3.render(source, data, callback)
 - param **source**: \[String\]\[Required\] template source codes
 - param **data**: \[Object\]\[Optional\] plain object to render a template
 - param **callback**: \[Function\]\[Required\] render callback function
 - since _0.4.0_
 - return **undefined**

Render a block of source codes with data.

##configurations
All the following configurations should be set by _configure_ function.

######1.template_dirs
 - Type: \[String\]
 - Default: 'templates'

The root directory of the template files,this is necessary when templates _[extend](https://docs.djangoproject.com/en/1.7/ref/templates/builtins/#extends)_ or _[include](https://docs.djangoproject.com/en/1.7/ref/templates/builtins/#include)_.It could be an array in the future.

##notice

 - only **utf8** encoding is supported

##author
 - <yanni4night@gmail.com>

##licence
 MIT

[pip-url]:https://pypi.python.org/pypi/pip
[easyinstall-url]:https://pythonhosted.org/setuptools/easy_install.html

[django-url]:https://djangoproject.com/
[express-url]:http://expressjs.jser.us/

[downloads-image]: http://img.shields.io/npm/dm/django.svg
[npm-url]: https://npmjs.org/package/django
[npm-image]: http://img.shields.io/npm/v/django.svg

[travis-url]: https://travis-ci.org/yanni4night/django
[travis-image]: http://img.shields.io/travis/yanni4night/django.svg

[appveyor-image]:https://ci.appveyor.com/api/projects/status/bsu9w9ar8pboc2nj?svg=true
[appveyor-url]:https://ci.appveyor.com/project/yanni4night/django

[grunt-url]:http://gruntjs.com/
[grunt-image]: http://img.shields.io/badge/BUILT%20WITH-GRUNT-yellow.svg

[david-dm-url]:https://david-dm.org/yanni4night/django
[david-dm-image]:https://david-dm.org/yanni4night/django.svg
[david-dm-dev-image]:https://david-dm.org/yanni4night/django/dev-status.svg

[codeship-image]:https://codeship.com/projects/79da7240-5481-0132-ea32-42ab35009c21/status
[codeship-url]:https://codeship.com/projects/49203

[coveralls-image]:https://coveralls.io/repos/yanni4night/django/badge.png
[coveralls-url]:https://coveralls.io/r/yanni4night/django