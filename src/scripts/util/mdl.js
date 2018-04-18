import Lazy from '../lazy';

export default function() {
    return Lazy.modules.mdl().then(() => {
        if (!(typeof (componentHandler) === 'undefined')) {
            window.componentHandler.upgradeAllRegistered();
        }
    });
}