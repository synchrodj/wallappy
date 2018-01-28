import { Component, Vue } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import axios, { AxiosResponse } from 'axios';
import './appwallboard.scss';

@Component({
    template: require('./appwallboard.html')
})
export class AppWallboardComponent extends Vue {

    protected logger: Logger;

    private axios;

    constructor() {
        super();
        this.axios = axios;
    }

    deploymentInfo = null;
    
    created() {
        let url = `http://localhost:5000/api/deployments?buildKey=${this.$route.params.appid}`;
        this.axios.get(url)
            .then((response: AxiosResponse) => {
                this.deploymentInfo = response.data;
                console.log(this.deploymentInfo);
            }, (error) => {
                console.error(error);
            });
    }

    mounted() {
        if (!this.logger) this.logger = new Logger();
        this.$nextTick(() => {
            this.logger.info('Appwallboard is ready!');
            console.log(this.$store.state);
        });
    }

    get appInfo() {
        let appInfo = {};
        
        if (this.deploymentInfo !== null) {
            appInfo = JSON.parse(JSON.stringify(this.deploymentInfo));
            appInfo['deployments'] = this.buildDeploymentPipes(this.deploymentInfo);
        }
        return appInfo;
    }

    private buildDeploymentPipes(deploymentInfo: any): any {
        let defaultPipe = {
            pipeName: 'CD plan',
            envs: []
        };

        for (let env of deploymentInfo.envs) {
            defaultPipe.envs.push({
                name: env,
            });
        }

        return [ defaultPipe ];
    }
}
