import SchemaLister from './src/list-schemas';
import winston from 'winston';
import _ from 'lodash';
import fs from 'fs';
import SchemaFaker from 'schema-faker'


/*
Configure logger
 */
const tsFormat = () => ( new Date() ).toLocaleDateString() + '  ' + ( new Date() ).toLocaleTimeString();

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp':tsFormat,colorize: true})
    ]
});

let args = process.argv;
if (args.length < 3) {
    logger.error('Missing arguments. Provide path to config.json.');
    process.exit(1);
}
let configPath = args[2];

// read config file
let config = JSON.parse(fs.readFileSync(configPath));

/*
    Begin Processing
 */
logger.info("*** Fake Data Generation Begins ***");

let schemaLister = new SchemaLister(logger);

schemaLister.list(config.schemas).then(schemas => {
    _.each(schemas, (item, key) => {
        try{
            logger.info("Generating fake values for schema: "+ key);
            let output = new SchemaFaker(item);
            logger.info(output);
        } catch (err){
            logger.error("Error processing schema for : "+ key + ". Details: "+ err);
        }
    });
}).catch(err => {
    logger.error("Error getting list of schemas.");
    logger.error(err);
});

//TODO items
// update schemas to set all properties to required
// set submitterids to be non-spaces
// generate ES put requests with generated json objects
// generate patterns from a set of sample objects instead of hard coded patterns
// directly get sample objects from a url
// constraints on value related to each other
