(() => {
    // Speed up time by these factors
    const date_speedup = 5;
    const set_timeout_speedup = 1;
    const set_timeout_repeat = 1;
    const set_interval_speedup = 1;
    const set_interval_repeat = 1;
    
    // Save initial timestamp
    const initialTimestamp = Date.now();
    let timestampAdjustment = 0;
    
    // Monkey-patch Date.now()
    const oldDateNow = Date.now;
    window.Date.now = () => {
        return initialTimestamp + date_speedup * (oldDateNow.call(Date) - initialTimestamp) + timestampAdjustment;
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
    let repeat_counter = 0;
    const oldSetTimeout = setTimeout;
    window.setTimeout = (handler, timeout, ...args) => {
        repeat_counter += 1;

        if (repeat_counter < set_timeout_repeat) {
            timestampAdjustment += 1000;
            handler(...args);
        } else {
            repeat_counter = 0;
            return oldSetTimeout(handler, timeout / set_timeout_speedup, ...args);
        }
    }

    // Monkey-patch setInterval()
    const oldSetInterval = setInterval;
    window.setInterval = (handler, delay, ...args) => {
        let newHandler = handler;
        if (set_interval_repeat != 1) {
            newHandler = (...innerArgs) => {
                for(let i = 0; i < set_interval_repeat; i++) {
                    handler(...innerArgs);
                    timestampAdjustment += 10000;
                }
            }
        }

        return oldSetInterval(newHandler, delay / set_interval_speedup, ...args);
    }
})();
