class yunPromise {
    static PENDING = 'pending';
    static FULILED = 'fuliled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.promiseState = yunPromise.PENDING;
        this.promiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try {
            func(this.resolve, this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    resolve = (value) => {
        if (this.promiseState === yunPromise.PENDING) {
            setTimeout(() => {
                this.promiseState = yunPromise.FULILED;
                this.promiseResult = value;
                this.onFulfilledCallbacks.forEach(callback => {
                    callback(value);
                });
            });
        }
    }

    reject = (reason) => {
        if (this.promiseState === yunPromise.PENDING) {
            setTimeout(() => {
                this.promiseState = yunPromise.REJECTED;
                this.promiseResult = reason;
                this.onRejectedCallbacks.forEach(callback => {
                    callback(reason);
                })
            })
        }
    }

    then = (onFulFilled, onRejected) => {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; }

        const promise2 = new yunPromise((resolve, reject) => {

            if (this.promiseState === yunPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulFilled(this.promiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.promiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }

            if (this.promiseState === yunPromise.FULILED) {
                setTimeout(() => {
                    try {
                        console.log('123')
                        let x = onFulFilled(this.promiseResult);
                        console.log('fuliled');
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            if (this.promiseState === yunPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.promiseResult);

                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })

        return promise2;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    finally = (finallyFunc) => {
        return this.then(finallyFunc, finallyFunc);
    }


    static resolve = (value) => {
        if (value instanceof yunPromise) {
            return value;
        } else if (value instanceof Object && 'then' in value) {
            return new yunPromise((resolve, reject) => {
                value.then(resolve, reject);
            })
        }

        return new yunPromise((resolve) => {
            resolve(value);
        })
    }

    static reject = (reason) => {
        return new yunPromise((resolve, reject) => {
            reject(reason)
        })
    }

    static all = (arrayPromises) => {
        return new yunPromise((resolve, reject) => {
            if (Array.isArray(arrayPromises)) {
                let result = [];
                let count = 0;

                if (arrayPromises.length === 0) {
                    return resolve(arrayPromises);
                }

                arrayPromises.forEach((item, index) => {
                    yunPromise.resolve(item).then(
                        value => {
                            count++;
                            result[index] = value;
                            count === arrayPromises.length && resolve(result);
                        },
                        reason => {
                            reject(reason);
                        }
                    )
                })

            } else {
                return reject(new TypeError('Argument is not iterable'));
            }
        })
    }

    static allSettled = (arrayPromises) => {
        return new yunPromise((resolve, reject) => {
            if (Array.isArray(arrayPromises)) {
                let result = [];
                let count = 0;

                if (arrayPromises.length === 0) {
                    return resolve(arrayPromises);
                }

                arrayPromises.forEach((item, index) => {
                    yunPromise.resolve(item).then(
                        value => {
                            count++;
                            result[index] = {
                                status: 'fulfilled',
                                value
                            };
                            count === arrayPromises.length && resolve(result);
                        },
                        reason => {
                            count++;
                            result[index] = {
                                status: 'rejected',
                                reason
                            };
                            count === arrayPromises.length && resolve(result);
                        }
                    )
                })

            } else {
                return reject(new TypeError('Argument is not iterable'));
            }
        })
    }

    static any = (arrayPromises) => {
        return new yunPromise((resolve, reject) => {
            if (Array.isArray(arrayPromises)) {
                let errors = [];
                let count = 0;

                if (arrayPromises.length === 0) {
                    return reject(new AggregateError('All promises were rejected'));
                }

                arrayPromises.forEach((item, index) => {
                    yunPromise.resolve(item).then(
                        value => {
                            resolve(value);
                        },
                        reason => {
                            count++;
                            errors[index] = reason;
                            count === arrayPromises.length && reject(new AggregateError(errors));;
                        }
                    )
                })

            } else {
                return reject(new TypeError('Argument is not iterable'));
            }
        })
    }

    static race = (arrayPromises) => {
        return new yunPromise((resolve, reject) => {
            if (Array.isArray(arrayPromises)) {

                if (arrayPromises.length > 0) {
                    arrayPromises.forEach((item, index) => {
                        yunPromise.resolve(item).then(resolve, reject)
                    })
                }
            } else {
                return reject(new TypeError('Argument is not iterable'));
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        return reject(new TypeError('Chaing cycle detected for promise'));
    }
    if (x instanceof yunPromise) {
        if (x.promiseState === yunPromise.PENDING) {
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, reject)
        } else if (x.promiseState === yunPromise.FULILED) {
            resolve(x.promiseResult);
        } else if (x.promiseState === yunPromise.REJECTED) {
            reject(x.promiseResult);
        }
    } else if (x !== null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            var then = x.then;
        } catch (e) {
            return reject(e)
        }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
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

yunPromise.deferred = function () {
    let result = {};
    result.promise = new yunPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
}

module.exports = yunPromise;



// const promise1 = yunPromise.resolve(3);
// const promise2 = 42;
// const promise3 = new yunPromise((resolve, reject) => {
//     setTimeout(resolve, 100, 'foo');
// });

// yunPromise.all([promise1, promise2, promise3]).then((values) => {
//     console.log(values)
// })

// const p1 = yunPromise.resolve(100);

// yunPromise.reject(p1).then(()=>{}, error => {
//     console.log(error)
// })

// p1.then((v) => {
//     console.log(v);
// })

// const p1 = new yunPromise((resolve, reject) => {
//     resolve(100);
// })

// const p2 = p1.then(value => {
//     console.log(value);
//     return p2;
// })

// p2.then(undefined, e => { console.log('reject', e) })
// const p1 = new yunPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(100);
//     }, 1000);
// })
// p1.then(v => {
//     console.log('1');
//     console.log('v', v);
// });
// p1.then(v => {
//     console.log('2');
//     console.log('v', v);
// });
// p1.then(v => {
//     console.log('3');
//     console.log('v', v);
// });