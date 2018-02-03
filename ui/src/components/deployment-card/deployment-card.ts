import { Component, Vue, Prop } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import http from '../../services/http';

import './deployment-card.scss';


@Component({
    template: require('./deployment-card.html')
})
export class DeploymentCard extends Vue {
    protected logger: Logger;

    lastDeploymentsData: any = null;
    
    @Prop()
    appInfo: any;

    get app() {
        return this.appInfo.name;
    }

    constructor() {
        super();
        this.logger = new Logger();
    }

    mounted() {
        console.log('Mounted!!');
        this.getLastDeploymentInfo();
    }

    get lastDeploymentsInfo() {
        this.getLastDeploymentInfo();
        return this.lastDeploymentsData;
    }


    // To be queried from backend
    getLastDeploymentInfo() {
        if (this.appInfo && this.appInfo.deploymentKey) {
            // It doesn't work, get deployment id from 
            console.log('------------------------------');
            console.log(this.appInfo.deploymentKey);
            
            let url = `/api/deployments/${this.appInfo.deploymentKey}`;
            http.get(url)
            .then((response) => {
                this.buildLastDeploymentData(response.data);
            }, (error) => {
                console.error(error);
            });
        }
    }
    
    private buildLastDeploymentData(deploymentInfo): void {
        console.log(deploymentInfo);
        // Build from backend and frontend
    }

        /* this.lastDeploymentsData = [
            {
                version: '3.122',
                status: 'failed',
                pipeName: 'pipe001',
                envs: [
                    {
                        name: 'Development',
                        status: 'success'
                    },
                    {
                        name: 'Integration',
                        status: 'error'
                    },
                    {
                        name: 'Performance',
                        status: 'deploying'
                    },
                    {
                        name: 'Production',
                        status: 'na'
                    }
                ]
            },
            {
                version: '3.122',
                status: 'success',
                pipeName: 'pipe002',
                envs: [
                    {
                        name: 'Development',
                        status: 'success'
                    },
                    {
                        name: 'Integration',
                        status: 'error'
                    },
                    {
                        name: 'Production',
                        status: 'na'
                    }
                ]
            }
        ];*/
    
}
