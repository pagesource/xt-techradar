const d3 = require('d3');
const _ = require('lodash');

const defaults = require('./defaults');
const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const ExceptionMessages = require('./exceptionMessages');
const plotErrorMessage = require('./errorPlotter');

const plotRadar = function (title, blips) {
    document.title = title;
    d3.selectAll(".mdl-progress").classed('hidden', true);

    var quadrantNames = defaults.quadrantNames;
    var ringNames = defaults.ringNames;

    var rings = _.map(_.uniqBy(blips, defaults.ringsKey), defaults.ringsKey);
    var tags = _.union(..._.map(_.uniqBy(blips, defaults.tagsKey), defaults.tagsKey));

    var ringMap = {};
    var quadrants = {};
    var maxRings = 4;

    _.each(ringNames, function (name, i) {
        if (i == maxRings) {
            var exception = new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
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


    var radar = new Radar();

    _.each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant);
    });

    var wrapperWidth = d3.select('.xtr-main-radar').node().getBoundingClientRect().width;
    var calculateWidth = window.innerHeight > wrapperWidth ? wrapperWidth : window.innerHeight;

    // var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
    var size = (calculateWidth - 133) < 550 ? 550 : calculateWidth - 133;

    new GraphingRadar(size, radar, tags).init().plot();
}

module.exports = plotRadar;