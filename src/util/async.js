// This function allow to wrap our controllers
// in a fn that returns a Promise, which will 
// resolve or fail.
// This fn abstracts the try / catch
// logic in a single wrapper fn 

const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise
            .resolve(fn(req, res, next))
            .catch(next);
    }
};

module.exports = asyncHandler;