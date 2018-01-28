from flask_restful import Resource


class Pods(Resource):
    def get(self):
        pod_list = []
        for pod_config in pods.get_pods():
            pod = {
                'id': pod_config['id'],
                'uri': pod_config['uri']
            }
            pod_list.append(pod)

        return pod_list
