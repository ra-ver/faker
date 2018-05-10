import 'babel-polyfill';
import winston from 'winston';
import SchemaLister from './list-schemas';
import SchemaFaker from './schema-faker';
import SchemaTransformer from './schema-transformer';
import DataExporter from './export-data';
import DataTransformer from './data-transformer';

const tsFormat = () => new Date().toISOString();

let logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true
    }),
  ],
});

logger.info('*** Fake Data Generation Begins ***');

let schemaLister = new SchemaLister(logger);

let schemas = schemaLister.list('./schemas');

Object.entries(schemas).forEach(([key, item]) => {
  try {
    // handle a specific schema
    if (key !== 'hcmi-model.json') return;

    logger.info('Generating fake values for schema: ' + key);

    // schema transformer
    let schemaTransformer = new SchemaTransformer(logger);

    schemaTransformer.transform(item);

    let output = [];
    // generate 5000 data points
    for (var count = 0; count < 5000; count++) {
      let dataPoint = new SchemaFaker(item);
      output.push(dataPoint);
    }

    // data transformer
    let dataTransformer = new DataTransformer(logger);
    dataTransformer.addReferentialIntegrity(output);

    let exporter = new DataExporter(logger);
    exporter.writeToES(output);
  } catch (err) {
    logger.error(`Error processing schema for : ${key}. Details: ${err}`);
  }
});