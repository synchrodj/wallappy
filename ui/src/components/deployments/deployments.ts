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

    public deployments = [];
    
    private url = '/api/deployments';
    
    created() {
        http.get(this.url)
            .then((response) => {
                this.deployments = response.data;
                console.log(this.deployments);
            }, (error) => {
                console.error(error);
            });
    }

    get filteredRows() {
        if (this.filter === '') {
            return this.deployments;
        }

        let fiteredRows = [];
        let filter: string = this.filter.toLowerCase().trim();
        for (let deployment of this.deployments) {
            if (deployment.name.toLowerCase().indexOf(filter) !== -1
                || deployment.deploymentKey.toLowerCase().indexOf(filter) !== -1
                || deployment.buildKey.toLowerCase().indexOf(filter) !== -1) {
                
                fiteredRows.push(deployment);
            }
        }

        return fiteredRows;
    }

    
}
