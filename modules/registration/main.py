import os
import json

from lib.io import parse, send


dir_path = os.path.dirname(os.path.realpath(__file__))

def send_html():
    with open(os.path.join(dir_path, 'html/module.html')) as f:
        output = {
            'command': 'request-html'
        }

        output['content'] = f.read()

        send(output)

parse({
    'request-html': send_html
})
