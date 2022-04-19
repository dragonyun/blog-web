class xmPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(func) {
        this.promiseState = xmPromise.PENDING;
        this.promiseResult = null;
        this.onFulFilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try {
            func(this.resolve, this.reject)
        } catch (e) {
            this.reject(e);
        }
    }

    resolve = (value) => {
        if (this.promiseState === xmPromise.PENDING) {
            setTimeout(() => {
                this.promiseState = xmPromise.FULFILLED;
                this.promiseResult = value;
                this.onFulFilledCallbacks.forEach(callback => {
                    callback(this.promiseResult);
                })
            });
        }
    }

    reject = (reason) => {
        if (this.promiseState === xmPromise.PENDING) {
            setTimeout(() => {
                this.promiseState = xmPromise.REJECTED;
                this.promiseResult = reason;
                this.onRejectedCallbacks.forEach(callback => {
                    callback(this.promiseResult);
                })
            });
        }
    }

    then = (onFulFilled, onRejected) => {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; }

        const p2 = new Promise((resolve, reject) => {

            if (this.promiseState === xmPromise.PENDING) {
                this.onFulFilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulFilled(this.promiseResult);
                            resolvePromise(x, p2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.promiseResult);
                            resolvePromise(x, p2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            } else if (this.promiseState === xmPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulFilled(this.promiseResult);
                        resolvePromise(x, p2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.promiseState === xmPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.promiseResult);
                        resolvePromise(x, p2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })

        return p2;
    }
}

function resolvePromise(x, p2, resolve, reject) {
    if (x === p2) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    if (x instanceof xmPromise) {
        if (x.promiseState === xmPromise.PENDING) {
            x.then(y => {
                resolvePromise(y, p2, resolve, reject)
            }, reject);
        } else if (x.promiseState === xmPromise.FULFILLED) {
            resolve(x.promiseResult);
        } else if (x.promiseState === xmPromise.REJECTED) {
            reject(x.promiseResult);
        }
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        try {
            var then = x.then;
        } catch (e) {
            return reject(e);
        }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,
                    y => {
                        if(called) return;
                        called = true;
                        resolvePromise(y, p2, resolve, reject);
                    },
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                if (called) return;
                called = true;
                reject(e);
            }
        } else {
            resolve(x);
        }

    } else {
        return resolve(x);
    }
}

xmPromise.deferred = function () {
    let result = {};
    result.promise = new xmPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
}

module.exports = xmPromise;

const p1 = new xmPromise((resolve, reject) => {
    // setTimeout(() => {
        resolve(100);
    // }, 1000);
})
p1.then(v=>{
    console.log('v1', v);
}).then(v => {
    console.log('v2', v);
})