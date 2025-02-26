const moment = require('moment');

module.exports = {
    formatDate: function(date) {
        return moment(date).format('DD/MM/YYYY HH:mm');
    }
};
