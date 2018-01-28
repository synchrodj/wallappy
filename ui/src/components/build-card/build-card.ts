import { Component, Vue, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import { Logger } from '../../util/log';
import './build-card.scss';

@Component({
    template: require('./build-card.html')
})
export class BuildCard extends Vue {
    protected logger: Logger;
    
    @Prop()
    app: string;

    private axios;

    latBuildInfoData: any = {};

    timerToken: any;

    constructor() {
        super();
        this.axios = axios;
        this.logger = new Logger();
    }

    private url = `http://localhost:5000/api/apps/${this.app}/builds?limit=1`;
    // private url = '/api/builds';

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

    // To be queried from backend
    getLastBuildInfo(): any {
        this.logger.info('Refreshing build info');
        this.axios.get(this.url)
            .then((response: AxiosResponse) => {
                this.latBuildInfoData = response.data;
                console.log(this.latBuildInfoData);
            }, (error) => {
                console.error(error);
            });

        /* this.latBuildInfoData = {
            version: '3.122',
            status: 'success',
            changesets: [
                {
                    type: 'code',
                    sourceId: 'author-id',
                    id: 'c9d6630b88143dab6a922c5cffe931dae68a612a',
                    displayId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
                    description: 'Added changeset watcher with long description with long description with long description with long description',
                    profileAvatarUri: '/assets/img/user-generic.png'
                }, {
                    type: 'build',
                    sourceId: 'build-id',
                    id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
                    displayId: 'my-module',
                    description: 'Module update to 5.44',
                    profileAvatarUri: '/assets/img/bamboo.svg'
                }
            ]
        };*/
    }
}