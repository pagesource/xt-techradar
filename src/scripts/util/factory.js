const d3 = require('d3');
const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
};

const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const ExceptionMessages = require('./exceptionMessages');

const plotRadar = function (title, blips) {
    document.title = title;
    d3.selectAll(".mdl-progress").remove();

    console.log(title, blips);

    blips = [{
        description: 'Dolor fugiat ut nulla laboris aliqua.',
        isNew: 'false',
        name: 'Composer',
        quadrant: 'grow',
        ring: 'concepts'
    }, {
        description: 'Dolor fugiat ut nulla laboris aliqua.',
        isNew: 'false',
        name: 'Composer',
        quadrant: 'ubiquitous',
        ring: 'frameworks'
    }, {
        description: 'Dolor fugiat ut nulla laboris aliqua.',
        isNew: 'false',
        name: 'Composer',
        quadrant: 'de-emphasize',
        ring: 'tools'
    }];

    var quadrantNames = ['scale/grow', 'ubiquitous', 'de-emphasize', 'incubate'];
    var ringNames = ['concepts', 'tools/sdk', 'frameworks'];

    var rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
    var ringMap = {};
    var quadrants = {};
    var maxRings = 4;

    _.each(ringNames, function (name, i) {
        if (i == maxRings) {
            throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
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
        _.each(quadrantNames, function(name){
            if(name.match(new RegExp(blip.quadrant,'ig'))) {
                quadrant = name;
            }
        });
        // Check if the ring name matches defaults
        _.each(ringNames, function(name){
            if(name.match(new RegExp(blip.ring,'ig'))) {
                ring = name;
            }
        });
        // Add the blip only if it matches either of the rings and quadrants
        if(quadrant !== '' && ring !== '') {
            quadrants[quadrant].add(new Blip(blip.name, ringMap[ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description));
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

    new GraphingRadar(size, radar).init().plot();
}

function plotErrorMessage(exception) {
    d3.selectAll(".loading").remove();
    var message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else if (exception instanceof SheetNotFoundError) {
        message = exception.message;
    } else {
        console.error(exception);
    }

    message = message.concat('<br/>', 'Please check <a href="https://www.thoughtworks.com/radar/how-to-byor">FAQs</a> for possible solutions.');

    d3.select('body')
        .append('div')
        .attr('class', 'error-container')
        .append('div')
        .attr('class', 'error-container__message')
        .append('p')
        .html(message);
}

module.exports = plotRadar;