from pods import Pods
from pod import Pod
from builds import Builds
from deployments import Deployments
from deployment import Deployment
from configs import ConfigsResource

class WallappyAPI(object):
    def __init__(self, app_config, _flask_restful):
        self._config = app_config
        self._flask_restful = _flask_restful
        self._configure()

    def config(self):
        return self._config

    def _configure(self):
        self._flask_restful.add_resource(Pods, '/api/pods')
        self._flask_restful.add_resource(Pod, '/api/pods/<pod_id>')
        self._flask_restful.add_resource(Builds, '/api/apps/<app_id>/builds')
        self._flask_restful.add_resource(Deployments, '/api/deployments')
        self._flask_restful.add_resource(Deployment, '/api/deployments/<deployment_id>')
        self._flask_restful.add_resource(ConfigsResource, '/api/config/<config_key>')
