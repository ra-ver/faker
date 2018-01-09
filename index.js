import SchemaLister from './src/list-schemas';
import winston from 'winston';
import _ from 'lodash';
import fs from 'fs';
import SchemaFaker from './src/schema-faker';
import SchemaTransformer from './src/schema-transformer';
import DataExporter from './src/export-data';


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
            if("hcmi-model.json" !== key) return;
            logger.info("Generating fake values for schema: "+ key);
            let transformer = new SchemaTransformer(logger);
            transformer.transform(item).then(() => {
                let output = [];
                // generate 5000 data points
                for(var count = 0; count< 5000; count++){
                    let dataPoint = new SchemaFaker(item);
                    output.push(dataPoint);
                }// loop complete
                let exporter = new DataExporter(logger);
                //exporter.write("./output", key, output);
                exporter.writeToES(output);
            });
        } catch (err){
            logger.error("Error processing schema for : "+ key + ". Details: "+ err);
        }
    });
}).catch(err => {
    logger.error("Error getting list of schemas.");
    logger.error(err);
});

