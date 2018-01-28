import { Component, Vue, Prop } from 'vue-property-decorator';
import './deployment-card.scss';
import { Logger } from '../../util/log';

@Component({
    template: require('./deployment-card.html')
})
export class DeploymentCard extends Vue {
    protected logger: Logger;

    lastDeploymentsData: any = {};
    
    @Prop()
    app: string;

    mounted() {
        this.getLastDeploymentInfo();
    }

    get lastDeploymentsInfo() {
        return this.lastDeploymentsData;
    }


    // To be queried from backend
    getLastDeploymentInfo() {
        this.lastDeploymentsData = [
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
        ];
    }
}
