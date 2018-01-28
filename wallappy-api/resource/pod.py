from flask_restful import abort, Resource

class Pod(Resource):
    def get(self, pod_id):
        #pod = pods.get_pod(pod_id)
        #if pod == None:
        #    abort(404, message='No such pod configuration \'{}\''.format(pod_id))

        return pod_id
