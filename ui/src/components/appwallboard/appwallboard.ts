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

    lastBuildInfo = null;

    lastDeploymentInfo = null;

    private loadingBuild = true;

    private loadingDeployments = true;

    get loading() {
        return this.loadingBuild || this.loadingDeployments;
    }

    constructor() {
        super();
        if (!this.logger) this.logger = new Logger();
    }
    
    created() {
        let path = `/api/deployments?buildKey=${this.$route.params.appid}`;
        http.get(path).then((response) => {
            this.deploymentInfo = response.data;
            this.refreshAppStatus();
        }, (error) => {
            console.error(error);
        });
    }

    get appInfo() {
        let appInfo = {};
        
        if (this.deploymentInfo !== null) {
            appInfo = JSON.parse(JSON.stringify(this.deploymentInfo));            
        }
        return appInfo;
    }

    private refreshAppStatus(): void {
        this.updateLastBuildInfo();
        this.updateLastDeploymentInfo();
    }

    private updateLastBuildInfo(): void { 
        this.loadingBuild = true;
        let lastBuildPath = `/api/apps/${this.deploymentInfo.buildKey}/builds?limit=1`;
    
        http.get(lastBuildPath)
            .then((response) => {
                if (this.lastBuildInfo == null 
                    || this.lastBuildInfo.version !== response.data.version) {
                    this.lastBuildInfo = response.data;
                }
                this.loadingBuild = false;
            }, (error) => {
                this.logger.error(error);
                this.loadingBuild = false;
            });
    }

    private updateLastDeploymentInfo(): void {
        this.loadingDeployments = true;
        let url = `/api/deployments/${this.deploymentInfo.deploymentKey}`;
        http.get(url).then((response) => {
            if (this.lastDeploymentInfo == null 
                || JSON.stringify(this.lastDeploymentInfo) !== JSON.stringify(response.data)) { // Probably not very accurate
                this.logger.info('Refreshing deployment info');
                this.lastDeploymentInfo = response.data;
            } 
            this.loadingDeployments = false;
        }, (error) => {
            this.logger.error(error);
            this.loadingDeployments = false;
        });
    }
}
