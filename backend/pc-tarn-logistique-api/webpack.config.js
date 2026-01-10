// eslint-disable-next-line no-undef
module.exports = function (options) {
    return {
        ...options,
        watchOptions: {
            poll: 1000, // Vérifie les changements toutes les secondes
            aggregateTimeout: 300,
        },
    };
};
