'use strict'

const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi')
/* const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require('@aws-sdk/client-apigatewaymanagementapi') */

const constants = require('./constants')

const run = async (event) => {
  console.debug(event)
  const requestContext = event.requestContext
  const { routeKey, eventType, messageId, connectionId } = requestContext
  const body = typeof event.body !== 'undefined' ? event.body : null
  if (eventType === constants.WS_EVENT_TYPE_MESSAGE) {
    await sendMessage(requestContext)
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      eventType,
      routeKey,
      connectionId,
      messageId,
      body,
    }),
  }
}

/*
 * The following function is an example on how to send a messages to a connecteed client
 * The commented code uses the v3 of the SDK that appear to be buggy:
 * https://github.com/aws/aws-sdk-js-v3/issues/999
 *
 */
const sendMessage = async (requestContext) => {
  const endpoint =
    // SDKv3 requires protocol
    // 'https://' +
    requestContext.domainName + '/' + requestContext.stage
  const postData = {
    // Data: new Uint8Array(Buffer.from(`Hello ${requestContext.connectionId}!`)),
    Data: `Thanks for your message ${requestContext.connectionId}!`,
    ConnectionId: requestContext.connectionId,
  }
  try {
    // SDKv3 is buggy (see above)
    /* const apiGatewayManagementApi = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint: endpoint,
    })
    await apiGatewayManagementApi.send(new PostToConnectionCommand(postData)) */
    const apiGatewayManagementApi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: endpoint,
    })
    return apiGatewayManagementApi.postToConnection(postData).promise()
  } catch (e) {
    console.error(e)
  }
}

module.exports = { run }
