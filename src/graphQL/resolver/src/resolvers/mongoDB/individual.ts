//
//
// This here module is responsible for parsing the request and
// Returning the correct data.
//
//

import _ from 'lodash';
         
import { requestDetails } from '../../..';       
import { internalConfiguration } from '../../../../../general';        

import schemaObject from '../../../../schema/object';  
import mapResponse from '../../database/mapResponse';    
import mongoService from '../../database/mongo';     
import intermediate from './shared';

const resolve = async(
    schemaObject: schemaObject.init,
    requestDetails: requestDetails,
    client: mongoService,
    context: any
) => {
    console.log(requestDetails);
    // Process the request
    const processedData =
        await intermediate(schemaObject, requestDetails, client, context);

    // Use the projection and query to get the data
    const data = 
        await processedData.collection.aggregate(processedData.requestData).toArray();

    // Check if any data was returned
    if(data.length === 0)
        return undefined;

    // Map the requested resouces back to the schema
    return mapResponse(schemaObject, data[0]);
}

export default resolve;