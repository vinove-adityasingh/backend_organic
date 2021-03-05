'use strict';

const config = {

    local: {

        port: 4000,
        baseUrl: 'localhost:4200/',
        baseUrlElite: 'localhost:4200/',
        SECRET: 'crm@$12&*01',

        DATABASE: {
            dbname: 'organic_db',
            host: 'mongodb://127.0.0.1:',
            port: 27017,

        },
    }

};
module.exports.get = function get(env) {
    return config[env] || config.default;
}