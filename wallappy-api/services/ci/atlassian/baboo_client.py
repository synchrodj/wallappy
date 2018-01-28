import requests
from config import app_config
from urlparse import urlparse
from urlparse import urljoin
from os import path
BAMBOO_PATH = '/rest/api/{}'

class JSONObject(object):
    def __init__(self, d):
        self.__dict__ = d
        
class BambooClient(object):
    def __init__(self):
        self._uri = app_config.get_ci_uri()
        self._headers = {
            'accept': 'application/json'
        }

    def get(self, path, params=None):
        url = urljoin(self._uri, BAMBOO_PATH.format(path))
        result = requests.get(url, params=params, headers=self._headers).json(object_hook=JSONObject)
        return result