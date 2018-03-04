import { Component, Vue, Prop } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import http from '../../services/http';

import './deployment-card.scss';

@Component({
    template: require('./deployment-card.html')
})
export class DeploymentCard extends Vue {
    protected logger: Logger;

    @Prop()
    appInfo: any;

    @Prop()
    lastDeploymentsInfo: Array<any>;

    @Prop()
    lastBuildInfo;

    public currentVersionDeploymentsStatus: Array<any> = [];

    constructor() {
        super();
        this.logger = new Logger();
    }

    get currentDeploymentsStatus() {
        return this.getCurrentVersionDeploymentsStatus(this.lastBuildInfo, this.lastDeploymentsInfo);
    }

    private getCurrentVersionDeploymentsStatus(lastBuildInfo, lastDeploymentsInfo) {
        let deployments = [];

        if (lastBuildInfo && lastDeploymentsInfo) {
            let latestState: string = '';
            for (let deploymentPipe of lastDeploymentsInfo) {
                let currentPipe = {
                    'name': deploymentPipe.name,
                    'envs': [],
                    'state': 'unknown',
                    'version': '#'
                };
                let lastDeploymentState = 'unknown';
                for (let env of deploymentPipe.envs) {
                    // Setting pipe status to last env status
                    if (env.version && env.version.indexOf(lastBuildInfo.version) !== -1) {
                        currentPipe.envs.push(env);
                        currentPipe.state = env.state;
                        currentPipe.version = env.version;
                    }
                }
    
                deployments.push(currentPipe);
            }   
        }
        
        return deployments;
    }
}
