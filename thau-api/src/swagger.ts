import { Configs } from './configs'

const pkg = require('../package.json')

export default (configs: Configs) => ({
  openapi: '3.0.1',
  info: {
    version: pkg.version,
    title: `Thau API - ${configs.data_backend}`,
    description: `Thau API, backed by ${
      configs.data_backend
    }, enabled login strategies: ${configs.supported_strategies.join(', ')}`,
    contact: pkg.author,
    license: {
      name: pkg.license,
    },
  },
  paths: {
    '/heartbeat': {
      get: {
        tags: ['Configs'],
        description: 'Service Heartbeat endpoint',
        operationId: 'heartbeat',
        responses: {
          '200': {
            description: 'Heartbeat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  propreties: {
                    data_backend: {
                      type: 'string',
                    },
                    service: {
                      type: 'string',
                    },
                    status: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/configs': {
      get: {
        tags: ['Configs'],
        description:
          'Get API public configurations. Consumed by the client to properly work',
        operationId: 'getConfigs',
        responses: {
          '200': {
            description: 'API configurations',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Configs',
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        description: 'Create new user with password',
        operationId: 'createUser',
        requestBody: {
          description: 'User information',
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/User' },
                  {
                    type: 'object',
                    properties: {
                      password: {
                        type: 'string',
                        requiried: true,
                        description: 'Password',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Some fields are missing, or Password can not be decrypted',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        description: 'Get user by id',
        operationId: 'getUserById',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'API configurations',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/User',
                    },
                    {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '404': {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/tokens/{strategy}': {
      post: {
        tags: ['Tokens'],
        description:
          'Exchange login strategy information (credentials of vendors access tokens) for a Thau token',
        operationId: 'exchangeStrategyForToken',
        parameters: [
          {
            in: 'path',
            name: 'strategy',
            required: true,
            schema: {
              type: 'string',
              description: 'One of supported_provides, recceived from /configs',
            },
          },
        ],
        requestBody: {
          description: 'Strategy information',
          required: true,
          content: {
            'application/json': {
              schema: {
                anyOf: [
                  {
                    type: 'object',
                    description: 'Credentials for password strategy',
                    properties: {
                      email: {
                        type: 'string',
                        required: true,
                      },
                      password: {
                        type: 'string',
                        requiried: true,
                        description: 'Password',
                      },
                    },
                  },
                  {
                    type: 'object',
                    description: 'idToken for google strategy',
                    properties: {
                      idToken: {
                        type: 'string',
                        required: true,
                      },
                    },
                  },
                  {
                    type: 'object',
                    description: 'accessToken for facebook strategy',
                    properties: {
                      accessToken: {
                        type: 'string',
                        required: true,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/tokens/user': {
      get: {
        tags: ['Tokens', 'Users'],
        description: 'Exchange token for user',
        operationId: 'exchangeTokenForUser',
        parameters: [
          {
            in: 'query',
            name: 'token',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User found',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/User',
                    },
                    {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/tokens': {
      delete: {
        tags: ['Tokens'],
        description: 'Revoke token',
        operationId: 'revokeToken',
        parameters: [
          {
            in: 'query',
            name: 'token',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Token revoked',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Configs: {
        type: 'object',
        properties: {
          strategies: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          google: {
            type: 'object',
            properties: {
              clientId: {
                type: 'string',
              },
            },
          },
          facebook: {
            type: 'object',
            properties: {
              clientId: {
                type: 'string',
              },
              graphVersion: {
                type: 'string',
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            required: true,
          },
          username: {
            type: 'string',
          },
          first_name: {
            type: 'string',
          },
          last_name: {
            type: 'string',
          },
          date_of_birth: {
            type: 'number',
          },
          gender: {
            type: 'string',
          },
          picture: {
            type: 'string',
            description: 'URL to the user picture',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          status: {
            type: 'number',
          },
        },
      },
    },
  },
})
