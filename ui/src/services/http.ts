import axios from 'axios';

class Http {
    private host: string;

    constructor() {
        if (process.env.ENV === 'development') {
            this.host = 'http://localhost:5000';
            console.log('Runing in development mode. Api host set to ' + this.host);
        } else {
            this.host = '';
        }
    }   

    get(path) {
        return axios.get(this.host + path);
    }
}

let http: Http = new Http();
export default http; 