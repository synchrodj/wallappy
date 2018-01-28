from flask import Flask, url_for, render_template, request, Response
from config import app_config
from tests_manager import TestsManager
from flask_restful import Resource, Api
from resource.api import WallappyAPI
from tests_api import TestsAPI
from flask_cors import CORS


import os.path


test_manager = TestsManager(app_config)

flask = Flask(__name__)
CORS(flask, resources={r"/api/*": {"origins": "*"}})

flask_restful = Api(flask)

wallappy_api = WallappyAPI(app_config, flask_restful)

flask_restful.add_resource(TestsAPI, '/api/apps/<app_id>/tests-results/<env>')


@flask.route('/hello/<app_id>')
def hello_world(app_id):
    return 'Hello, World! ' + app_id


@flask.route('/apps/<app_id>')
def index(app_id):
    return render_template('app.html', app_id=app_id)

@flask.route('/apps/<app_id>/tests-results/<env>/<version>', methods=['GET'])
def upload_test_results_view(app_id, env, version):
    return render_template('tests-results.html', app_id=app_id, env=env, version=version)

@flask.route('/apps/<app_id>/tests-results/<env>/<version>', methods=['POST'])
def upload_test_results(app_id, env, version):
    results = request.files['results']
    test_manager.save_results(app_id, env, version, results)
    return render_template('tests-results.html', app_id=app_id, env=env, version=version)


""" 
Statics 
To make vue work woth absolute paths if no extension is defined, it will retrieve the main index.html file
"""
def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

@flask.route('/', defaults={'path': 'index.html'})
@flask.route('/<path:path>')
def get_resource(path):  # pragma: no cover
    mimetypes = {
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript",
        ".png": "image/png",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2",
        ".ttf": "application/x-font-ttf",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon"
    }

    ext = os.path.splitext(path)[1]
    mimetype = mimetypes.get(ext)
    if mimetype is None:
        path = 'index.html'
        mimetype = mimetypes.get('.html')

    complete_path = os.path.join(root_dir(), '../static/' + path)

    content = get_file(complete_path)
    return Response(content, mimetype=mimetype)

print "wallappy! started"
