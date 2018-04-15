const d3 = require('d3');
const d3tip = require('d3-tip');
const Chance = require('chance');
const _ = require('lodash');
const md = require('markdown-it')();
const dialogPolyfill = require('dialog-polyfill');

const RingCalculator = require('../util/ringCalculator');

const MIN_BLIP_WIDTH = 12;

const Radar = function (size, radar, tags) {
  var svg, radarElement, dialog;

  dialog = document.querySelector('dialog');
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
  });

  var tip = d3tip().attr('class', 'd3-tip').html(function (text) {
    return text;
  });

  tip.direction(function () {
    if (d3.select('.xtr-quadrant-list.selected').node()) {
      var selectedQuadrant = d3.select('.xtr-quadrant-list.selected');
      if (selectedQuadrant.classed('first') || selectedQuadrant.classed('fourth'))
        return 'ne';
      else
        return 'nw';
    }
    return 'n';
  });

  var ringCalculator = new RingCalculator(radar.rings().length, center());

  var self = {};

  function center() {
    return Math.round(size / 2);
  }

  function toRadian(angleInDegrees) {
    return Math.PI * angleInDegrees / 180;
  }

  function plotLines(quadrantGroup, quadrant) {
    var startX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle)) + 1) / 2);
    var endX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle - 90)) + 1) / 2);

    var startY = size * (1 - (Math.cos(toRadian(quadrant.startAngle)) + 1) / 2);
    var endY = size * (1 - (Math.cos(toRadian(quadrant.startAngle - 90)) + 1) / 2);

    if (startY > endY) {
      var aux = endY;
      endY = startY;
      startY = aux;
    }

    quadrantGroup.append('line')
      .attr('x1', center()).attr('x2', center())
      .attr('y1', startY - 2).attr('y2', endY + 2)
      .attr('stroke-width', 10);

    quadrantGroup.append('line')
      .attr('x1', endX).attr('y1', center())
      .attr('x2', startX).attr('y2', center())
      .attr('stroke-width', 10);
  }

  function plotQuadrant(rings, quadrant) {
    var quadrantGroup = svg.append('g')
      .attr('class', 'quadrant-group quadrant-group-' + quadrant.order);

    // Old code
    // .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
    // .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
    // .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));

    rings.forEach(function (ring, i) {
      var arc = d3.arc()
        .innerRadius(ringCalculator.getRadius(i))
        .outerRadius(ringCalculator.getRadius(i + 1))
        .startAngle(toRadian(quadrant.startAngle))
        .endAngle(toRadian(quadrant.startAngle - 90));

      quadrantGroup.append('path')
        .attr('d', arc)
        .attr('class', 'ring-arc-' + ring.order())
        .attr('transform', 'translate(' + center() + ', ' + center() + ')');
    });

    return quadrantGroup;
  }

  function plotTexts(quadrantGroup, rings, quadrant) {
    rings.forEach(function (ring, i) {
      if (quadrant.order === 'first' || quadrant.order === 'fourth') {
        quadrantGroup.append('text')
          .attr('class', 'line-text')
          .attr('y', center() + 4)
          .attr('x', center() + (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
          .attr('text-anchor', 'middle')
          .text(ring.name());
      } else {
        quadrantGroup.append('text')
          .attr('class', 'line-text')
          .attr('y', center() + 4)
          .attr('x', center() - (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
          .attr('text-anchor', 'middle')
          .text(ring.name());
      }
    });
  }

  function triangle(blip, x, y, order, group) {
    return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
      .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function triangleLegend(x, y, group) {
    return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
      .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
  }

  function circle(blip, x, y, order, group) {
    return (group || svg).append('path')
      .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
      .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function circleLegend(x, y, group) {
    return (group || svg).append('path')
      .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
      .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
  }

  function calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle) {
    var adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
    var adjustY = -Math.cos(toRadian(startAngle)) - Math.sin(toRadian(startAngle));

    var radius = chance.floating({
      min: minRadius + blip.width / 2,
      max: maxRadius - blip.width / 2
    });
    var angleDelta = Math.asin(blip.width / 2 / radius) * 180 / Math.PI;
    angleDelta = angleDelta > 45 ? 45 : angleDelta;
    var angle = toRadian(chance.integer({
      min: angleDelta,
      max: 90 - angleDelta
    }));

    var x = center() + radius * Math.cos(angle) * adjustX;
    var y = center() + radius * Math.sin(angle) * adjustY;

    return [x, y];
  }

  function thereIsCollision(blip, coordinates, allCoordinates) {
    return allCoordinates.some(function (currentCoordinates) {
      return (Math.abs(currentCoordinates[0] - coordinates[0]) < blip.width) && (Math.abs(currentCoordinates[1] - coordinates[1]) < blip.width)
    });
  }

  function plotBlips(quadrantGroup, rings, quadrantWrapper) {
    var blips, quadrant, startAngle, order;

    quadrant = quadrantWrapper.quadrant;
    startAngle = quadrantWrapper.startAngle;
    order = quadrantWrapper.order;

    d3.select('#xtr-quadrant-list-' + order + ' .mdl-list')
      .append('li')
      .attr('class', 'mdl-list__item')
      .append('span')
      .attr('class', 'mdl-typography--menu mdl-typography--text-uppercase ' + order)
      .text(quadrant.name());

    blips = quadrant.blips();
    rings.forEach(function (ring, i) {
      var ringBlips = blips.filter(function (blip) {
        return blip.ring() == ring;
      });

      if (ringBlips.length == 0) {
        return;
      }

      var maxRadius, minRadius;

      minRadius = ringCalculator.getRadius(i);
      maxRadius = ringCalculator.getRadius(i + 1);

      var sumRing = ring.name().split('').reduce(function (p, c) {
        return p + c.charCodeAt(0);
      }, 0);
      var sumQuadrant = quadrant.name().split('').reduce(function (p, c) {
        return p + c.charCodeAt(0);
      }, 0);
      var chance = new Chance(Math.PI * sumRing * ring.name().length * sumQuadrant * quadrant.name().length);

      // Old code
      // var ringList = addRing(ring.name(), order);

      // New code
      var ringList = d3.select('#xtr-quadrant-list-' + order + ' .mdl-list');
      var allBlipCoordinatesInRing = [];

      ringBlips.forEach(function (blip, i, blips) {
        const coordinates = findBlipCoordinates(blip,
          minRadius,
          maxRadius,
          startAngle,
          allBlipCoordinatesInRing);

        allBlipCoordinatesInRing.push(coordinates);
        drawBlipInCoordinates(blip, coordinates, order, quadrantGroup, ringList);
      });
    });
  }

  function findBlipCoordinates(blip, minRadius, maxRadius, startAngle, allBlipCoordinatesInRing) {
    const maxIterations = 200;
    var coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
    var iterationCounter = 0;
    var foundAPlace = false;

    while (iterationCounter < maxIterations) {
      if (thereIsCollision(blip, coordinates, allBlipCoordinatesInRing)) {
        coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
      } else {
        foundAPlace = true;
        break;
      }
      iterationCounter++;
    }

    if (!foundAPlace && blip.width > MIN_BLIP_WIDTH) {
      blip.width = blip.width - 1;
      return findBlipCoordinates(blip, minRadius, maxRadius, startAngle, allBlipCoordinatesInRing);
    } else {
      return coordinates;
    }
  }

  function drawBlipInCoordinates(blip, coordinates, order, quadrantGroup, ringList) {
    var x = coordinates[0];
    var y = coordinates[1];

    var group = quadrantGroup.append('g').attr('class', 'blip-link blip-link-' + blip.number());

    if (blip.isNew()) {
      triangle(blip, x, y, order, group);
    } else {
      circle(blip, x, y, order, group);
    }

    group.append('text')
      .attr('x', x)
      .attr('y', y + 4)
      .attr('class', 'blip-text')
      // derive font-size from current blip width
      .style('font-size', ((blip.width * 10) / 22) + 'px')
      .attr('text-anchor', 'middle')
      .text(blip.number());

    var blipListItem = ringList
      .append('li')
      .attr('class', 'xtr-list__data-item mdl-list__item ' + order);

    // Add data to the link
    blipListItem.node().dataset.data = blip.tags();
    blipListItem.node().dataset.number = blip.number();

    var blipText = blip.number() + '. ' + blip.name() + (blip.topic() ? ('. - ' + blip.topic()) : '');

    blipListItem.append('span')
      .attr('class', 'blip-list-item')
      .text(blipText);

    var mouseOver = function () {
      d3.selectAll('g.blip-link').attr('opacity', 0.3);
      group.attr('opacity', 1.0);

      blipListItem.classed('mdl-color--grey-300', true);
      tip.show(blip.name(), group.node());
    };

    var mouseOut = function () {
      d3.selectAll('g.blip-link').attr('opacity', 1.0);
      blipListItem.classed('mdl-color--grey-300', false);
      tip.hide().style('left', 0).style('top', 0);
    };

    blipListItem.on('mouseover', mouseOver).on('mouseout', mouseOut);
    group.on('mouseover', mouseOver).on('mouseout', mouseOut);

    const clickBlip = function () {
      d3.text('/docs/parcel.md').then(function (text) {
        createDialog(text);
      });
    }

    blipListItem.on('click', clickBlip);
    group.on('click', clickBlip)
  }

  function redrawFullRadar() {

    svg.style('left', 0).style('right', 0);

    d3.selectAll('.xtr-quadrant-list')
      .classed('selected', true);

    d3.selectAll('.quadrant-group')
      .transition()
      .duration(1000)
      .attr('transform', 'scale(1)');

    d3.selectAll('.quadrant-group .blip-link')
      .transition()
      .duration(1000)
      .attr('transform', 'scale(1)');

    d3.selectAll('.quadrant-group')
      .style('pointer-events', 'auto');
  }

  function plotQuadrantRadioButtons(quadrants, header) {

    function addRadioButton(quadrant, i) {

      d3.select('#xtr-main-quadrant-lists .mdl-card')
        .append('div')
        .attr('id', 'xtr-quadrant-list-' + quadrant.order)
        .attr('class', 'xtr-quadrant-list mdl-list-wrapper mdl-menu__item--full-bleed-divider selected ' + quadrant.order)
        .append('ul')
        .attr('class', 'mdl-list');


      var quadrantRadioItem = d3.select('#quadrants-list').append('li')
        .attr('class', 'mdl-list__item ' + quadrant.order)
        .classed('mdl-menu__item--full-bleed-divider', (quadrants.length - 1) === i)
        .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
        .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order));

      quadrantRadioItem.append('span')
        .attr('class', 'mdl-list__item-primary-content mdl-typography--text-capitalize')
        .text(quadrant.quadrant.name());

      quadrantRadioItem.append('span')
        .attr('class', 'mdl-list__item-secondary-action')
        .append('label')
        .attr('class', ' mdl-radio mdl-js-radio mdl-js-ripple-effect')
        .attr('for', 'quadrant-radio-' + quadrant.order)
        .append('input')
        .attr('type', 'radio')
        .attr('id', 'quadrant-radio-' + quadrant.order)
        .attr('class', 'mdl-radio__button quadrant-radio')
        .attr('name', 'quadrant')
        .attr('value', quadrant.quadrant.name())
        .on('change', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));
    }

    // New code
    d3.select('#quadrants-list').append('li')
      .attr('class', 'mdl-list__item')
      .append('span')
      .attr('class', 'mdl-typography--menu mdl-typography--text-uppercase mdl-color-text--grey-600')
      .text('Select Quadrant');

    // New code 
    var allQuadrantsRadioItem = d3.select('#quadrants-list').append('li')
      .attr('class', 'mdl-list__item');

    allQuadrantsRadioItem.append('span')
      .attr('class', 'mdl-list__item-primary-content mdl-typography--text-capitalize')
      .text('All');

    allQuadrantsRadioItem.append('span')
      .attr('class', 'mdl-list__item-secondary-action')
      .append('label')
      .attr('class', ' mdl-radio mdl-js-radio mdl-js-ripple-effect')
      .attr('for', 'all')
      .append('input')
      .attr('type', 'radio')
      .attr('id', 'all')
      .attr('class', 'mdl-radio__button')
      .attr('name', 'quadrant')
      .attr('value', 'all')
      .attr('checked', true)
      .on('change', redrawFullRadar);

    _.each([0, 1, 2, 3], function (i) {
      addRadioButton(quadrants[i], i);
    });

    // Old code
    // Printing button
    // header.append('div')
    //   .classed('print-radar button no-capitalize', true)
    //   .text('Print this radar')
    //   .on('click', window.print.bind(window));
  }

  function getSelectedTags() {
    const cboxes = document.getElementsByName('tags[]');
    const len = cboxes.length;
    const data = [];
    for (let i = 0; i < len; i++) {
      if (cboxes[i].checked) {
        data.push(cboxes[i].value);
      }
    }
    return data;
  }

  function plotTagSwitchButtons(tagValues, sidebar) {

    function addTagSwitch(tag) {
      var tagCheckboxItem = d3.select('#quadrants-list').append('li')
        .attr('class', 'mdl-list__item');

      tagCheckboxItem.append('span')
        .attr('class', 'mdl-list__item-primary-content mdl-typography--text-capitalize')
        .text(tag);


      tagCheckboxItem.append('span')
        .attr('class', 'mdl-list__item-secondary-action')
        .append('label')
        .attr('class', 'mdl-switch mdl-js-switch mdl-js-ripple-effect')
        .attr('for', 'tag-switch-' + _.kebabCase(tag))
        .append('input')
        .attr('type', 'checkbox')
        .attr('id', 'tag-switch-' + _.kebabCase(tag))
        .attr('class', 'mdl-switch__input tag-switch')
        .attr('name', 'tags[]')
        .attr('checked', true)
        .attr('value', tag)
        .on('change', switchTag.bind({}, tagValues));
    }

    d3.select('#quadrants-list').append('li')
      .attr('class', 'mdl-list__item')
      .append('span')
      .attr('class', 'mdl-typography--menu mdl-typography--text-uppercase mdl-color-text--grey-600')
      .text('Select Tags');

    _.each(tagValues, function (tag) {
      addTagSwitch(tag);
    });
  }


  function mouseoverQuadrant(order) {
    d3.select('.quadrant-group-' + order).style('opacity', 1);
    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 0.3);
  }

  function mouseoutQuadrant(order) {
    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 1);
  }

  function switchTag(allTags) {
    var selectedTags = getSelectedTags();
    d3.selectAll('.xtr-list__data-item').each(function () {
      var isHidden = true;
      var dataItem = d3.select(this);
      var blipTags = dataItem.node().dataset.data.split(',');
      var blipNumber = dataItem.node().dataset.number;
      var dataBlip = d3.select('.blip-link-' + blipNumber);
      blipTags.forEach(function (blipTag) {
        selectedTags.forEach(function (selectedTag) {
          if (blipTag === selectedTag) {
            isHidden = false;
          }
        });
      });
      dataBlip.classed('hidden', isHidden);
      dataItem.classed('hidden', isHidden);
    });
  }

  function createDialog(mdData) {
    dialog.open = false;
    const result = md.render(mdData);
    dialog.querySelector('.mdl-dialog__content').innerHTML = result;
    dialog.showModal();
  }

  function selectQuadrant(order, startAngle) {

    d3.selectAll('.xtr-quadrant-list').classed('selected', false);
    d3.selectAll('.xtr-quadrant-list.' + order).classed('selected', true);

    var scale = 2;

    var adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
    var adjustY = Math.cos(toRadian(startAngle)) + Math.sin(toRadian(startAngle));

    var translateX = (-1 * (1 + adjustX) * size / 2 * (scale - 1)) + (-adjustX * (1 - scale / 2) * size);
    var translateY = (-1 * (1 - adjustY) * (size / 2 - 7) * (scale - 1)) - ((1 - adjustY) / 2 * (1 - scale / 2) * size);

    var translateXAll = (1 - adjustX) / 2 * size * scale / 2 + ((1 - adjustX) / 2 * (1 - scale / 2) * size);
    var translateYAll = (1 + adjustY) / 2 * size * scale / 2;

    var moveRight = (1 + adjustX) * (0.8 * window.innerWidth - size) / 2;
    var moveLeft = (1 - adjustX) * (0.8 * window.innerWidth - size) / 2;

    var blipScale = 3 / 4;
    var blipTranslate = (1 - blipScale) / blipScale;

    svg.style('left', 0).style('right', 0);

    d3.select('.quadrant-group-' + order)
      .transition()
      .duration(1000)
      .attr('transform', 'translate(' + translateX + ',' + translateY + ')scale(' + scale + ')');
    d3.selectAll('.quadrant-group-' + order + ' .blip-link text').each(function () {
      var x = d3.select(this).attr('x');
      var y = d3.select(this).attr('y');
      d3.select(this.parentNode)
        .transition()
        .duration(1000)
        .attr('transform', 'scale(' + blipScale + ')translate(' + blipTranslate * x + ',' + blipTranslate * y + ')');
    });

    d3.selectAll('.quadrant-group')
      .style('pointer-events', 'auto');

    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')')
      .transition()
      .duration(1000)
      .style('pointer-events', 'none')
      .attr('transform', 'translate(' + translateXAll + ',' + translateYAll + ')scale(0)');
  }

  self.init = function () {
    radarElement = d3.select('.xtr-main-radar').append('div').attr('id', 'radar');
    return self;
  };

  self.plot = function () {
    var rings, quadrants;

    rings = radar.rings();
    quadrants = radar.quadrants();

    plotQuadrantRadioButtons(quadrants);
    plotTagSwitchButtons(tags);

    radarElement.style('height', size + 14 + 'px');
    svg = radarElement.append("svg").call(tip);
    svg.attr('id', 'radar-plot').attr('width', size).attr('height', size + 14);

    _.each(quadrants, function (quadrant) {
      var quadrantGroup = plotQuadrant(rings, quadrant);
      plotLines(quadrantGroup, quadrant);
      plotTexts(quadrantGroup, rings, quadrant);
      plotBlips(quadrantGroup, rings, quadrant);
    });

  };

  return self;
};

module.exports = Radar;