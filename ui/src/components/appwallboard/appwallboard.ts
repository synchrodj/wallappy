import { Component, Vue } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import './appwallboard.scss';
import http from '../../services/http';

@Component({
    template: require('./appwallboard.html')
})
export class AppWallboardComponent extends Vue {

    protected logger: Logger;

    deploymentInfo = null;
    
    created() {
        let path = `/api/deployments?buildKey=${this.$route.params.appid}`;
        http.get(path)
            .then((response) => {
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

    public get deploymentId(): string {
        if (this.deploymentInfo !== null) {
            console.log('returned ' + this.deploymentInfo.deploymentKey);
            return this.deploymentInfo.deploymentKey;
        }
        return null;
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
