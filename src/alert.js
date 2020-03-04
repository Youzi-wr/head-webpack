/**
 * Create a new Notification.
 *
 * @param {String} title
 * @param {Object} options
 */

function Notification(title, options) {
    if (!window.Notification) return false;

    options = options || {};

    var self = this;

    // Events cache.
    this._events = [];

    /**
     * Create the notification.
     */

    function createNotification() {
        // Extend options with default provider options.
        options = Object.assign({
            focusWindowOnClick: true
        }, options);

        // Create a base notification.
        try {
            // console.log(options)
            var note = new window.Notification(title, options);
        } catch (error) {
            console.log(error);
        }
        // Close notification after specified delay.
        // if (options.delay) setTimeout(angular.bind(self, self.close), options.delay);
        if (options.delay) setTimeout(self.close, options.delay);

        // Focus window on click.
        if (options.focusWindowOnClick)
            self.on('click', function () {
                window.focus();
            });

        // Re-bind events.
        self._events.forEach(function (args) {
            self.on.apply(self, args);
        });

        // Reset events.
        self._events = [];
    }

    if (window.Notification.permission === 'granted') {
        return createNotification();
    } else if (window.Notification.permission !== 'denied') {
        Notification.requestPermission().then(createNotification);
    }
}

/**
 * Listen on event of a given type.
 * Supported events are:
 * - error
 * - show
 * - click
 * - close
 *
 * @param {String} name
 * @param {Function} listener
 */

Notification.prototype.on = function on(name, listener) {
    var self = this;

    // If the notification is not ready, we cache the event.
    if (!this.baseNotification) return this._events.push([name, listener]);

    this.baseNotification.addEventListener(name, applyListener);

    function applyListener() {
        var args = arguments;
        // $rootScope.$apply(function () {
        listener.apply(self, args);
        // });
    }

    // Return the deregistration function.
    return function off() {
        this.baseNotification.removeListener(event, applyListener);
    };
};

/**
 * Close the notification.
 */

Notification.prototype.close = function close() {
    if (this.baseNotification) this.baseNotification.close();
};

/**
 * Static method to request permission.
 * It returns a promise
 */

Notification.requestPermission = function () {
    return new Promise(function (resolve, reject) {
        if (!window.Notification)
            return reject();

        window.Notification.requestPermission(function (permission) {
            // Persist permission.
            window.Notification.permission = window.Notification.permission || permission;
            resolve(window.Notification.permission);
        });
    });
};

/**
 * Create a new notification.
 *
 * @param {string} title
 * @param {options} options
 */

function notification(title, options) {
    return new Notification(title, options);
}

// Expose requestPermission on notification.
notification.requestPermission = Notification.requestPermission;

module.exports = notification;