const { AwsCdkTypeScriptApp } = require('projen');
const { Automation } = require('projen-automate-it');

const AUTOMATION_TOKEN = 'GITHUB_TOKEN';


const project = new AwsCdkTypeScriptApp({
  cdkVersion: "1.63.0",
  name: "lambda-gin-refarch",
  authorName: "Pahud Hsieh",
  authorEmail: "pahudnet@gmail.com",
  repository: "https://github.com/pahud/eks-lambda-py.git",
  dependabot: false,
  antitamper: false,
  defaultReleaseBranch: 'main',
  cdkDependencies: [
    "@aws-cdk/core",
    "@aws-cdk/aws-apigateway",
    "@aws-cdk/aws-lambda",
  ],
    devDeps: [
    'projen-automate-it',
  ],
});

const automation = new Automation(project, {
  automationToken: AUTOMATION_TOKEN,
});

automation.projenYarnUpgrade();
automation.autoApprove();
automation.autoMerge();



const common_exclude = ['cdk.out', 'cdk.context.json', 'vendor', 'main', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
