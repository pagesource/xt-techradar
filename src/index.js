import './index.scss';
import 'material-design-lite';
import plotRadar from './scripts/util/factory';
setTimeout(() => {
    plotRadar('XT Tech Radar', []);
    
    if(!(typeof(componentHandler) == 'undefined')){
       window.componentHandler.upgradeAllRegistered();
      }
}, 2000);