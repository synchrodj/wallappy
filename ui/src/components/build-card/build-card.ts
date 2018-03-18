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
    buildInfo;

    @Prop()
    appInfo: any;

    timerToken: any;

    constructor() {
        super();
        this.logger = new Logger();
    }

    created() {
        // this.getLastBuildInfo();
        // this.timerToken = setInterval(() => this.getLastBuildInfo(), 5000);   
    }

    destroyed() {
        this.logger.info('Destroyed!');
        // clearTimeout(this.timerToken);
    }
}