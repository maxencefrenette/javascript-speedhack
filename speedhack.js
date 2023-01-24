// Speed up time by this factor
const date_speedup = 5;
const set_timeout_speedup = 5;

// Save initial timestamp
const initialTimestamp = Date.now();

// Monkey-patch Date.now()
const oldDateNow = Date.now;
window.Date.now = () => {
    return initialTimestamp + date_speedup * (oldDateNow.call(Date) - initialTimestamp);
}

// Monkey-patch new Date()
const OldDate = Date;
class SpeedupDate extends OldDate {
    constructor(...args) {
        if (args.length === 0) {
            super(Date.now());
        } else {
            super(...args);
        }
    }
}
window.Date = SpeedupDate;

// Monkey-patch requestAnimationFrame
// TODO

// Monkey-patch setTimeout()
const oldSetTimeout = setTimeout;
setTimeout = (handler, timeout, ...args) => {
    return oldSetTimeout(handler, timeout / set_timeout_speedup, ...args);
}
