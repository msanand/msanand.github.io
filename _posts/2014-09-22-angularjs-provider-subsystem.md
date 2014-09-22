---
layout: post
title: "AngularJS&#58; The Provider Subsystem"
date:   2014-09-22 22:05 IST
categories: javascript
tags: javascript angularjs provider service factory
comments: true
analytics: true
---

In my [previous post]({% post_url 2014-09-08-angularjs-dependency-injection-demystified %}), I did a deep-dive into the **injector** sub-system of AngularJS, which plays a very significant role in managing the dependency injection mechanics of the framework. Another equally important player in supporting dependency injection is the **provider**, also referred to as `$provide`.

The injector needs to know how to create the objects that are to be injected, and the provider has precisely this knowledge. That's how they work together!

In this post, I'll get into the details of how the provider works, the different ways in which you can create custom services and some details on an elegant design pattern built into the provider.  

<br>

### How does the provider know how to create objects?

The provider has the recipe. Yes, seriously! That's what Angular calls it. The provider is aware of the recipe to create different types of objects; Specifically, two different types:

* Services
* Specialized Objects

**Services** are objects defined by the developer, whereas **Specialized Objects** are framework objects like controllers, directives, etc.

Since 'services' are custom objects, the provider needs to be taught the recipe to create these objects. One can do so registering a recipe for creating the service with the injector. There are **five different recipe types**:

* Provider
* Factory
* Service
* Constant
* Value

Ok... the terminologies are a little confusing. I blame Angular for that! Angular documentation uses the term 'service' in two different contexts. One, generically as a custom object which could be defined using any of the above recipes; Other, specifically the `service` recipe type. To avoid confusion, I'm going to use the term 'service' in the rest of the blog only in the context of the service recipe type, unless stated otherwise.

Let's get back to the 5 recipe types. The **'provider'** recipe is the main recipe type; the other 4 are just syntactic sugar on top of the provider recipe type. To confirm this, let's dig a little into the Angular source code. If you peeked into the [`createInjector` function in injector.js](https://github.com/angular/angular.js/blob/master/src/auto/injector.js#L655-680), you'll notice the following:

{% highlight javascript%}

function provider(name, provider_) {
  assertNotHasOwnProperty(name, 'service');
  if (isFunction(provider_) || isArray(provider_)) {
    provider_ = providerInjector.instantiate(provider_);
  }
  if (!provider_.$get) {
    throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
  }
  return providerCache[name + providerSuffix] = provider_;
}

function factory(name, factoryFn) {
  return provider(name, { $get: factoryFn });
}

function service(name, constructor) {
  return factory(name, ['$injector', function($injector) {
    return $injector.instantiate(constructor);
  }]);
}

function value(name, val) {
  return factory(name, valueFn(val));
}

function constant(name, value) {
  assertNotHasOwnProperty(name, 'constant');
  providerCache[name] = value;
  instanceCache[name] = value;
}

{% endhighlight %}

You can clearly see that all recipe types are wrappers over the `provider` recipe type. So what is the difference?

### What is the difference between the recipe types?

Constant and Value recipes are the simplest recipes. You can register a value against a name using the construct `module.value('valueName', value)` where value can be a string, number, array, object or even a function. This value can then be injected via DI wherever required.

A constant can be registered in a similar way: `module.constant('constantName', value)`. But the main difference between constant and value is that a constant can be used during the configuration phase, whereas a value can only be used during the run phase of Angular. **Configuration phase** is the initial bootstrap stage when Angular creates all services, while the **run phase** is the usual application run time.

Let's keep the value and constant recipes aside for now, and focus on the provider, factory and service recipes.

There are numerous articles and blogs explaining the difference between service, factory and provider recipe types, but the best one I found was [in the AngularJS forum](https://groups.google.com/forum/#!msg/angular/56sdORWEoqg/HuZsOsMvKv4J). With due credits to [Ben Clinkinbeard](http://benclinkinbeard.com/) for the near perfect elucidation and to [Miško Hevery](http://misko.hevery.com/) for fine tuning it:

**Services**

*Syntax*: `module.service( 'serviceName', function );`

*Result*: When declaring serviceName as an injectable argument you will be provided an instance of the function passed to module.service.

*Usage*: Could be useful for sharing utility functions that are useful to invoke by simply appending () to the injected function reference. Could also be run with injectedArg.call( this ) or similar.

**Factories**

*Syntax*: `module.factory( 'factoryName', function );`

*Result*: When declaring factoryName as an injectable argument you will be provided the value that is returned by invoking the function reference passed to module.factory.

*Usage*: Could be useful for returning a 'class' function that can then be new'ed to create instances.

**Providers**

*Syntax*: `module.provider( 'providerName', function );`

*Result*: When declaring providerName as an injectable argument you will be provided the value that is returned by invoking the $get method on a instance of the function passed to module.provider.

*Usage*: Could be useful for returning a 'class' function that can then be new'ed to create instances but that requires some sort of configuration before being injected. Perhaps useful for classes that are reusable across projects? Still kind of hazy on this one.

This example re-iterates the above statements in code:

<iframe width="100%" height="450" src="http://jsfiddle.net/anandmanisankar/83hgocub/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It is also important to note that **all angular services are singletons (per injector)**. Here, I'm referring to services in general and not the specific recipe type. Angular instantiates the service once per injector and caches it. The same instance is injected as dependency wherever requested.

### But why so many recipes? And how does one choose between them?

Yeah, those are the bigger questions!

Constant and value recipes justify their need with a clear differentiating factor discussed above. Provider recipe has a USP that it can be used in the configuration phase. But it doesn't provide a very natural way of implementing a service object. So the general recommendation is to use it only when needed during the configuration phase.

Service and Factory are convenient wrappers over Provider. But how does one decide which of the two to use? And why do we need these 2 flavors?

There is no convincing black & white response. The most sensible answer according to me is **'to support different coding styles/practices'**.

Many articles and discussions just state the behavioural difference when recommending usage: E.g. Use a factory if you want the passed function to behave exactly like one, and use a service if you want it to be instantiated with a 'new' operator. These are just how factories and services are implemented internally.

If you ask me, pick the one that suits your style of coding. Angular documentation provides a good usage recommendation:

>Factory and Service are the most commonly used recipes. The only difference between them is that the Service recipe works better for objects of a custom type, while the Factory can produce JavaScript primitives and functions.

The official documentation also provides a good feature difference between the various recipes:

![Difference between AngularJS recipes](/assets/images/Angular_recipe_differences.png "Difference between AngularJS recipes")

### The not-often-talked-about 'Decorator'

Most articles, discussions, presentations are filled with details about service, factory and providers. But they tend to ignore a very elegant design pattern that Angular provides to enhance a service - **the decorator**.

Decorator is a design pattern that provides extensibility by allowing addition of behaviour to an object without the object or the consumer knowing it (and there lies the elegance).

**When do you need to use a decorator in Angular?**

Decorator can be used in cases where you want to enhance the service without actually tinkering with it directly. For e.g., you have defined a service in a module and this service is being used across various other modules in your application. Now, for one particular module you want to enhance the service without affecting the usage of this service in other modules. What do you do? Decorate the service in that module!

This would be really helpful in a case where a 3rd party module contributes a service, which you want to tweak before consuming it in your module, without affecting the original service.

Here's an example of how angular services can be decorated:

<iframe width="100%" height="600" src="http://jsfiddle.net/anandmanisankar/jd86qerb/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The best part is, neither the original service nor the consuming controller know about the decoration.

### Let's put it all together:

<iframe width="100%" height="920" src="http://jsfiddle.net/anandmanisankar/4pbn8587/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
