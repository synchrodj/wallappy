import { Component, Vue } from 'vue-property-decorator';
import { Logger } from '../../util/log';
import './appwallboard.scss';

@Component({
    template: require('./appwallboard.html')
})
export class AppWallboardComponent extends Vue {

    protected logger: Logger;



    mounted() {
        if (!this.logger) this.logger = new Logger();
        this.$nextTick(() => {
            this.logger.info('Appwallboard is ready!');
            console.log(this.$store.state);
        });
    }

    get appInfo() {
        return {
            name: 'My app name',
            deployments: [
                {
                    pipeName: 'pipe001',
                    envs: [
                        {
                            name: 'Development',
                        },
                        {
                            name: 'Integration',
                        },
                        {
                            name: 'Performance',
                        },
                        {
                            name: 'Production',
                        }
                    ]
                },
                {
                    pipeName: 'pipe002',
                    envs: [
                        {
                            name: 'DEV',
                        },
                        {
                            name: 'INT',
                        },
                        {
                            name: 'PROD',
                        }
                    ]
                }
            ]
            
        };
    }
}
