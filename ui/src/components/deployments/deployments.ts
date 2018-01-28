import { Component, Vue, Prop } from 'vue-property-decorator';
import './deployments.scss';
import { Logger } from '../../util/log';
import axios, { AxiosResponse } from 'axios';


@Component({
    template: require('./deployments.html')
})
export class DeploymentsComponent extends Vue {
    protected logger: Logger;

    private axios;

    constructor() {
        super();
        this.axios = axios;
    }

    public filter = '';

    public deployments = [];
    
    private url = 'http://localhost:5000/api/deployments';
    
    created() {
        this.axios.get(this.url)
            .then((response: AxiosResponse) => {
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
        for (let deployment of this.deployments) {
            if (deployment.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
                || deployment.deploymentKey.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
                || deployment.buildKey.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1) {
                
                fiteredRows.push(deployment);
            }
        }

        return fiteredRows;
    }

    
}
