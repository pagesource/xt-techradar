import './index.scss';
import 'material-design-lite';
import * as d3 from 'd3';
import plotRadar from './scripts/util/factory';
import plotErrorMessage from './scripts/util/errorPlotter';

d3.json('/data').then((data) => {
    plotRadar('XT Tech Radar', data);
    d3.select('.xtr-full-page-loader').classed('hidden', true);
    if (!(typeof (componentHandler) === 'undefined')) {
        window.componentHandler.upgradeAllRegistered();
    }
}).catch((err) => {
    d3.select('.xtr-full-page-loader').classed('hidden', true);
    plotErrorMessage(err, 10000);
});