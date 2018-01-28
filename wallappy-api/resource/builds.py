from flask_restful import abort, Resource
from flask_restful import reqparse
from services import ci

LIMIT_ARG_NAME = 'limit'

parser = reqparse.RequestParser()
parser.add_argument(LIMIT_ARG_NAME, type=int, help='Number of results to retrieve')

class Builds(Resource):
    def get(self, app_id):
        args = parser.parse_args()
        
        if args[LIMIT_ARG_NAME] != 1:
            raise NotImplementedError()

        return ci.get_latest_build(app_id)
