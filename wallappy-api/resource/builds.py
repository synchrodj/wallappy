from flask_restful import abort, Resource
from flask_restful import reqparse
from services import ci

QUERY_ARG_NAME = 'query'
FROM_ARG_NAME = 'from'
TO_ARG_NAME = 'to'

QUERY_LATEST = 'latest'
QUERY_RANGE = 'range'


parser = reqparse.RequestParser()
parser.add_argument(QUERY_ARG_NAME, type=str, help='Number of results to retrieve')
parser.add_argument(FROM_ARG_NAME, type=str, help='Query modifier "from" version')
parser.add_argument(TO_ARG_NAME, type=str, help='Query modifier "to" version')


class Builds(Resource):
    def get(self, app_id):
        args = parser.parse_args()

        if QUERY_ARG_NAME not in args:
            raise NotImplementedError()

        query_value = args[QUERY_ARG_NAME];
        if query_value == 'latest':
            return ci.get_latest_build(app_id)
        elif query_value == 'range':
            return ci.get_builds_range(app_id, args[FROM_ARG_NAME], args[TO_ARG_NAME])

        raise NotImplementedError()
