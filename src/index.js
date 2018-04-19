import './index.scss';
import 'isomorphic-fetch';
import WebFont from 'webfontloader';
import Lazy from './scripts/lazy';
import plotRadar from './scripts/util/factory';
import plotErrorMessage from './scripts/util/errorPlotter';
import mdl from './scripts/util/mdl';

// Start MDL
mdl();

Promise.all([
    Lazy.modules.d3(),
    Lazy.modules.dialogPolyfill()
]).then(modules => {
    let d3, dialogPolyfill;
    [d3, dialogPolyfill] = modules;

    d3.json('/data').then((data) => {
        plotRadar('XT Tech Radar', data);
        d3.select('.xtr-full-page-loader').classed('hidden', true);
    }).catch((err) => {
        d3.select('.xtr-full-page-loader').classed('hidden', true);
        plotErrorMessage(d3, err, 10000);
    });

    const dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });

    // About page functionality
    d3.select('#xtr-info-button')
        .classed('hidden', false)
        .on('click', () => {
            d3.select('#xtr-main-loader').classed('hidden', false);
            d3.text('/docs/About.md').then(function (text) {
                Lazy.modules.markDownIt().then(MarkDownIt => {
                    const md = new MarkDownIt();
                    d3.select('#xtr-main-loader').classed('hidden', true);
                    dialog.open = false;
                    const result = md.render(text);
                    dialog.querySelector('.mdl-dialog__content').innerHTML = result;
                    dialog.showModal();
                    dialog.querySelector('.mdl-dialog__content').scrollTop = 0;
                });
            }).catch(function (err) {
                plotErrorMessage(d3, err);
            });
        });
});

// Load Google fonts
WebFont.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons']
    }
});