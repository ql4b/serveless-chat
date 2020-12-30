jest.mock(
  'aws-sdk/clients/apigatewaymanagementapi',
  () =>
    class ApiGatewayManagementApi {
      postToConnection() {
        return {
          promise: jest.fn().mockResolvedValue({}),
        }
      }
    }
)

const { run } = require('../src/handler')

describe('run', () => {
  it('should handle CONNECT event type', async () => {
    const event = {
      requestContext: {
        routeKey: '$connect',
        disconnectStatusCode: null,
        messageId: 'YUQp2eMMIAMCEnw=',
        eventType: 'CONNECT',
        stage: 'prod',
        domainName: 'u7aa76xnm6.execute-api.us-east-1.amazonaws.com',
        connectionId: 'YUQkSd8wIAMCEnw=',
        apiId: 'u7aa76xnm6',
      },
      isBase64Encoded: false,
    }
    const result = await run(event)
    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })
  it('should handle MESSAGE event type', async () => {
    const event = {
      requestContext: {
        routeKey: '$default',
        messageId: 'YUQp2eMMIAMCEnw=',
        eventType: 'MESSAGE',
        stage: 'prod',
        requestId: 'YUQp2HzWoAMFVEA=',
        domainName: 'u7aa76xnm6.execute-api.us-east-1.amazonaws.com',
        connectionId: 'YUQkSd8wIAMCEnw=',
        apiId: 'u7aa76xnm6',
      },
      isBase64Encoded: false,
      body: 'message',
    }
    const result = await run(event)
    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })
})
