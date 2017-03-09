/**
 * Created by Ray on 2017/3/8.
 */
const isFunction = fn => typeof fn === 'function';
const series = function (...args) {
    if (!args.every(isFunction)) {
        throw new TypeError('middlewares must be functions');
    }
    return function (req, res, next) {
        let middlewares = Array.from(args);
        step(middlewares.shift());

        function step(mw) {
            if (mw) {
                try {
                    if (mw.length === 4) {
                        return step(middlewares.shift());
                    }
                    mw(req, res, function (err) {
                        if (err) {
                            errorStep(err);
                        } else {
                            step(middlewares.shift());
                        }
                    });
                } catch (err) {
                    errorStep(err);
                }
            } else {
                next(); // done
            }
        }

        function errorStep(err) {
            const errorIndex = middlewares.findIndex(middleware => middleware.length === 4);
            let mw;
            if (~errorIndex) {
                middlewares = middlewares.slice(errorIndex);
                mw = middlewares.shift();
                try {
                    mw(err, req, res, function (e) {
                        if (e) {
                            errorStep(e);
                        } else {
                            step(middlewares.shift());
                        }
                    });
                } catch (e) {
                    errorStep(e);
                }
            } else {
                next(err); // done
            }
        }
    };
};
module.exports = series;