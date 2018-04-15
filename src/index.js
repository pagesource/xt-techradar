import './index.scss';
import 'material-design-lite';
import plotRadar from './scripts/util/factory'; 
// setTimeout(() => {
//     $('.mdl-list').append(materializeMyHTML(`
//     <li class="mdl-list__item">
//         <span class="mdl-list__item-primary-content">
//             Gaming
//         </span>
//         <span class="mdl-list__item-secondary-action">
//             <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="Gaming">
//                 <input type="checkbox" id="Gaming" class="mdl-switch__input" checked />
//             </label>
//         </span>
//     </li>
//     `));
// }, 3000);

// var dialog = document.querySelector('dialog');
// var showDialogButton = document.querySelector('#show-dialog');
// if (! dialog.showModal) {
//   dialogPolyfill.registerDialog(dialog);
// }
// showDialogButton.addEventListener('click', function() {
//   dialog.showModal();
// });
// dialog.querySelector('.close').addEventListener('click', function() {
//   dialog.close();
// });
setTimeout(() => {
    plotRadar('XT Tech Radar', []);
    
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
      }
}, 2000);