---
layout: post
title: Serverless Architecture
date:   2018-04-16 00:25 IST
categories: cloud serverless architecture FaaS lambda
tags: cloud serverless FaaS lambda
comments: true
analytics: true
---

Serverless Architecture involves one or both of the following design choices:

* Out-of-the-box third-party services that can be directly consumed from the front-end/client. E.g. Auth0, Firebase, etc. (**Backend as a Service**)

* Custom logic written as Functions that run as standalone ephemeral instances (**Function as a Service**)

The focus of this blog will be on the latter, explained with a working example.

![Serverless](/assets/images/serverless.png "Serverless = FaaS ∪ BaaS")

<br>

## Evolution of Cloud Computing

| Technology | Unit of Scale | Abstraction | Ops |
| --- | --- | --- | --- |
| Virtual Machines | Machine | Hardware | Configure machines, network, OS... |
| Containers | Application | OS | Configure containers, manage app scale... |
| Serverless | Function | Language runtime | Deploy code(functions)... |


## Serverless Compute Manifesto

Source: [AWS re:Invent 2016: Building Complex Serverless Applications](https://youtu.be/yCOgc3MRUrs?t=4m50s)

* Function are the unit of deployment and scaling.

* No machines, VMs, or containers visible in the programming model.

* Permanent storage lives elsewhere.

* Scales per request; Users cannot over- or under-provision capacity.

* Never pay for idle (no cold servers/containers or their costs).

* Implicitly fault-tolerant because functions can run anywhere.

* BYOC - Bring Your Own Code.

* Metrics and logging are a universal right.


## Function as a Service (FaaS)

* Function as nanoservices responsible for a single task, as against microservices which are built around business capabilities

* Run in stateless containers

* Event-triggered

* Ephemeral (may only last for one invocation, e.g. a single request/response cycle)

* Fully managed by third-party FaaS provider

### FaaS providers

* [AWS Lambda](https://aws.amazon.com/lambda/)

* [Google Cloud Functions](https://cloud.google.com/functions/)

* [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)

* [IBM Cloud Functions](https://www.ibm.com/cloud/functions)

* [Auth0 Webtask](https://webtask.io/)

* [Iron.io](https://www.iron.io/)

### Benefits

* Horizontal scaling
    * Automatic, elastic, and managed by the provider

* Low operational cost (Economies of scale)
    * Ephemeral functions as against long living applications/microservices lends itself to a significantly cost effective pay-per-use pricing model

* Increased development velocity and faster releases
    * Shorter time to market

* Reduced administration

### Drawbacks

* Startup latency during cold starts
    * Containers are taken down after a few minutes of inactivity (~15 mins in AWS Lambda)
    * Provisioning of function container during cold starts can take a few seconds (depending on the implementation language)

* Increased vendor/3rd party dependency and vendor lock-in

* Tooling, local development, integration testing, monitoring and debugging
    * Evolving, but not mature enough yet

* Restrictions on memory and overall execution time
    * Vendors place certain restrictions on the memory consumption and execution time of a function
    * Not suitable for long running applications

* Statelessness brings its own complexity
    * Functions can share state only via an external data store

## Difference between FaaS and PaaS

![FaaS vs *aaS](/assets/images/cloud-platform-abstraction.png "FaaS vs *aaS")
###### Image source: [https://mesosphere.com/blog/iaas-vs-caas-vs-paas-vs-faas/](https://mesosphere.com/blog/iaas-vs-caas-vs-paas-vs-faas/)

> “If your PaaS can efficiently start instances in 20ms that run for half a second, then call it serverless.”
>
> <cite>&mdash; Adrian Cockroft</cite>


> "Most PaaS applications are not geared towards bringing entire applications up and down for every request, whereas FaaS platforms do exactly this. The key operational difference between FaaS and PaaS is scaling. With most PaaS’s you still need to think about scale, e.g. with Heroku how many Dynos you want to run. With a FaaS application this is completely transparent."
>
> <cite>&mdash; Mike Roberts, VP of Engineering at Intent Media </cite>

## FaaS Frameworks

Some of the drawbacks mentioned earlier are being alleviated by Frameworks that aid in developing and deploying serverless architectures to various FaaS providers.

* [Serverless Framework](https://serverless.com/framework/) - toolkit for deploying serverless architectures to any provider
* [Apex](http://apex.run/) - framework for AWS Lambda functions
* [Kubeless](http://kubeless.io/) - Kubernetes Native Serverless Framework
* [Sparta](https://gosparta.io/) - a Go framework for AWS lambda
* [Fission](https://fission.io/) - framework for serverless functions on Kubernetes

## Serverless Framework

* One of the popular open source projects for building applications with FaaS
* Supports multiple programming languages
* Supports multiple providers - AWS, MS Azure, GCP, IBM OpenWhisk, etc.

### Main concepts in serverless framework

#### Functions

* Unit of deployment
* Responsible for single task
* Support for Node.js, Java, Python, etc.

#### Events

* Triggers
* Vendor provisioned infrastructure dependent
* E.g: HTTP events from AWS API Gateway, etc.

#### Resources

* Infrastructural components used by Function
* E.g: S3 Bucket, Dynamo DB Table, etc.
* Framework automatically provisions the resources

#### Services

* Unit of organization - Organizes the Functions, Events and Resources
* Defined in a Serverless YAML file

#### Plugins

* Extend the Serverless Framework functionality

#### Providers

* Vendor hosts like AWS (Lambda), Google (Cloud Functions), IBM (Openwhisk), etc.

## Todo Service built with NodeJS using Serverless Framework, running on AWS Lambda

**Github Repository: [https://github.com/msanand/serverless-todo-api](https://github.com/msanand/serverless-todo-api)**

![Serverless Todo Service Architecture](/assets/images/sls_todo_architecture.png "Serverless Todo Service Architecture")
<sup>**Note**: The single line from AWS Lambda to DynamoDB in the diagram above is a simplification to avoid cluttering. There is no common connection shared between the lambda functions.</sup>

#### Pre-requisites

* Install Node.js : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
* Install Serverless Framework: `npm install -g serverless`

#### Get the Serverless Todo Service project
* Clone Github project : [https://github.com/msanand/serverless-todo-api](https://github.com/msanand/serverless-todo-api)
* Alternatively, you can install the service locally from Github using the serverless command: `serverless install --url https://github.com/msanand/serverless-todo-api`
* Install module dependencies: `npm install`

#### Set-up AWS credentials
* `serverless config credentials --provider aws --key <key> --secret <secret>`
* Refer [serverless documentation](https://serverless.com/framework/docs/providers/aws/guide/credentials/) for other options.

#### Test locally
* Install dynamodb local: `serverless dynamodb install`
* Start Todo Service in offline mode: `serverless offline start`
* Test the REST APIs @ [http://localhost:4000](http://localhost:4000)
* Test the functions by invoking them locally. E.g. `serverless invoke local -f list`

#### Deploy serverless todo service
* Deploy the Todo Service to AWS Lambda: `serverless deploy`

#### Test deployed functions
* Test the APIs of the deployed service using a REST client. API endpoints can be obtained using the command `serverless info`
* Or test deployed functions using `serverless invoke -f <function>`

Now you have a working Serverless application that is fully managed by AWS Lambda.

Serverless AWS Lambda CLI Reference: [https://serverless.com/framework/docs/providers/aws/cli-reference/](https://serverless.com/framework/docs/providers/aws/cli-reference/)

## Summary

> All design is about tradeoffs. There are some distinct advantages to applications built in this style(serverless) and certainly some problems too.

* Re-thinking of the traditional cloud application architecture
* Takes full advantage of the scale and agility of cloud
* Move from 'build to last' to 'build to change'
* 'Batteries included' approach for fast development cycle
* Promising future for Serverless!
