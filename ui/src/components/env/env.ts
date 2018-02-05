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

    @Prop()
    type: string;

    style: string = 'env';

    private setType(envName) {
        if (envName.toLowerCase().indexOf('dev') !== -1) {
            this.type = 'development';
        } else if (envName.toLowerCase().indexOf('int') !== -1) {
            this.type = 'integration';
        } else if (envName.toLowerCase().indexOf('uat') !== -1) {
            this.type = 'uat';
        } else if (envName.toLowerCase().indexOf('load') !== -1) {
            this.type = 'performance';
        } else {
            this.type = 'production';
        }
    }

    get computedStyleClass() {
        return 'type ' + this.type;
    }

    get shortType(): string {
        switch (this.type) {
            case 'development':
                return 'dev';
            case 'integration':
                return 'int';
            case 'performance':
                return 'perf';
            case 'production':
                return 'prod';
            default: 
                return this.type;
        }
    }

    crated() {
        if (!this.logger) this.logger = new Logger();
        if (!this.type) {
            this.logger.info('No type set');
            this.setType(this.name);
        } else {
            this.style = this.type;
        }
    }
}
