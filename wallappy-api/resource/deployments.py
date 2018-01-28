from flask_restful import abort, Resource
from flask_restful import reqparse
from services import ci

class Deployments(Resource):
    def get(self):
        return ci.get_deployments()
