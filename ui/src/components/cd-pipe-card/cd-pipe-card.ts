
import { Component, Vue, Prop } from 'vue-property-decorator';
import './cd-pipe-card.scss';
import { Logger } from '../../util/log';

@Component({
    template: require('./cd-pipe-card.html')
})
export class CDPipeCard extends Vue {
    protected logger: Logger;

    @Prop()
    app: string;

    cdPipesData: any = [];

    mounted() {
        if (!this.logger) this.logger = new Logger();
        this.logger.info('CD pipe card mounted for ' + this.app);
        this.getCDPipes();
    }

    get cdPipes() {
        return this.cdPipesData;
    }

    getCDPipes() {
        this.cdPipesData =  [
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
