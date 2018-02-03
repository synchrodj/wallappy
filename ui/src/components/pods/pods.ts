import { Component, Vue } from 'vue-property-decorator';
import http from '../../services/http';

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
    private path = '/api/pods';

    podId: string = '';

    mounted() {
        this.$nextTick(() => {
            this.loadItems();
        });
    }

    private loadItems() {
        if (!this.pods.length) {
            http.get(this.path).then((response) => {
                this.pods = response.data;
            }, (error) => {
                console.error(error);
            });
        }
    }
}
