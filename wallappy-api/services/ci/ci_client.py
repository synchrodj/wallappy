from abc import ABCMeta, abstractmethod


class CIClient(object):
    __metaclass__ = ABCMeta

    @abstractmethod
    def get_latest_build(self): 
        raise NotImplementedError()

    @abstractmethod
    def get_deployments(self): 
        raise NotImplementedError()

    @abstractmethod
    def get_deployment(self, deploymentId): 
        raise NotImplementedError()

    @abstractmethod
    def get_builds_range(self, app_id, from_build_id, to_build_id):
        raise NotImplementedError()
