const env = process.env.NODE_ENV || 'dev';

const config = {
    production: {
        "PORT": 4900,
        "DEBUG": false,
        "DBSUCCESS": true,
        "JWT_KEY": "secret1"
    },
    default: {
        "PORT": 6969,
        "DEBUG": true,
        "DBSUCCESS": true,
        "JWT_KEY": "secret2"
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}