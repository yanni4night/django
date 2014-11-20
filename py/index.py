# -*- coding:utf8 -*-

from django.template import Context, loader
from django.conf import settings
from urllib import quote, unquote
import django, sys, json


class Session(object):
    """Render Session"""
    def __init__(self, template_dirs = '.'):
        super(Session, self).__init__()
        self.template_dirs = template_dirs
        settings.configure(DEBUG = True, TEMPLATE_DEBUG = True, TEMPLATE_DIRS = [template_dirs])
        django.setup()
    def render(self, tpl, data = {}):
        template = loader.get_template(tpl)
        context = Context(data)
        return template.render(context)
    def __str__(self):
        print 'template_dirs:' + template_dirs

#not used
SessionCache = {}

if __name__ == '__main__':
    if len(sys.argv) < 3:
        raise Exception('"template" and "data" must be indicated')
    else:
        dirs = unquote(sys.argv[1])
        session = SessionCache.get(dirs)
        if not session:
            session = Session(dirs)
            SessionCache[dirs] = session
        tpl = unquote(sys.argv[2])
        try:
            data = json.loads(unquote(sys.argv[3]))
        except Exception,e:
            data = {}
        html = session.render(tpl, data)
        print quote(html.encode('utf-8'))

