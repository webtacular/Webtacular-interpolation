// This here module is responsible for parsing the request and
// Returning the correct data.

import _ from "lodash";

import SchemaObject from "../../../query/object";
import SchemaValue from "../../../query/value";
import MongoService from '../database'

import mapResponse from './mapResponse';
import constructFilter from './constructFilter';
import { MongoResponseObject } from "../database/interface";

const resolve = async (
    uniqueValues: SchemaValue.init[],
    input:  SchemaObject.init,

    queryFilter: any,
    queryArguments: any,

    client: MongoService
) => {
    const collection = client.getCollection(input.options.databaseName, input.options.collectionName);

    // Start building the projection
    let projection = {};
    
    // Map the requested resouces
    for(const paramater in queryFilter[input.options.key]){
        // Get the value
        const value = input.obj[paramater];

        // If somehows the paramater is not found in the schema
        // Then we can't resolve it
        if(!value) continue;

        // Merge the filters
        _.merge(projection, value.mask);
    }

    // Construct the filter
    const filter: MongoResponseObject = constructFilter(queryArguments, input);

    // Use the filter to get the data
    const data = await collection.aggregate([
        { $project: projection },
        { $match: filter }
    ]).toArray();

    if(data.length === 0) return undefined;

    // Map the requested resouces back to the schema
    return mapResponse(input, data[0]);
}

export default resolve;