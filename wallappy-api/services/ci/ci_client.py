from abc import ABCMeta, abstractmethod


class CIClient(object):
    __metaclass__ = ABCMeta

    @abstractmethod
    def get_latest_build(self): 
        raise NotImplementedError()

    @abstractmethod
    def get_deployments(self): 
        raise NotImplementedError()
