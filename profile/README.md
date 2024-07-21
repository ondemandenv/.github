## Challenges & Motivation

Distributed systems like SOA/microservice are very difficult to develop, each service can take many parts to work,
services can depend on each other for various reasons, this brings up the problems:

1) Maintain the consistency/certainty inbetween parts of each service is difficult.
    1) Missing assets/image/config
    2) Using wrong configuration version from
        1) code repo
        2) secret store
        3) configuration store
    3) Auth and least privilige V.S. convenience.
2) Maintain the consistency/certainty inbetween services is even more difficult.
    1) beside configuration, service API changing
    2) messaging schema changing
    3) versioning of each service
    4) monitoring and alarming
3) Manual configuration already reached to limit
    1) Can't remember what/how/why/where/when, can easily be hijacked
        1) who/how/why created that repo?
        2) what/how/where/when is the repo deployed last time?
        3) how other services are using/depending on the repo?
    2) Human mistake is inevitable and taking significant effort
        1) one typo can easily take hours for a complex system
        2) too difficult to track every change.
4) Local optimization vs big picture
5) Short term gaining vs long term stratigey
6) GitOps can't handle the complexity, templating yamls are the new binary in cloud era.
    1) Too shallow and rigid to adapt change, simple change can require huge unpractical amount of change of yamls.
    2) Can require multiple commits and multiple deployments across multiple repos for a single change.
    3) Too many repeats in yamls across many files and repos, complexity grows exponentially.
    4) Certain files can easily reach thousands of lines, making it not scalable/sustainable
7) Authentication & Authorization for each service making things difficult.
8) When using AWS CDK code as shell scripts without proper architecting & framework, it stuck ...

## Philosophy & Goals

1) Domain Driven Design to abstract/model the truth to loosely coupled app/services and underlying platforms.
    1) Infra as code managing dependencies among multiple versioned services and platform, also all services' lifecycle.
    2) Code generated repeatable & testable & IMMUTABLE & REPLACEABLE environment.
2) Application architecture as actual code to describe services' relationship.
    1) Abstract contracting/interface/boundary of each service, define relationship among in code.
    2) Each service implements its contracting/interface/boundary, generate its deployment manifests/plans.
    3) Monitoring deployments of each environment/version of each service
3) For a distributed systems like SOA/microservice, each service deploys to multiple environment/versions, so that
    1) developers can compare different versions of code/config by comparing different deployed actual running
       environments.
    2) developers can experiment discover and learn.
    3) multiple environments to run more tests in different scenarios in parallel.
4) On demand environment, ultimate flexibility for developers.
    1) By git branching/tagging which event driving automation to create/destroy new version of code/environment.
    2) Monitor/alarm environments' dependency versioning
    3) Environment lifecycle/status sync with github workflow statuses.
5) Monitoring and simulation:
    1) Dynamically generating DAG of dependency
    2) Dynamically generating deployment plans(phase/stages) based on DAG of dependency
    3) Configurable manual verification/approval based on IAM

## Example situation:

### Containerized SpringBoot app deploy into EKS:

1) Springboot repo with CICD job to build docker image and push to a image repository
2) Infrastructure repo with CICD job to deploy AWS resources
    1) databases like DynamoDB, RDS.
    2) file systems like S3, EFS.
    3) messaging bus like Event Bridge, Kinesis.
3) Kustomize/Helm repo for K8s manifests inside EKS cluster
    1) Ingress/Gateway
    2) Cert
3) monitor/alarms for each part.

### These are tightly coupled parts of one app/service, but usually handled by different teams

1) application team
2) devops/sre
3) infra and security
4) platform ...

### This takes many steps and teams which results in tedious, rigid and fragile deployments

## Solution with example

### The Contracts Lib, defines each app/service's boundary/interface and dependencies among them.

In DDD, boundary( bounded contexts );
In OOP, Encapsulation;
In Java, Interface-first;

Here it's a code library describing each app/services' IO/dependencies and acting as contracts among app/services and
the platforms.

See [example of the contracts](https://github.com/ondemandenv/odmd-build-contracts)

1) Platforms like Networking, EKS as seperated app/services:
    1) Networking app/service provides cidr, vpc, transit gateway across accounts
    2) EKS app/service provides kubectl endpoints for deploying CDK8s resources
2) Resources like RDS cluster can be a standalone app/service providing database/schema for other app/service, also can
   be part of one app/service.
3) Dependencies among them are expressed in producer and consumers explicitly.
4) Each app/service has its own repo implementing the contracts lib and use the contracts lib as a code dependency.

### The App/Service Repo define/maintains all parts and dependencies inside one environment, typically one stack

Each app/service has its own repo using The Contracts Lib, implementing its interface/IO.

1) The single stack manage all resources of one app/service as a unit.
    2) These resources are tightly coupled by nature.
    3) Dependencies inside are automatically handled.
    3) Topologically deployed or rollback as a transaction!
2) It can be a stack of any like CDK/Cloudformation/Terraform/OpenToFu.
3) Custom resource/controller CRD/Custom Providers to bring resources in different system into one stack
   When using AWS CDK,
    3) RDS schema/role/user so that it can be used as part of a stack.
    4) CDK8s resource for K8s manifest as part of a stack.
3) All App/Service Repos depend on each other, and declare dependencies with consume and produce thru The Contracts Lib

### Centralize automation and configurations

The contracts lib provides all dependencies information, with which Central automation with create jobs
that deploy each environment and sync concrete values to central configuration store, which provides dependencies used
by other app/services.

1) Central automation interprets the contracts lib which only describe the contracts, each app/service will implement
   the contracts.
2) Central automation maintain multiple versions of deployments that are different environments.
2) Central configuration store typically has configurations and how it's used by each environment like:
    1) Container Image tag/sha
    2) Endpoints of service, schema
    3) Cidr
    4) global IDs
2) Central automation will make sure Least privilege across multiple accounts and systems.

### Create new environment by tagging or branching

One App/Service Repo can deploy into multiple environments, the central automation create/destroy environments
based on The Contracts Lib and app/service's repo's tag/branch structure:

1) Branch based environment will be updated incrementally when pushed AND dependencies
2) Tag based environment is immutable can only be created/deleted.
3) Tag based environment should only consume from tag based environments :)

The following is a symbolic diagram to show how an app/service consuming endpoints from others, also provides endpoints
for others to consume
![img_1.png](img_1.png)
The real world contracts are complex,
see [ real example of a contracts](https://github.com/ondemandenv/odmd-build-contracts).

Intriguing facts already solved/implemented:

1) Circular dependencies like networking v.s. dns delegation/hostzone for each app/service.
2) Use AWS Api Gateway to route traffic thru NLB into EKS to support app/services out of EKS

Current status: implementing/testing onboarding process:

1) Create your AWS org
    1) Central auto account
    2) Networking admin delegation account
    3) Workspace accounts for different app/services
    4) Make networking and workspace accounts trust central auto account
2) Install odmd github app to app/service repos
    1) Networking repo. will be a fork from Ondemandenv's
    2) RDS cluster, a fork from Ondemandenv's
    3) EKS cluster, a fork from Ondemandenv's
    4) Other app/service repos
3) Define your Contracts Lib with
    1) Created Aws Accounts and Github repos
    2) Github App installation ID
    3) Emails for each app/service
4) Deploy the seeding stack into central auto account, wait central auto initialize and deploy all app/services with
   email notification