'use strict'

const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi')
const DynamoDB = require('aws-sdk/clients/dynamodb')
const dynamoDb = new DynamoDB.DocumentClient()
const constants = require('./constants')

const run = async (event) => {
  console.debug(event)
  const requestContext = event.requestContext
  const { eventType, connectionId } = requestContext
  const body = typeof event.body !== 'undefined' ? event.body : null

  try {
    switch (eventType) {
      case constants.WS_EVENT_TYPE_CONNECT:
        await connect(connectionId)
        break
      case constants.WS_EVENT_TYPE_DISCONNECT:
        await disconnect(connectionId)
        break
      case constants.WS_EVENT_TYPE_MESSAGE:
        await message(requestContext, body)
        break
      default:
        throw new Error(`Unhandled event type "${eventType}"`)
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        eventType,
        connectionId,
        body,
      }),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({
        eventType,
        connectionId,
        body,
        error: e.message,
      }),
    }
  }
}

const connect = async (connectionId) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      connectionId: connectionId,
    },
  }
  return dynamoDb.put(params).promise()
}

const disconnect = async (connectionId) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      connectionId: connectionId,
    },
  }
  return dynamoDb.delete(params).promise()
}

const message = async (requestContext, message) => {
  const connectionId = requestContext.connectionId
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: 'connectionId <> :connectionId',
    ExpressionAttributeValues: { ':connectionId': connectionId },
  }
  const result = await dynamoDb.scan(params).promise()
  if (result.Count === 0) {
    return false
  }

  const postsPromises = result.Items.map((item) => {
    return _postToConnectionPromise(
      requestContext,
      item.connectionId,
      `${connectionId}: ${message}`
    )
  })
  return await Promise.allSettled(postsPromises)
}

const _postToConnectionPromise = (
  requestContext,
  targetConnectionId,
  message
) => {
  const endpoint = requestContext.domainName + '/' + requestContext.stage
  const postData = {
    Data: message,
    ConnectionId: targetConnectionId,
  }
  const apiGatewayManagementApi = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint,
  })
  return apiGatewayManagementApi.postToConnection(postData).promise()
}

module.exports = { run }
