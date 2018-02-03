from flask_restful import abort, Resource
from config import app_config

DEPLOYMENTS_KEY = 'deployments'

class ConfigsResource(Resource):
    def get(self, config_key):
        if config_key != DEPLOYMENTS_KEY:
            abort(404)
        
        return app_config.get_deployments_config()
