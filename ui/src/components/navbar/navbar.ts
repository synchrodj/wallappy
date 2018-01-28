import { format } from 'path';
import { Collapse, Dropdown } from 'uiv';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Link } from './link';
import { Logger } from '../../util/log';

import './navbar.scss';

@Component({
    template: require('./navbar.html'),
    components: {
        collapse: Collapse,
    }
}) 
export class NavbarComponent extends Vue {

    protected logger: Logger;

    inverted: boolean = true; // default value

    showNavbar = false;

    object: { default: string } = { default: 'Default object property!' }; // objects as default values don't need to be wrapped into functions

    activeIndex: string = '0';

   links: Link[] = [
        new Link('Home', '/', 'home'),
        new Link('Deployments', '/deployments', 'cloud'),
        new Link('Pods', '/pods', 'group'),
        new Link('Demo', '/wallboard/pods/mypod/apps/myapp', 'chevron-right'),
        new Link('Admin', '/about', 'gears')
     ];

    @Watch('$route.path')
    pathChanged() {
        this.logger.info('Changed current path to: ' + this.$route.path);
    }

    mounted() {
        if (!this.logger) this.logger = new Logger();
        this.$nextTick(() => this.logger.info(this.object.default));
    }

    handleSelect(index) {
        console.log();
        this.logger.info('Transition to ' + JSON.stringify(this.links[index]));
        this.$router.push(this.links[index].path);
        this.activeIndex = index;
    }
  
}
