
const defaultKeys = [{
    name: 'name'
}, {
    name: 'description',
    content: true
}, {
    name: 'resources',
    content: true
}, {
    name: 'github',
    content: true
}, {
    name: 'quadrant',
    keyword: true
}, {
    name: 'type',
    keyword: true
}, {
    name: 'platform',
    tags: true
}];
const whitelistedKeys = ['filename', 'name', 'quadrant', 'ring', 'platform'];
const quadrantNames = ['scale/grow', 'ubiquitous', 'de-emphasize', 'incubate'];
const quandrants = quadrantNames;
const ringNames = ['concepts', 'tools/sdk', 'frameworks'];
const rings = ringNames;
const ringsKey = 'ring';
const tagsKey = 'platform';

module.exports = {
    defaultKeys,
    quadrantNames,
    ringNames,
    ringsKey,
    tagsKey,
    whitelistedKeys,
    quandrants,
    rings
};