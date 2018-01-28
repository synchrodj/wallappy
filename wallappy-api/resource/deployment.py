from flask_restful import abort, Resource
from flask_restful import reqparse
from services import ci

class Deployment(Resource):
    def get(self, buildKey):
        return ci.get_deployment(buildKey)
