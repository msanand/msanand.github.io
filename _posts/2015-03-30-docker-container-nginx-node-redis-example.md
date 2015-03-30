---
layout: post
title: A sample Docker workflow with Nginx, Node.js and Redis
date:   2015-03-30 21:00 IST
categories: containers docker node.js nginx redis
tags: containers docker node.js nginx redis
comments: true
analytics: true
---

In my [previous post]({% post_url 2015-03-28-container-docker-PaaS-microservices %}) I wrote about Containers and Docker, how they are influencing PaaS, microservices and the cloud in general. If you are new to Docker or the concept of containers, I would highly recommend reading my [previous post]({% post_url 2015-03-28-container-docker-PaaS-microservices %}) first. In this post, as a continuation, I will elaborate on some of the concepts with a Docker based sample workflow. You can find all the code I'm discussing below on [my Github](https://github.com/msanand/docker-workflow).

For this example, I have a very simple Node.js applications that increments a counter stored on Redis. I want to run Redis and the node application independently as I want to have the ability to scale the node application depending on the load. To start off, I have 3 instances of the node server running the application. I have an Nginx server in front of node for load balancing the node instances. <br>

Let's now talk in terms of containers, specifically Docker containers. Simple; 1 container for each service/process!

- 1 Redis container
- 3 Node containers
- 1 Nginx container

So, the overall picture looks something like this:

![Docker Sample](/assets/images/DockerSample.png "Docker Sample")

I could build the container from scratch using Docker commands, but to make it easier I wrote a Dockerfile which would build the container for me. I also use Docker Compose to compose the application linking the containers.

Firstly, here's how I have defined the containers.

## The Redis container

The Redis Dockerfile looks like this:
<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/redis/Dockerfile?footer=minimal">
</script>

The Redis container is a super simple one. I've configured the following within the Dockerfile:

* Base 'Ubuntu' image from Docker Hub.
* Install Redis Server using APT.
* Since the default port for Redis is 6379, I let Docker know that the container will listen on this port using `EXPOSE` instruction.
* I then defined an entry point which starts the Redis Server. I use `ENTRYPOINT` here instead of `CMD` as I don't want the command to be overwritten.

Building a Docker image from the Dockerfile is pretty simple:

`docker build -t msanand/redis .`

Creating a container from the image is pretty straight forward as well:

`docker run -d --name redis -p 6379:6379 msanand/redis`

## The Node container

