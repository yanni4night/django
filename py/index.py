# -*- coding:utf8 -*-

from django.template import Context, loader, Template
from django.conf import settings
from urllib import unquote
import django, sys, json

class Session(object):
    """Render Session"""
    def __init__(self, template_dirs = '.'):
        super(Session, self).__init__()
        self.template_dirs = template_dirs
        settings.configure(DEBUG = True, TEMPLATE_DEBUG = True, TEMPLATE_DIRS = [template_dirs], LANGUAGE_CODE = 'zh-cn', FILE_CHARSET = 'utf-8', TIME_ZONE = 'Asia/Shanghai')
        django.setup()
    def renderFile(self, tpl, data = {}):
        """Render from a template with mock data"""
        template = loader.get_template(tpl)
        context = Context(data)
        return template.render(context).encode('utf-8')
    def render(self, source, data = {}):
        """Render from source"""
        template = Template(source)
        context = Context(data)
        return template.render(context).encode('utf-8')
    def __str__(self):
        print 'template_dirs:' + self.template_dirs

if __name__ == '__main__':
    if len(sys.argv) < 3:
        #arguments.length < 3
        #python index.py < source < mock
        source = unquote(sys.stdin.readline())#source has to be encoded because of \r\n
        mockStr = sys.stdin.readline()#mockStr has no \r\n
        
        session = Session()
        
        data = json.loads(mockStr)
        
        html = session.render(source ,data)
    else:
        #arguments.length >= 3
        #python index.py template_dirs template < mock
        dirs = unquote(sys.argv[1])#template_dirs is a directory path that is quoted
        tpl = unquote(sys.argv[2])#template is a file path that is quoted
        
        mockStr = sys.stdin.readline()#We read the mock data from stdin

        session = Session(dirs)

        data = json.loads(mockStr)

        html = session.renderFile(tpl, data)
    sys.stdout.write(html)
    sys.stdout.flush()
    sys.exit()
