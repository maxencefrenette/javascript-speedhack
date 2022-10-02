// Speed up time by this factor
const speedup = 5;

// Save initial timestamp
const initialTimestamp = Date.now();

// Monkey-patch Date.now()
const oldDateNow = Date.now;
window.Date.now = () => {
    return initialTimestamp + speedup * (oldDateNow.call(Date) - initialTimestamp);
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
