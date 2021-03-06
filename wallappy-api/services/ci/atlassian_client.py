from ci_client import CIClient
from atlassian.baboo_client import BambooClient
import json
import re

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
            if not hasattr(deployment_result.deploymentProject, 'planKey') or not hasattr(deployment_result.environmentStatuses[0], 'deploymentResult'):
                continue

            deployment = {
                'name': deployment_result.deploymentProject.name,
                'deploymentKey': deployment_result.deploymentProject.key.key,
                'deploymentUrl': self.get_deployment_url(deployment_result.deploymentProject.key.key),
                'buildKey': deployment_result.deploymentProject.planKey.key,
                'buildUrl': self.get_build_url(deployment_result.deploymentProject.planKey.key),
                'deploymentPipes': self.build_deployment_pipes(deployment_result)
            }
            deployments.append(deployment)

        return deployments

    def get_latest_build(self, app_id): 
        latest_build_key =  self.get_latest_build_key(app_id)
        return self.get_build(latest_build_key)

    def get_build(self, build_key):
        build_details = self.get_build_details(build_key)

        return {
            'version': build_details.buildNumber,
            'buildNumber': build_details.buildNumber,
            'buildResultKey': build_details.buildResultKey,
            'state': self.get_state(build_details.buildState),
            'changeset': self.build_changesets_info(build_details),
            'issues': self.build_issues_info(build_details),
            'sourceInfo': self.marshallObject(build_details)
        }


    def get_build_details(self, build_key):
        path = 'latest/result/{}'.format(build_key)
        params = {'expand': 'vcsRevisions,jiraIssues,changes.change'}
        return self.bambooClient.get(path, params=params)


    def get_latest_build_key(self, app_id):
        path = 'latest/result/{}'.format(app_id)
        params = {'expand': 'results[0].result'}
        latest_build_info = self.bambooClient.get(path, params=params)
        return latest_build_info.results.result[0].key

    def build_changesets_info(self, build_details): 
        return {
            'repository': self.get_repository(build_details),
            'changes': self.build_changes(build_details)
        }

    def build_changes(self, build_details): 
        changes = []
        for change in build_details.changes.change:
            c = {
                'id': change.changesetId,
                'displayId': change.changesetId[:11],
                'changesetUrl': change.commitUrl,
                'description': change.comment,
                'author': change.author,
                'type': 'code',
                'plan': {
                    'name': build_details.planName,
                    'link': self.get_build_url(build_details.key)
                },
                'date': change.date
            }

            if hasattr(c, 'userName'):
                c.userName = change.userName

            changes.append(c)

        self.build_nested_changes(changes, build_details)
        return changes
    
    def get_build_url(self, build_key):
        return app_config.get_ci_uri() + "/browse/" + build_key;

    def build_nested_changes(self, changes, build_details): 
        reason = build_details.buildReason

        if reason == "Scheduled":
            source_build = build_details.buildResultKey
            c = {
                'description': "Scheduled from <strong>" + build_details.planName + "</strong>",
                'author': "bamboo",
                'type': 'build',
                'plan': {
                    'name': build_details.planName,
                    'link': self.get_build_url(build_details.key)
                },
                'date': build_details.buildCompletedDate
            }
            changes.append(c)
        
        elif re.search('manual run', reason, re.IGNORECASE):
            source_build = build_details.buildResultKey
            c = {
                'description': reason,
                'author': "bamboo",
                'type': 'build',
                'plan': {
                    'name': build_details.planName,
                    'link': self.get_build_url(build_details.key)
                },
                'date': build_details.buildCompletedDate
            }
            changes.append(c)
        else:
            match = re.compile(r'\>[\w-]*\<').findall(reason);
            if len(match)==1:
                source_build = match[0][1:-1]
                source_build_details = self.get_build_details(source_build)
                changes += self.build_changes(source_build_details)

    
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
        if re.search('success', state, re.IGNORECASE):
            return 'success'
        elif re.search('err', state, re.IGNORECASE) or re.search('fail', state, re.IGNORECASE):
            return 'error'
        elif re.search('run', state, re.IGNORECASE):
            return 'running'
        return state

    def get_deployment_url(self, deployment_key):
        return app_config.get_ci_uri() + "/deploy/viewDeploymentProjectEnvironments.action?id=" + deployment_key

    def get_deployment_result_url(self, result_id):
        return app_config.get_ci_uri() + "/deploy/viewDeploymentResult.action?deploymentResultId=" + str(result_id)

    def get_build_url(self, buildKey):
        return app_config.get_ci_uri() + "/browse/" + buildKey

    def get_deployment(self, deployment_id): 
        path = 'latest/deploy/dashboard/{}'.format(deployment_id)
        deployment_status = self.bambooClient.get(path)
        deployment_info = self.build_deployment_pipes(deployment_status[0], add_state=True)

        return deployment_info

    def build_deployment_pipes(self, deployment_result, add_state=None): 
        pipes = []

        for env_status in deployment_result.environmentStatuses:
            environment = {
                "name": env_status.environment.name,
                "id": env_status.environment.id
            }

            if hasattr(env_status, 'deploymentResult') and add_state:
                environment['state'] = self.get_state(env_status.deploymentResult.deploymentState)
                environment['version'] = env_status.deploymentResult.deploymentVersion.name
                environment['versionId'] = env_status.deploymentResult.deploymentVersion.id
                environment['buildKey'] = self.get_build_key(deployment_result.deploymentProject.planKey.key, env_status)
                if hasattr(env_status.deploymentResult, 'finishedDate'):
                    environment['timestamp'] = env_status.deploymentResult.finishedDate
                environment['link'] = self.get_deployment_result_url(env_status.deploymentResult.id)

            self.add_to_pipes(pipes, environment)
            
            #env_status.deploymentResult.deploymentVersion.id --> relese id related to a build

        
        return pipes
    
    # This is very inconvenient but due to the need of a new call to the private api 
    # it has been decided to proceed to evaluate 
    def get_build_key(self, plan_key, env_status):
        version_name = env_status.deploymentResult.deploymentVersion.name
        build_id = version_name
        if "-" in build_id:
            build_id = build_id[:build_id.find("-")]
        
        if "." in build_id:
            build_id = build_id[build_id.find(".")+1:]
        
        return plan_key + "-" + build_id
        

    def add_to_pipes(self, pipes, environment):
        candidates_pipes = self.eval_pipes(environment)
        for candidate_pipe_name in candidates_pipes:
            current_pipe = self.register_pipe(pipes, candidate_pipe_name)
            current_pipe['envs'].append(environment)
        

    def register_pipe(self, pipes, pipe_name):
        current_pipe = None

        for pipe in pipes:
            if pipe['name'] == pipe_name:
                current_pipe = pipe
                break

        if current_pipe == None:
            current_pipe = {
                "name": pipe_name,
                "envs": []
            }
            pipes.append(current_pipe)
        
        return current_pipe

    def eval_pipes(self, environment):
        pipes = []
        for pipe_config in app_config.get_deployments_config()['pipes']:
            for chain in pipe_config['chain']:
                for env_name in chain['envs']:
                    if re.search(env_name, environment['name'], re.IGNORECASE): # some flexibility in here
                        environment['type'] = chain['type'] # probably not the best place to set this information
                        if pipe_config['name'] not in pipes:
                            pipes.append(pipe_config['name'])
        return pipes

    # Important note: it will check builds in desdencing order by using the build number
    def get_builds_range(self, app_id, from_build_key, to_build_key):
        max_builds = 15
        builds = []

        current_build_key = from_build_key
        for current_index in range(max_builds):
            current_build_details = self.get_build(current_build_key)
            if current_build_details['buildResultKey'] == to_build_key:
                break 

            builds.append(current_build_details)
            current_build_key = app_id + "-" + str(current_build_details['buildNumber'] - 1)

        return builds