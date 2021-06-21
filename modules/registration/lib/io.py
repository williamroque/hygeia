import sys
import json


def parse(switch):
    for request in sys.stdin:
        request = json.loads(request)

        command = request['command']

        if command == 'close':
            break

        switch.get(command, lambda: ())()

def send(output):
    print(json.dumps(output), flush=True)
