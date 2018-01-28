from flask_restful import reqparse, abort, Api, Resource

"""
To get list of tests per environment
"""
class TestsAPI(Resource):
    def get(self, app_id, env):
        return {'app_id': app_id}
    
