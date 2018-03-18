
import { Component, Vue, Prop } from 'vue-property-decorator';
import './cd-pipe-card.scss';
import { Logger } from '../../util/log';
import http from '../../services/http';
import { AxiosRequestConfig } from 'axios';


@Component({
    template: require('./cd-pipe-card.html')
})
export class CDPipeCard extends Vue {
    protected logger: Logger;

    @Prop()
    appInfo: any;

    @Prop()
    lastDeploymentsInfo: Array<any>;

    private currentPipes = [];

    public displayEnvDiffsDialog: boolean = false;

    private envDiffs = [];

    mounted() {
        if (!this.logger) this.logger = new Logger();
    }

    get deploymentPipes() {
        this.currentPipes = this.buildDeploymentPipes(this.lastDeploymentsInfo);
        return this.currentPipes;
    }

    private buildDeploymentPipes(deployments) {
        let deploymentPipes = [];

        if (deployments) {
            for (let deploymentPipe of deployments) {
                let currentPipe = {
                    'name': deploymentPipe.name,
                    'deployments': []
                };

                for (let env of deploymentPipe.envs) {
                    this.appendDeployment(currentPipe, env);
                } 
    
                deploymentPipes.push(currentPipe);
            }   
        }

        return deploymentPipes;
    }

    private appendDeployment(pipe, envDeployment) {
        let deploymentGroup = null;
        for (let currentEnvGroup of pipe.deployments) {
            if (currentEnvGroup.type === envDeployment.type) {
                deploymentGroup = currentEnvGroup;
                break;
            }
        }

        if (!deploymentGroup) {
            deploymentGroup = {
                'type': envDeployment.type,
                'envs': []
            };
            pipe.deployments.push(deploymentGroup);
        }

        deploymentGroup.envs.push(envDeployment);
    }

    public envOutdated(pipeIndex, envIndex): boolean {
        let currentVersion = this.currentPipes[pipeIndex].deployments[envIndex].envs[0].buildKey;
        let nextVersion = this.currentPipes[pipeIndex].deployments[envIndex + 1].envs[0].buildKey;

        return currentVersion && nextVersion && currentVersion !== nextVersion;
    }

    public displayEnvDiffs(pipeIndex, envIndex) {
        this.displayEnvDiffsDialog = true;
        let path = `/api/apps/${this.$route.params.deploymentId}/builds`;

        let currentVersion = this.currentPipes[pipeIndex].deployments[envIndex].envs[0].buildKey;
        let nextVersion = this.currentPipes[pipeIndex].deployments[envIndex + 1].envs[0].buildKey;

        if (currentVersion && nextVersion) {
            let config: AxiosRequestConfig = {
                params: {
                    query: 'range',
                    from: currentVersion,
                    to: nextVersion
                }
            };
    
            http.get(path, config).then((response) => {
                if (this.displayEnvDiffsDialog) {
                    this.envDiffs = response.data;
                }
            }, (error) => {
                console.error(error);
            });
        }
    }

    public handleCloseEnvDiffs() {
        this.displayEnvDiffsDialog = false;
        this.envDiffs = [];
    }

    getCDPipes() {
        let cdPipesData =  [
            {
                name: 'pipe001',
                envs: [
                    {
                        name: 'Development',
                        status: 'success',
                        version: '3.125'
                    },
                    {
                        name: 'Integration',
                        status: 'error',
                        version: '3.123'
                    },
                    {
                        name: 'Performance',
                        status: 'deploying',
                        version: '3.123'
                    },
                    {
                        name: 'Production',
                        status: 'success',
                        version: '3.121',
                        requiresAuth: true,
                        authInfo: {
                            message: 'To be approved by change management'
                        }
                    }
                ]
            },
            {
                name: 'pipe002',
                envs: [
                    {
                        name: 'Development',
                        status: 'success',
                        version: '3.125'
                    },
                    {
                        name: 'Integration',
                        status: 'error',
                        version: '3.123'
                    },
                    {
                        name: 'Production',
                        status: 'success',
                        version: '3.121',
                        requiresAuth: true,
                        authInfo: {
                            message: 'To be approved by change management & manager'
                        }
                    }
                ]
            }
        ];
    }
}
