# Serverless Chat

This is a simple chat application that uses AWS **API Gateway WebSocket API** and **DynamoDB**

## Setup

This is a *Serverless* project. The repo it is setup so that on every push to the master branch all the needed resources and code get deployed to AWS

## How it works 

A single *Lambda* function is setup to handle all the WebSocket events (`CONNECT`, `DISCONNECT`, `MESSAGE`)

* When a client `CONNECT`s to the WebSocket aAPI endpoint the `ConnectionId` is saved to a DynamoDB Table Item
* When id `DISCONNECT`s the Item get deleted.
* Whenever a `MESSAGE` is received the lambda function scan the DynamoDB table looking for connected clients ConnectionIds and uses `ApiGatewayManagementApi.postToConnection` method so sent the message to everybody (except the sender)

## How to use

The better way to test the functionality is to use `wscat` 

In your terminal

```
npm install -g wscat
```

And then just connect to the websocket endpoint like this

```
wscat -c wss://ylrbzaf3dg.execute-api.us-east-1.amazonaws.com/prod
```







