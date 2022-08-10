import type { AWS } from '@serverless/typescript';
import { createUser, getUser, getAllUsers, updateUser, deleteUser, loginUser } from '@functions/user';
const serverlessConfiguration: AWS = {
  service: 'aws-serverless-typescript-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [{
          Sid: "VisualEditor0",
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: "arn:aws:dynamodb:eu-west-2:934431694114:table/user",
        }],
      },
    },
  },
  // import the function via paths
  functions: { getAllUsers, createUser, getUser, updateUser, deleteUser, loginUser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: "dev"
    }
  },
  resources: {
    Resources: {
      Users: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Users",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "name",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },

          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'name_index',
              KeySchema: [
                {
                  AttributeName: 'name',
                  KeyType: 'HASH',
                }
              ],
              Projection: {
                "ProjectionType": "ALL"
              },
              ProvisionedThroughput: {                                // Only specified if using provisioned mode
                "ReadCapacityUnits": 1, "WriteCapacityUnits": 1
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      }
    }
  }
};
module.exports = serverlessConfiguration;