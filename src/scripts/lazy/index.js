const _modules = {
    d3: () => import ('d3'),
    d3Tip: () => import ('d3-tip').then(obj => obj.default),
    chance: () => import ('chance').then(obj => obj.default),
    markDownIt: () => import ('markdown-it').then(obj => obj.default),
    lodash: () => import('lodash').then(obj => obj.default),
    dialogPolyfill: () => import('dialog-polyfill').then(obj => obj.default),
    mdl: () => import('material-design-lite')
};

export default class Lazy {
    static get modules() {
        return _modules;
    }
}