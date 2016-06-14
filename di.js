const f = require('lodash/fp');
const babylon = require('babylon');

const parseDependencies = (functionStr) => {
    const parsed = babylon.parse(functionStr, {
        sourceType: 'script' });
    // get the first argument of the function, then get its desctructued properties
    const properties = f.flow(
        f.get('program.body.0.expression.params.0.properties'),
        f.map('key.name')
        )(parsed);
    return properties;
};

const checkMissingDependencies = (factoryMethod, dependencies) => {
    // check if all dependencies are available for module
    const functionStr = factoryMethod.toString();
    const requiredDependencies = parseDependencies(functionStr);

    const missingDependency = f.find(d => !dependencies[d], requiredDependencies);

    return missingDependency;
};

// TODO: fix console.log(dependencies)
const createProxy = (dependencies) => {
    const proxyHandler = {
        get: (target, name) => {
            console.log(name);
            if (!(name in target)) {
                console.trace(`dependency "${name}" not found`);
            }
            return target[name];
        },
    };

    return new Proxy(dependencies, proxyHandler);
};

// TODO: use getters for lazy loading?
module.exports = (moduleDefinitions, existingModules = {}) =>
    f.flow(
        f.toPairs,
        f.reduce((dependencies, [name, factoryMethod]) => {
            if (dependencies[name]) {
                throw new Error(`dependency name (${name}) already exists`);
            }

            // check if all dependencies are available for module
            const missingDependency = checkMissingDependencies(factoryMethod, dependencies);
            if (missingDependency) {
                console.trace(`missing dependency "${missingDependency}" for module "${name}"`);
            }

            const instace = factoryMethod(dependencies);
            return f.assign(dependencies, { [name]: instace });
        }, existingModules),
        createProxy
    )(moduleDefinitions);