import plotErrorMessage from '../util/errorPlotter';
import RingCalculator from '../util/ringCalculator';
import Lazy from '../lazy';

const MIN_BLIP_WIDTH = 12;
let chance;
let scrollToDebounce = null;

const Radar = function (size, radar, tags) {
  return Promise.all([
    Lazy.modules.d3(),
    Lazy.modules.d3Tip(),
    Lazy.modules.lodash(),
    Lazy.modules.chance(),
    Lazy.modules.markDownIt()
  ]).then(modules => {
    let d3, d3tip, _, Chance, MarkDownIt;
    [d3, d3tip, _, Chance, MarkDownIt] = modules;
  
    const md = new MarkDownIt();
    const dialog = document.querySelector('dialog');
   
    let svg, radarElement;


    let tip = d3tip().attr('class', 'd3-tip').html(function (text) {
      return text;
    });

    tip.direction(function () {
      if (d3.select('.xtr-quadrant-list.selected').node()) {
        const selectedQuadrant = d3.select('.xtr-quadrant-list.selected');
        if (selectedQuadrant.classed('first') || selectedQuadrant.classed('fourth'))
          return 'ne';
        else
          return 'nw';
      }
      return 'n';
    });

    const ringCalculator = new RingCalculator(radar.rings().length, center());
    const self = {};

    function center() {
      return Math.round(size / 2);
    }

    function toRadian(angleInDegrees) {
      return Math.PI * angleInDegrees / 180;
    }

    function plotLines(quadrantGroup, quadrant) {
      const startX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle)) + 1) / 2);
      const endX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle - 90)) + 1) / 2);

      let startY = size * (1 - (Math.cos(toRadian(quadrant.startAngle)) + 1) / 2);
      let endY = size * (1 - (Math.cos(toRadian(quadrant.startAngle - 90)) + 1) / 2);

      if (startY > endY) {
        let aux = endY;
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
      const quadrantGroup = svg.append('g')
        .attr('class', 'quadrant-group quadrant-group-' + quadrant.order);

      // Old code
      // .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
      // .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
      // .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));

      rings.forEach(function (ring, i) {
        const arc = d3.arc()
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

    function circle(blip, x, y, order, group) {
      return (group || svg).append('path')
        .attr('d', 'M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092')
        .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
        .attr('class', order);
    }

    function calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle) {
      const adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
      const adjustY = -Math.cos(toRadian(startAngle)) - Math.sin(toRadian(startAngle));

      const radius = chance.floating({
        min: minRadius + blip.width / 2,
        max: maxRadius - blip.width / 2
      });
      let angleDelta = Math.asin(blip.width / 2 / radius) * 180 / Math.PI;
      angleDelta = angleDelta > 45 ? 45 : angleDelta;
      const angle = toRadian(chance.integer({
        min: angleDelta,
        max: 90 - angleDelta
      }));

      const x = center() + radius * Math.cos(angle) * adjustX;
      const y = center() + radius * Math.sin(angle) * adjustY;

      return [x, y];
    }

    function thereIsCollision(blip, coordinates, allCoordinates) {
      return allCoordinates.some(function (currentCoordinates) {
        return (Math.abs(currentCoordinates[0] - coordinates[0]) < blip.width) && (Math.abs(currentCoordinates[1] - coordinates[1]) < blip.width);
      });
    }

    function plotBlips(quadrantGroup, rings, quadrantWrapper) {
      let blips, quadrant, startAngle, order;

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
        const ringBlips = blips.filter(function (blip) {
          return blip.ring() === ring;
        });

        if (ringBlips.length === 0) {
          return;
        }

        let maxRadius, minRadius;

        minRadius = ringCalculator.getRadius(i);
        maxRadius = ringCalculator.getRadius(i + 1);

        const sumRing = ring.name().split('').reduce(function (p, c) {
          return p + c.charCodeAt(0);
        }, 0);
        const sumQuadrant = quadrant.name().split('').reduce(function (p, c) {
          return p + c.charCodeAt(0);
        }, 0);

        chance = new Chance(Math.PI * sumRing * ring.name().length * sumQuadrant * quadrant.name().length);

        // New code
        const ringList = d3.select('#xtr-quadrant-list-' + order + ' .mdl-list');
        let allBlipCoordinatesInRing = [];

        ringBlips.forEach(function (blip) {
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
      let coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
      let iterationCounter = 0;
      let foundAPlace = false;

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
      const x = coordinates[0];
      const y = coordinates[1];

      const group = quadrantGroup.append('g').attr('class', 'blip-link blip-link-' + blip.number());

      circle(blip, x, y, order, group);

      group.append('text')
        .attr('x', x)
        .attr('y', y + 4)
        .attr('class', 'blip-text')
        // derive font-size from current blip width
        .style('font-size', ((blip.width * 10) / 22) + 'px')
        .attr('text-anchor', 'middle')
        .text(blip.number());

      const blipListItem = ringList
        .append('li')
        .attr('class', 'xtr-list__data-item mdl-list__item ' + order);

      // Add data to the link
      blipListItem.node().dataset.data = blip.tags();
      blipListItem.node().dataset.number = blip.number();

      const blipText = blip.number() + '. ' + blip.name() + (blip.topic() ? ('. - ' + blip.topic()) : '');

      blipListItem.append('span')
        .attr('class', 'blip-list-item')
        .text(blipText);

      const mouseOver = function () {
        d3.selectAll('g.blip-link').attr('opacity', 0.3);
        group.attr('opacity', 1.0);

        blipListItem.classed('mdl-color--grey-300', true);
        tip.show(blip.name(), group.node());
      };

      const mouseOut = function () {
        d3.selectAll('g.blip-link').attr('opacity', 1.0);
        blipListItem.classed('mdl-color--grey-300', false);
        tip.hide().style('left', 0).style('top', 0);
      };


      const debouncer = function() {
        if(scrollToDebounce) {
          clearTimeout(scrollToDebounce);
        }
        scrollToDebounce = setTimeout(() => {
          blipListItem.node().scrollIntoView();
        }, 600);
      };

      blipListItem.on('mouseover', mouseOver).on('mouseout', mouseOut);
      group.on('mouseover', () => {
        mouseOver();
        debouncer();
      }).on('mouseout', mouseOut);

      const clickBlip = function () {
        d3.select('#xtr-main-loader').classed('hidden', false);
        d3.text('/docs/' + blip.filename()).then(function (text) {
          d3.select('#xtr-main-loader').classed('hidden', true);
          createDialog(text);
        }).catch(function (err) {
          plotErrorMessage(d3, err);
        });
      };

      blipListItem.on('click', clickBlip);
      group.on('click', clickBlip);
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

    function plotQuadrantRadioButtons(quadrants) {

      function addRadioButton(quadrant, i) {

        d3.select('#xtr-main-quadrant-lists .mdl-card')
          .append('div')
          .attr('id', 'xtr-quadrant-list-' + quadrant.order)
          .attr('class', 'xtr-quadrant-list mdl-list-wrapper mdl-menu__item--full-bleed-divider selected ' + quadrant.order)
          .append('ul')
          .attr('class', 'mdl-list');


        const quadrantRadioItem = d3.select('#quadrants-list').append('li')
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
      const allQuadrantsRadioItem = d3.select('#quadrants-list').append('li')
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

    function plotTagSwitchButtons(tagValues) {

      function addTagSwitch(tag) {
        const tagCheckboxItem = d3.select('#quadrants-list').append('li')
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

    function switchTag() {
      const selectedTags = getSelectedTags();
      d3.selectAll('.xtr-list__data-item').each(function () {
        let isHidden = true;
        const dataItem = d3.select(this);
        const blipTags = dataItem.node().dataset.data.split(',');
        const blipNumber = dataItem.node().dataset.number;
        const dataBlip = d3.select('.blip-link-' + blipNumber);
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
      dialog.querySelector('.mdl-dialog__content').scrollTop = 0;
    }

    function selectQuadrant(order, startAngle) {

      d3.selectAll('.xtr-quadrant-list').classed('selected', false);
      d3.selectAll('.xtr-quadrant-list.' + order).classed('selected', true);

      const scale = 2;

      const adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
      const adjustY = Math.cos(toRadian(startAngle)) + Math.sin(toRadian(startAngle));

      const translateX = (-1 * (1 + adjustX) * size / 2 * (scale - 1)) + (-adjustX * (1 - scale / 2) * size);
      const translateY = (-1 * (1 - adjustY) * (size / 2 - 7) * (scale - 1)) - ((1 - adjustY) / 2 * (1 - scale / 2) * size);

      const translateXAll = (1 - adjustX) / 2 * size * scale / 2 + ((1 - adjustX) / 2 * (1 - scale / 2) * size);
      const translateYAll = (1 + adjustY) / 2 * size * scale / 2;

      const blipScale = 3 / 4;
      const blipTranslate = (1 - blipScale) / blipScale;

      svg.style('left', 0).style('right', 0);

      d3.select('.quadrant-group-' + order)
        .transition()
        .duration(1000)
        .attr('transform', 'translate(' + translateX + ',' + translateY + ')scale(' + scale + ')');
      d3.selectAll('.quadrant-group-' + order + ' .blip-link text').each(function () {
        const x = d3.select(this).attr('x');
        const y = d3.select(this).attr('y');
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
      let rings, quadrants;

      rings = radar.rings();
      quadrants = radar.quadrants();

      plotQuadrantRadioButtons(quadrants);
      plotTagSwitchButtons(tags);

      radarElement.style('height', size + 14 + 'px');
      svg = radarElement.append('svg').call(tip);
      svg.attr('id', 'radar-plot').attr('width', size).attr('height', size + 14);

      _.each(quadrants, function (quadrant) {
        const quadrantGroup = plotQuadrant(rings, quadrant);
        plotLines(quadrantGroup, quadrant);
        plotTexts(quadrantGroup, rings, quadrant);
        plotBlips(quadrantGroup, rings, quadrant);
      });

    };
    return self;
  });
};

export default Radar;