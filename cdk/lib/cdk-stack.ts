import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'LambdaHandler', {
      code: lambda.Code.fromAsset('../main.zip'),
      handler: 'main',
      runtime: lambda.Runtime.GO_1_X,
    })

    new apigateway.LambdaRestApi(this, 'API', {
      handler
    })
  }
}
