# ondemandenv Organization

**Platform for On-Demand Environments and Service Contract Management in Distributed Systems**

Welcome to the `ondemandenv` organization! This organization showcases the practical application of the ondemandenv platform, a solution designed to revolutionize the Software Development Life Cycle (SDLC) for Service-Oriented Architectures (SOA) and microservices.

ondemandenv addresses the complexities of modern distributed systems by providing a platform for:

*   **Streamlining Service Dependencies:**  Clearly define and manage dependencies between microservices and components.
*   **Enhancing Team Collaboration:** Facilitate collaboration through code-defined service contracts and on-demand environments.
*   **Accelerating Development Cycles:** Enable rapid experimentation and testing with isolated, cloned environments.
*   **Ensuring Consistency and Predictability:**  Promote predictable service behavior through contract-based interactions and versioned configurations.

## odmd-contracts-sandbox: Your Contracts Library Example

The `odmd-contracts-sandbox` repository serves as a concrete example of a **ContractsLib** within the ondemandenv ecosystem.  ContractsLib is a central component where you define the architecture of your application as code. Think of it as the "congress" of your services, where teams negotiate and agree upon how services interact.

**Key Role of `odmd-contracts-sandbox`:**

*   **Defines Builds and Envers:** This repository outlines all the **Builds** (deployable units of code) and **Envers** (Environment Versions - logical deployment environments) for services within the `ondemandenv` organization.
*   **Service Contract Definition:** It codifies the contracts between different services, specifying what products each enver produces and what it consumes from others.
*   **Example Implementations:**  `odmd-contracts-sandbox` demonstrates how to extend built-in build types and define custom envers. For instance, it includes:
    *   **User Auth Build:**  Extending the base `user-auth` build with the `user-pool` repository to define user authentication services.
    *   **EKS Cluster Build:**  Extending the `eks-cluster` build with the `odmd-eks` repository to manage and deploy Kubernetes clusters.

**Core Concepts in Action (as exemplified in `odmd-contracts-sandbox`):**

*   **Enver (Environment Version):**  Explore how `odmd-contracts-sandbox` defines various envers, each representing a distinct version of an environment for different services.
*   **Build:**  See the definitions of different build types and how they are configured to produce Docker images, CDK deployments, and other resources.
*   **ContractsLib:** Understand how `odmd-contracts-sandbox` itself acts as the ContractsLib, defining service dependencies and interactions as code.
*   **Products:** Observe how envers in `odmd-contracts-sandbox` are designed to produce and consume versioned configuration values (Products) for inter-service communication.
*   **On-Demand Environments:**  Imagine how, using this ContractsLib, developers can easily clone envers to create isolated environments for testing and development, reusing dependency configurations.

**Benefits of Exploring `odmd-contracts-sandbox`:**

*   **Practical Example:**  Provides a working example of how to structure your own ContractsLib and define services within ondemandenv.
*   **Architecture as Code:** Showcases the "app architecture as code" principle, where your system's architecture is explicitly defined and versioned in code.
*   **Understanding Service Contracts:** Illustrates how teams can negotiate and define service contracts through code and Pull Requests, fostering collaboration and clarity.

**Get Started:**

Dive into the `odmd-contracts-sandbox` repository to explore the concrete examples of build and enver definitions. Examine the code, understand the service contracts, and see how ondemandenv can help you manage your distributed system SDLC.

[Understand How OndemandENV work ](https://github.com/ondemandenv/INTRO.MD)

[Explore the odmd-contracts-sandbox repository!](https://github.com/ondemandenv/)
