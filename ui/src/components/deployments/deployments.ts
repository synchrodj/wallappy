import { Component, Vue, Prop } from 'vue-property-decorator';
import './deployments.scss';
import { Logger } from '../../util/log';
import http from '../../services/http';

@Component({
    template: require('./deployments.html')
})
export class DeploymentsComponent extends Vue {
    protected logger: Logger;
    
    public filter = '';

    private url = '/api/deployments';
    
    get filteredRows() {
        if (this.filter === '') {
            return this.$store.state.deployments;
        }

        let fiteredRows = [];
        let filter: string = this.filter.toLowerCase().trim();
        for (let deployment of this.$store.state.deployments) {
            if (deployment.name.toLowerCase().indexOf(filter) !== -1
                || deployment.deploymentKey.toLowerCase().indexOf(filter) !== -1
                || deployment.buildKey.toLowerCase().indexOf(filter) !== -1) {
                
                fiteredRows.push(deployment);
            }
        }

        return fiteredRows;
    }

    
}
