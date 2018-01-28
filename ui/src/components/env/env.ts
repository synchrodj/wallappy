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

        console.log('Env set: ' + this.type);
    }

    get computedTypeClass() {
        return 'type ' + this.style;
    }

    mounted() {
        if (!this.logger) this.logger = new Logger();
        console.log(this.$props.name);
        this.configEnvType(this.$store.state.envs);
    }


}
