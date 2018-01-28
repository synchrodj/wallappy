from flask_restful import abort, Resource
from flask_restful import reqparse
from services import ci

BUILD_KEY_ARG_NAME = 'buildKey'
parser = reqparse.RequestParser()
parser.add_argument(BUILD_KEY_ARG_NAME, type=str, help='Number of results to retrieve')

class Deployments(Resource):
    def get(self):
        args = parser.parse_args()
        
        build_key_filter = args[BUILD_KEY_ARG_NAME]
        if build_key_filter != None:
            return ci.get_deployment_summary(build_key_filter)
        else:
            return ci.get_deployments()
