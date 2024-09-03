
### Containerized SpringBoot app deploy into EKS crossing accounts:

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
In K8S, CRD( custom resource definition );

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
