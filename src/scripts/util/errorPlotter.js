import MalformedDataError from '../exceptions/malformedDataError';
import SheetNotFoundError from '../exceptions/sheetNotFoundError';

const plotErrorMessage = function(d3, exception, timeout) {
    d3.selectAll('.mdl-progress').classed('hidden', true);

    let message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else if (exception instanceof SheetNotFoundError) {
        message = exception.message;
    } else {
        console.error(exception);
    }

    d3.select('#xtr-error-toast').node().MaterialSnackbar.showSnackbar({
        message: message,
        timeout: timeout || 3000
    });
};

export default plotErrorMessage;