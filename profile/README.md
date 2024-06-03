## Motivation
Distributed systems like SOA/microservice are very difficult to develop, each service can take many parts to work, services can depend on each other for various reasons, this brings up the problems:
1) Maintain the consistency/certainty inbetween parts of each service is difficult.
   1) Missing assets/image
   2) Using wrong configuration from
      3) code repo
      4) secret store
      5) configuration store
2) Maintain the consistency/certainty inbetween services is even more difficult.
   3) beside configuration, service API changing
   4) messaging schema changing
3) Manual configuration already reached to limit
   1) Can't remember what/how/why/where/when, can easily be hijacked
      1) who/how/why created that repo?
      2) what/how/where/when is the repo deployed last time?
      4) how other services are using/depending on the repo?
      5) Is the code in the repo consistent to the deployed?
   2) Human mistake is inevitable and taking significant effort
      3) one typo can easily take hours for a complex system
      4) too difficult to track every change.
4) GitOps can't handle the complexity, templating yamls are the new binary in cloud era.
   1) Too shallow and ridgid to adapt change, simple change can require huge unpractical amount of change of yamls.
   2) Can require multiple commits and multiple deployments across multiple repos for a single change.
   3) Too many repeats in yamls across many files and repos, complexity grows exponentially.
   4) Certain files can easily reach thousands of lines, making it not scalable/sustainable
  

## Philosophy & Goals
1) For a distributed systems like SOA/microservice, each service needs multiple environment/versions, so that 
   1) developers can compare different versions of code/config by comparing different deployed actual running environments.
   2) developers can experiment discover and learn.
   3) multiple environments to run more tests in different scenarios in parallel.
2) Application architecture as actual code to describe services' relationship.
   1) Abstract contracting/interface/boundary of each service, define relationship among in code.
   2) Each service implements its contracting/interface/boundary, generate its deployment manifests/plans.
   3) Monitoring deployments of each environment/version of each service
3) Automation, event driven and plan/simulation
   1) Dynamically generating DAG of dependency
   2) Dynamically generating deployment plans(phase/stages) based on DAG of dependency
   3) Configurable manual verification/approval based on IAM


## Implementation abstraction
1) Data Model: team<-1:m->repo<-1:m->build<-1:m->service[deployment] | artifacts
   1) service[deployment] providing and consuming APIs by endpoints/topics.
   2) artifacts are container image or packages to be deployed as part of a service.
   3) service and artifacts both can have multiple versions/environments
   4) see https://github.com/ondemandenv/odmd-build-contracts for more details.
2) Abstract contracting/interface/boundary of each service, define them in static and strong typed code so that:
   1) Better IDE support.
   2) Validate as early as compilation.
3) Define services' contracts in one repo as lib, and a central service to implement typical services and coordinate cross service dependencies.
4) AWS CDK to describe data/function model
5) Github as source repo and Github workflow as continue deployment service.
6) AWS Cloudformation service to execute different stacks
7) Basic build types:
   1) container image to ECR
   2) ECR image deploy to EKS
   8) npm package to github package
   9) aws cdk deployment
10) provided basic services.
    1) rds serverless v2 postgres
    12) eks cluster

## How to use
1) Define a build in two parts:
   1) In contracts repo together with other builds to declare how it contracts with other builds.
      1) which repo and how to build
      2) bootstraping target AWS account/region.
      3) what value it consumes from others, vpc cidr? eks-cluster, ECR repo? authentication service's endpoint?
      4) what value it produces, messaing topic? api endpoints? image in ECR? or package in github?
   3) Implementing the contract, this is optional because there are typical basic implementations can be used by declaration in contracts repo.
3) let the central deploy infrastructures including pipelines to build's aws account and github repo.
4) trigger pipeline to run this build.
5) build's output will trigger other builds.