Let's look at the Node application first. I don't think it requires much explanation. All I'm doing is incrementing a view counter on each request using Redis INCR. I'm using the [node-redis module](https://github.com/mranney/node_redis) along with [hiredis](https://github.com/redis/hiredis) for better performance. (Yeah, a super high performance view counter wouldn't hurt!)

You'll notice that I'm using some environment variables for the address and port for the Redis server. These environment variables are defined by Docker when linking the Redis container, making it convenient to communicate between containers.

<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/node/index.js?footer=minimal">
</script>

Now let's look at the Dockerfile for the Node container:
<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/node/Dockerfile?footer=minimal">
</script>

* Ubuntu base image pulled from Docker Hub
* Install dependencies using APT
* Install Node.js using apt-get
* Install nodemon globally using npm
* Copy the application source from the host directory to `src` within the container
* Run `npm install` to install the node application dependencies
* Port 8080 is exposed from the container and the application is run using nodemon

Build a Docker image:

`docker build -t msanand/node .`

Create a container from the image:

`docker run -d --name node -p 8080:8080 --link redis:redis msanand/node`

Since I plan to balance load between 3 node servers, I would have to create 3 containers - node1, node2 and node3.

Note that I'm linking the node container with the redis container. This allows the Node container to interact with the Redis container using the latters address and port defined as environment variables.

With this we have a Node application displaying a view counter maintained on Redis. Let's look at how we can load balance this with Nginx.

## The NGiNX container

The core of NGiNX is its configuration, defined as a conf file. I've defined a simple Nginx configuration defining 3 upstream servers:

<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/nginx/nginx.conf?footer=minimal">
</script>

I've registered a `node-app` upstream server which load balances between 3 servers: node1, node2 and node3, on port 8080. I've also specified an equally weighted `least_conn` load balancing policy which balances load based on the number of active connections on each server. Alternately, you could use a round robin or IP hash or key hash based load balancing method. The Nginx server listens on port 80, and proxies requests to the upstream server `node-app` based on the load balancing policy. I would be digressing if I explained any more on the Nginx configuration.

Let's look at the nginx Dockerfile:
<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/nginx/Dockerfile?footer=minimal">
</script>

Very similar to the previous Dockerfiles. But there are a couple of things that I would like to highlight here:

* Before starting the nginx server, I'm deleting the default nginx configuration file and replacing it with my own copy.
* I ensure that Nginx doesn't run as a daemon by adding `daemon off` to the config file. This is required because Docker containers are alive only for the duration when the process they are running is alive. So nginx running as a daemon would instantly stop the container as soon as it starts. Instead, running Nginx as a service ensures the container remains alive until the service is running.

Build a Docker image:

`docker build -t msanand/nginx .`

Create a container from the image:

`docker run -d --name nginx -p 80:80 --link node:node msanand/nginx`

Finally, we have an Nginx server load balancing 3 node servers, which in turn talk to a Node server - each running in their own container.

## Composing the application with Docker Compose

> Compose is a tool for defining and running complex applications with Docker.

It can get pretty tedious to build the images, run and link containers using individual commands, especially when you are dealing with many. Docker Compose lets you define a multi-container application in a single file, and spin up the application with a single command.

I've defined a docker compose YAML as follows:
<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/docker-compose.yml?footer=minimal">
</script>

The YAML file defines each container by name, pointing to the Dockerfile that is used for the build. In addition, it contains the container links and ports exposed by each of them.

With a single command, Docker Compose will build the required images, expose the required ports, run and link the containers as defined in the YAML. All you need to do is run `docker-compose up`! Your 5 container application is up and running. Hit your host URL on port 80 and you have your view counter!

One of the significant features of Docker Compose is the ability to dynamically scale a container. Using the command `docker-compose scale node=5`, one can scale the number of containers to run for a service. If you had a Docker based microservices architecture, you could easily scale specific services dynamically depending on the load distribution requirements. Ideally, I would have preferred defining 1 node service and scaling it up using Docker Compose. But I haven't figured a way to adjust the Nginx configuration dynamically. Please leave a comment if you have any thoughts on this.

But one big caveat here is that Docker Compose is not production ready yet. The documentation recommends usage in a development environment, but not in production yet. But there are other container orchestration engines like Kubernetes discussed in my [previous post]({% post_url 2015-03-28-container-docker-PaaS-microservices %}).

## Continuous Integration and Deployment

I've configured 2 service hooks in [my Github repository](https://github.com/msanand/docker-workflow).

* CircleCI - for continuous integration (and potentially deployment)
* Docker Hub - for continuous Docker builds

The Circle CI YAML configuration looks like this:
<script src="http://gist-it.appspot.com/https://github.com/msanand/docker-workflow/blob/master/circle.yml?footer=minimal">
</script>

It uses the Docker service provided by CircleCI. It installs docker-compose as a dependency, and creates the Node container without any linkage to Redis. It then triggers the test on the Node application using mocha. This ensures that the tests are run against every new commit to Github.

![Circle CI build output](/assets/images/CircleCI_output.png "Circle CI build output")

The Docker Hub service hook triggers a Docker build in [my Docker Hub Repository](https://registry.hub.docker.com/u/msanand/docker-workflow/) on every commit. This ensures that the latest image is always available in Docker Hub for continuous deployment to production. The production environment can pull the latest images from Docker Hub and compose the application from containers in no time.

That concludes my sample Docker workflow with Node.js, Redis and Nginx. Please leave a comment if you have any suggestions or better approaches to doing this. It would be great to know your development workflow with Docker!
