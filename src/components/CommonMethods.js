const methods = {};

module.exports = {
    register: function(name, func) {
        methods[name] = func;
    },
    invoke: function(name, ...args) {
        var method = methods[name];
        if (!method) return;
        method.apply(null, args);
    }
};