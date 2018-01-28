import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';

interface Pod {
    id: string;
    name: string;
    uri: string;
}

@Component({
    template: require('./pods.html')
})
export class PodsComponent extends Vue {

    pods: Pod[] = [];
    // private url = 'http://localhost:5000/api/pods';
    private url = '/api/pods';
    protected axios;
    podId: string = '';

    constructor() {
      super();
      this.axios = axios;
    }

    mounted() {
        this.$nextTick(() => {
            this.loadItems();
        });
    }

    private loadItems() {
        if (!this.pods.length) {
            this.axios.get(this.url).then((response: AxiosResponse) => {
                this.pods = response.data;
            }, (error) => {
                console.error(error);
            });
        }
    }
}
