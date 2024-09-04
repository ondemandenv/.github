## Implementation abstraction
1) Data Model: team<-1:m->repo<-1:m->build<-1:m->app/service[deployment] | artifacts
   1) app/service[deployment] providing and consuming APIs by endpoints/topics.
   2) artifacts are container image or packages to be deployed as part of a service.
   3) service and artifacts both can have multiple versions/environments
   4) see https://github.com/ondemandenv/odmd-build-contracts for more example/details.
2) Abstract contracting/interface/boundary of each service, define them in static and strong typed code so that:
   1) Better IDE support.
   2) Validate as early as compilation.
3) Public configurations for integration and keep configurations to private for the implementation and runtime.
   1) Define infra & services' contracts in one repo as lib, and a central service to implement typical services and coordinate cross service dependencies.
      1) In Java it's interface 1st.
      2) In DDD, Boundary
      3) I call it contracts inbetween different domains.
   3) Keep implementation details like Lambda, container or InstanceType in private configuration store
   4) Keep runtime configuration like how many instances in autoscaling group in private configuration store
5) AWS CDK to describe data/function model
6) Github as source repo and Github workflow as continue deployment service.
7) AWS Cloudformation service to execute different stacks
8) Basic build types:
   1) container image to ECR
   2) ECR image deploy to EKS
   8) npm package to github package
   9) aws cdk deployment
10) provided basic services.
    1) rds serverless v2 postgres
    12) eks cluster

## How it works
1) I have a working prototye working for all key aspects but still testing on details, contact gary.y.7811 AT gmail if you want to know more.
2) My sandbox domain model is open now: check out https://github.com/ondemandenv/odmd-build-contracts
3) Typical process to add new things is to define a build in two parts:
   1) In contracts repo together with other builds to declare how it contracts with other builds.
      1) which repo and how to build
      2) bootstraping target AWS account/region.
      3) what value it consumes from others, vpc cidr? eks-cluster, ECR repo? authentication service's endpoint?
      4) what value it produces, messaing topic? api endpoints? image in ECR? or package in github?
   3) Implementing the contract, this is optional because there are typical basic implementations can be used by declaration in contracts repo.
4) The central account as an implementation of the contracts( like https://github.com/ondemandenv/odmd-build-contracts ) will deploy infrastructures including "pipelines" to
   1) Develop and Maintain infrastructures to deploy and maintain relationships among services and infrastructure.
      2) Auth among Github and mulitple AWS accounts.
      3) Events handling
      4) Triggering mutating pipeline
   3) Monitoring resources and triggering pipeline to react to change a
      6) build's output( described as producers )'s change will trigger consuming builds.
      7) Events drive the building network instead of pipeline.
