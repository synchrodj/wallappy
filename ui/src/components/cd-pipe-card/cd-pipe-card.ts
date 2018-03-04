
import { Component, Vue, Prop } from 'vue-property-decorator';
import './cd-pipe-card.scss';
import { Logger } from '../../util/log';

@Component({
    template: require('./cd-pipe-card.html')
})
export class CDPipeCard extends Vue {
    protected logger: Logger;

    @Prop()
    appInfo: any;

    @Prop()
    lastDeploymentsInfo: Array<any>;

    mounted() {
        if (!this.logger) this.logger = new Logger();
    }

    get deploymentPipes() {
        return this.buildDeploymentPipes(this.lastDeploymentsInfo);
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
