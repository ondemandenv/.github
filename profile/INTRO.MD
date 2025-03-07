
**OnDemandEnv Platform Documentation**

---

**1. Overview**  
The OnDemandEnv platform streamlines SOA distributed system SDLC by managing microservice dependencies, team collaboration, and environment orchestration. It enables dynamic environment ("enver") provisioning, dependency resolution, and cross-account deployments using AWS services, Git workflows, and infrastructure-as-code (IaC) principles.

---

**2. Core Concepts**
- **Enver (Environment Version):**
   - A versioned logical environment containing resources (infrastructure, services, configs) for a business vertical.
   - Types:
      - **Mutable Enver:** Associated with Git branches; supports incremental deployments as source changes.
      - **Immutable Enver:** Associated with Git tags; dependencies must also be immutable.
   - Outputs: Docker images, CDK deployments, or custom resources (e.g., URIs, endpoints).

- **Build:**
   - Defines how a repository is built (e.g., Docker image, CDK stack).
   - Each build targets a deployment account/region and can produce multiple envers.

- **Products:**
   - Versioned outputs (e.g., IPAM references, EKS endpoints) stored in SSM Parameter Store.
   - Consumers dynamically resolve dependencies using deterministic URIs.

- **ContractsLib:**
   - A centralized repository defining dependencies and contracts between envers.
   - Acts as a "congress" where teams negotiate dependencies via PRs.
   - Enforces semantic versioning and type safety (TypeScript interfaces).

---

**3. Platform Architecture**
- **Accounts:**
   - **Central Account:** Hosts platform control plane (CI/CD pipelines, ContractsLib, AppSync API, Config Store).
   - **Networking Account:** Manages shared networking resources (IPAM, VPCs, Transit Gateway).
   - **Workspace Accounts:** Host workload envers (e.g., EKS clusters, microservices).
   - **Security/Logging Accounts:** Centralized security/logging services.

- **Config Store:**
   - Uses AWS SSM Parameter Store (versioned configurations) and EventBridge (change events).
   - Secrets stored in AWS Secrets Manager.

- **CI/CD:**
   - Central Account orchestrates GitHub Workflows for envers.
   - Supports rollbacks (CloudFormation), E2E testing, and cross-account deployments via IAM/STS.

---

**4. Key Features**
- **On-Demand Environments:**
   - Clone envers via Git branching (e.g., `odmd: create@<target-branch>`).
   - Clones reuse dependencies but generate unique resource names (CDK branch parameterization).
   - Isolated configurations; developers cannot access others' enver data.

- **Dependency Management:**
   - Cyclic dependencies resolved via placeholder initialization (e.g., networking ↔ logging).
   - Consumers define reactions to product changes (e.g., auto-trigger CI/CD, alarms).

- **Security:**
   - IAM roles enforce least privilege; Central Account assumes roles across target accounts.
   - Enver configurations are securely isolated (e.g., offshore teams collaborate without data exposure).

- **Resource Isolation:**
   - EKS envers use Kubernetes namespaces and workspace account IAM roles (OIDC federation).
   - Global resources use CloudFormation physical IDs or branch/tag-derived names.

---

**5. Workflows**
- **Adding a Service:**
   1. Define the service as a Build/Enver in ContractsLib (Level 2).
   2. Submit PR for dependency negotiation.
   3. Deploy updated ContractsLib to trigger platform pipelines.

- **Cloning an Enver:**
   - Execute CLI command or Git commit comment (`odmd: create@<target-branch>`).
   - Platform auto-generates a branch with copied logic, unique resource names, and shared dependencies.

---

**6. ContractsLib Structure**
- **Level 1 (Core):**
   - Base interfaces (`Build`, `Enver`, `Producer`, `Consumer`).
   - Managed by the platform team; integrates with Central Account services.

- **Level 2 (Business-Specific):**
   - Concrete service definitions (e.g., GitHub App setup, EKS cluster specs).
   - Owned by teams; versioned and deployed independently.

---

**7. Networking & EKS Envers**
- **Networking Enver:**
   - Provisions VPCs, Transit Gateway, and CIDR ranges (shared via IPAM).
   - Each VPC connects to one TGW; disjoint TGWs enforce network isolation.

- **EKS Enver:**
   - Deploys one EKS cluster per enver (workspace account).
   - Consumes networking products (VPC endpoints, DNS).
   - Maps IAM roles to Kubernetes service accounts via OIDC.

---

**8. Visualization & Management**
- **Web Console:**
   - AppSync-powered graph UI showing enver dependencies.
   - Real-time updates from Config Store; interactive architecture diagrams.

- **Automated Cleanup:**
   - Clones limited to 20 per enver; developers manually delete via platform tools.

---

**9. Compliance & Testing**
- **Testing:**
   - Unit tests in enver CI/CD; integration/E2E tests as separate envers.
   - CloudFormation rollback for failed deployments.

- **Audit:**
   - SSM Parameter Store versions track configuration history.

---

**10. Conclusion**  
OnDemandEnv provides a Git-centric, self-service platform for managing distributed systems at scale. By codifying dependencies in ContractsLib and leveraging AWS-native tooling, it ensures consistency, isolation, and agility across teams and environments.