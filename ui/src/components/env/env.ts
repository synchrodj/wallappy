import { Component, Vue, Prop } from 'vue-property-decorator';
import './env.scss';
import { Logger } from '../../util/log';

@Component({
    template: require('./env.html')
})
export class Env extends Vue {
    protected logger: Logger;

    @Prop()
    name: string;

    type: string = 'env';

    style: string = 'env';

    configEnvType(envs: any): void {
        for (let env of envs) {
            console.log(env);
            if (this.$props.name === env.name) {
                this.type = env.shortType;
                this.style = env.type;
            }
        }
    }

    private setType(envName) {
        if (envName.toLowerCase().indexOf('dev') !== -1) {
            this.type = 'dev';
            this.style = 'development';
        } else if (envName.toLowerCase().indexOf('int') !== -1) {
            this.type = 'int';
            this.style = 'integration';
        } else if (envName.toLowerCase().indexOf('uat') !== -1) {
            this.type = 'uat';
            this.style = 'uat';
        } else if (envName.toLowerCase().indexOf('load') !== -1) {
            this.type = 'perf';
            this.style = 'performance';
        } else {
            this.type = 'prod';
            this.style = 'production';
        }

        console.log('Env set to ' + this.type);
        console.log('Style set  to ' + this.type);
    }

    get computedStyleClass() {
        return 'type ' + this.style;
    }

    mounted() {
        if (!this.logger) this.logger = new Logger();
        console.log('Setting type ' + this.name);
        this.setType(this.name);
        // this.configEnvType(this.$store.state.envs);
    }


}
