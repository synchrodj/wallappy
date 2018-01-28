from ci_client import CIClient
from atlassian.baboo_client import BambooClient
import json
from config import app_config

IGNORED_REPOSITORIES = ['cd-scripts', 'cd-scripts-trunk']

class AtlassianClient(CIClient):
    def __init__(self):
        self.bambooClient = BambooClient()

    def serialize_instance(self, obj):
        d = {}
        d.update(vars(obj))
        return d

    def marshallObject(self, object_instance): 
        return json.loads(json.dumps(object_instance, default=self.serialize_instance))

    def get_deployments(self):
        path = 'latest/deploy/dashboard'
        deployments_results = self.bambooClient.get(path);
        deployments = []
       
        for deployment_result in deployments_results:
            if not hasattr(deployment_result.deploymentProject, 'planKey'):
                continue
            deployment = {
                'name': deployment_result.deploymentProject.name,
                'deploymentKey': deployment_result.deploymentProject.key.key,
                'deploymentUrl': self.get_deployment_url(deployment_result.deploymentProject.key.key),
                'buildKey': deployment_result.deploymentProject.planKey.key,
                'buildUrl': self.get_build_url(deployment_result.deploymentProject.planKey.key),
                'envs': self.get_deployment_envs(deployment_result)
            }
            deployments.append(deployment)

        return deployments

    def get_deployment_envs(self, deployment): 
        envs = []
        for environment_status in deployment.environmentStatuses:
            envs.append(environment_status.environment.name)
        return envs
            
            

    def get_latest_build(self, app_id): 
        latest_build_key =  self.get_latest_build_key(app_id)
        path = 'latest/result/{}'.format(latest_build_key)
        params = {'expand': 'vcsRevisions,jiraIssues,changes.change'}
        latest_build_details = self.bambooClient.get(path, params=params)
        
        return {
            'version': latest_build_details.buildNumber,
            'status': self.get_state(latest_build_details.buildState),
            'changeset': self.build_changesets_info(latest_build_details),
            'issues': self.build_issues_info(latest_build_details),
            'sourceInfo': self.marshallObject(latest_build_details)
        }

    def get_latest_build_key(self, app_id):
        path = 'latest/result/{}'.format(app_id)
        params = {'expand': 'results[0].result'}
        latest_build_info = self.bambooClient.get(path, params=params)
        return latest_build_info.results.result[0].key

    def build_changesets_info(self, latest_build_details): 
        return {
            'repository': self.get_repository(latest_build_details),
            'changes': self.build_changes(latest_build_details)
        }

    def build_changes(self, latest_build_details): 
        changes = []
        for change in latest_build_details.changes.change:
            c = {
                'id': change.changesetId,
                'displayId': change.changesetId[:11],
                'changesetUrl': change.commitUrl,
                'description': change.comment,
                'author': change.author,
                'type': 'code'
            }

            if hasattr(c, 'userName'):
                c.userName = change.userName

            changes.append(c)

        return changes

    
    """
    Assuming that there is a single repository
    """
    def get_repository(self, latest_build_details): 
        for vcs_revision in latest_build_details.vcsRevisions.vcsRevision:
            if vcs_revision.repositoryName not in IGNORED_REPOSITORIES:
                return vcs_revision.repositoryName
        return ''
    

    def build_issues_info(self, latest_build_details): 
        issues = []
        for issue in latest_build_details.jiraIssues.issue:
            issues.append({
                'id': issue.key,
                'type': 'jira',
            })
        return issues
    
    def get_state(self, state):
        if state == 'Successful':
            return 'success'
        return state

    def get_deployment_url(self, deploymentKey):
        return app_config.get_ci_uri() + "/deploy/viewDeploymentProjectEnvironments.action?id=" + deploymentKey

    def get_build_url(self, buildKey):
        return app_config.get_ci_uri() + "/browse/" + buildKey