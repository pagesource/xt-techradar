import * as d3 from 'd3';
import _ from 'lodash';
import defaults from './defaults';
import Radar from '../models/radar';
import Quadrant from '../models/quadrant';
import Ring from '../models/ring';
import Blip from '../models/blip';
import GraphingRadar from '../graphing/radar';
import MalformedDataError from '../exceptions/malformedDataError';
import ExceptionMessages  from './exceptionMessages';
import plotErrorMessage from './errorPlotter';


const plotRadar = function (title, blips) {
    document.title = title;
    d3.selectAll('.mdl-progress').classed('hidden', true);

    const quadrantNames = defaults.quadrantNames;
    const ringNames = defaults.ringNames;
    const tags = _.union(..._.map(_.uniqBy(blips, defaults.tagsKey), defaults.tagsKey));

    let ringMap = {};
    let quadrants = {};
    const maxRings = 4;

    _.each(ringNames, function (name, i) {
        if (i === maxRings) {
            const exception = new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
            plotErrorMessage(exception);
            throw exception;
        }
        if (!ringMap[name]) {
            ringMap[name] = new Ring(name, i);
        }
    });

    _.each(quadrantNames, function (name) {
        if (!quadrants[name]) {
            quadrants[name] = new Quadrant(_.capitalize(name));
        }
    });

    _.each(blips, function (blip) {
        let quadrant = '';
        let ring = '';
        // Check if the quadrant name matches defaults
        _.each(quadrantNames, function (name) {
            if (name.match(new RegExp(blip.quadrant, 'ig'))) {
                quadrant = name;
            }
        });
        // Check if the ring name matches defaults
        _.each(ringNames, function (name) {
            if (name.match(new RegExp(blip.ring, 'ig'))) {
                ring = name;
            }
        });
        // Add the blip only if it matches either of the rings and quadrants
        if (quadrant !== '' && ring !== '') {
            quadrants[quadrant].add(new Blip(blip.name, ringMap[ring], blip.filename, blip.topic, blip.description, blip[defaults.tagsKey]));
        }
    });


    const radar = new Radar();

    _.each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant);
    });

    const wrapperWidth = d3.select('.xtr-main-radar').node().getBoundingClientRect().width;
    const calculateWidth = window.innerHeight > wrapperWidth ? wrapperWidth : window.innerHeight;

    // var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
    const size = (calculateWidth - 133) < 550 ? 550 : calculateWidth - 133;

    new GraphingRadar(size, radar, tags).init().plot();
};

export default plotRadar;