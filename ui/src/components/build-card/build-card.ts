import { Component, Prop } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import './build-card.scss';
import Vue from 'vue';
import http from '../../services/http';

@Component({
    template: require('./build-card.html')
})
export class BuildCard extends Vue {
    protected logger: Logger;
    
    @Prop()
    app: string;

    latBuildInfoData: any = {};

    timerToken: any;

    constructor() {
        super();
        this.logger = new Logger();
    }

    private path = `/api/apps/${this.app}/builds?limit=1`;

    created() {
        this.getLastBuildInfo();
        this.timerToken = setInterval(() => this.getLastBuildInfo(), 5000);   
    }

    // Computed
    get lastBuildInfo() {
        return this.latBuildInfoData;
    }

    destroyed() {
        this.logger.info('Destroyed!');
        clearTimeout(this.timerToken);
    }

    getLastBuildInfo(): any { 
        this.logger.info('Refreshing build info');
        http.get(this.path)
            .then((response) => {
                this.latBuildInfoData = response.data;
                console.log(this.latBuildInfoData);
            }, (error) => {
                console.error(error);
            });
    }
}