from atlassian_client import AtlassianClient
from config import app_config

class CiService(object):
    def __init__(self):
        self._ci_client = self._build_ci_client(app_config.get_ci_integration_type())
        self.cached_deployments = None

    
    def _build_ci_client(self, integration_type):
        if integration_type == 'atlassian':
            return AtlassianClient()
        
        raise NotImplementedError()

    def get_latest_build(self, app_id):
        return self._ci_client.get_latest_build(app_id)

    def get_deployments(self):
        if self.cached_deployments == None:
            self.cached_deployments = self._ci_client.get_deployments()

        return self.cached_deployments

    def get_deployment_summary(self, build_key):
        deployments = self.get_deployments()
        for deployment in deployments:
            if deployment['buildKey'] == build_key:
                return deployment
        return {}

    def get_deployment(self, deployment_id):
        return self._ci_client.get_deployment(deployment_id)
