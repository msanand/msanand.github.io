---
layout: post
title: AngularJS Dependency Injection - Demystified
date:   2014-09-08 10:15 IST
categories: javascript
tags: javascript angularjs dependency-injection
comments: true
analytics: true
---

One of the features that I really like in AngularJS is its use of dependency injection across the framework. I listed it as one of the best features of Angular in [my last post]({% post_url  2014-08-31-angularjs-best-parts %}). And as promised, I'll try to cover this topic in a little more detail here.

### What is Dependency Injection?

Dependency Injection is a software design pattern in which an object is given its dependencies, rather than the object creating them itself. It is about removing the hard-coded dependencies and making it possible to change them whenever needed. <br>

### Why do you need to inject dependencies?

* Separate the process of creation and consumption of dependencies
* Let the consumer worry only about how to use the dependency, and leave the process of creation of the dependency to somebody else
* Allow concurrent/independent development of the dependency and the dependent entity, while only maintaing a known contract
* Facilitate changing of the dependencies when needed
* Allow injecting mock objects as dependencies for testing, by maintaining the agreed contract

### How does dependency injection work in Angular?

Angular leverages dependency injection all across the framework. It works with functions defined for `controller`, `directive`, `service`, `factory`, etc.

<iframe width="100%" height="200" src="http://jsfiddle.net/anandmanisankar/Lzjvpc6b/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

In the above example, the controller `DemoController` is injected with two dependencies: `$scope` and `$http`. The controller doesn't know/care how these objects are created. It only knows the contract provided by these objects and how to consume them.

The interesting part here is how the framework (Angular) understands that `DemoController` requires these two objects. Simple, from the function parameters - `$scope` and `$http`. But what do you think will happen if we switched the order of parameters?

<iframe width="100%" height="200" src="http://jsfiddle.net/anandmanisankar/ae4sgksw/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It still works fine! So, Angular doesn't just know what the dependencies are from the parameters, it also knows them by their name! That way, even if we change the order of the parameters, it injects the right dependencies.

Now, let's try using a different name for the dependencies:

<iframe width="100%" height="200" src="http://jsfiddle.net/anandmanisankar/y1qug5bc/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

That didn't work very well! So, Angular recognizes the dependencies by their *specific parameter names*. You can't just use *any* name that you like for your function parameters where you expect dependencies to be injected. This approach is called implicit dependency annotation.

### That's great. But how does it *really* work?

Let's take a step back and review some things:

* Javascript uses positional parameters. Functions in javascript expect parameters in a particular order. Even if the parameter names are interchanged/reordered in the function definition, the caller will still pass them in the same order.
* The names of the parameters don't matter in Javascript functions. You could call them whatever you want; the caller doesn't care.

So, how do we bring in some flexibility in parameter passing in JavaScript. One option is to use an object as parameter.

{% highlight js%}
function DemoController(parameters) {
  params = {}
  params.name = parameters.name || "HeWhoShallNotBeNamed";
  params.age = parameters.age || 71;

  console.log("Name is " + params.name + ", age is " + params.age);
}
DemoController({name: "Mr. White", age: 45});
DemoController({age: 42, name: "Mr. Pink"}); //Order doesn't matter
{% endhighlight %}

But Angular injection didn't work this way. The controller used regular function parameters, but for angular, they were not positional anymore! So what Angular does with dependency injection is something extraordinary from that perspective!

This is achieved through some clever implementation of a concept called '[Named Parameters](http://en.wikipedia.org/wiki/Named_parameter)'.

Named Parameters are not new to programming languages. They have existed for a while now in languages like Python, Visual Basic, Objective-C, etc. In fact, the example I gave earlier is a way to emulate named parameters in JavaScript, which the language doesn't natively support yet (It will be available with ECMAScript 6).

AngularJS's implementation of named parameters is very different from traditional approach. It looks up the parameters of all injectable functions and identifies the parameters by their name. By recognizing the known names, it knows which objects are to be injected into the functions. You must be thinking - Wow, that must be some really complex logic! It turns out Angular just reads the function definition using toString and parses the string to extract the parameter names.

A little digging up of AngularJS code reveals a function called `annotate` in [`injector.js`](https://github.com/angular/angular.js/blob/master/src/auto/injector.js#L98-104) which takes care of this logic. Here's a snippet from the `annotate` function:

{% highlight js%}
fnText = fn.toString().replace(STRIP_COMMENTS, '');
argDecl = fnText.match(FN_ARGS);
forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
  arg.replace(FN_ARG, function(all, underscore, name) {
    $inject.push(name);
  });
});
{% endhighlight %}

Angular has two important components which makes dependency injection possible - `$injector` and `$provide`. `$injector` is responsible for identifying and retrieving the dependencies as defined by the provider (`$provide`) which has the knowledge of how to create the dependencies to be injected. I'll explain more about the provider in my [next post]({% post_url 2014-09-22-angularjs-provider-subsystem %}).

### Issues with implicit dependencies

There is one big issue with the function.toString() approach of `$injector` to identify the dependencies. What happens if the JavaScript code was minified?

<iframe width="100%" height="200" src="http://jsfiddle.net/anandmanisankar/6s6o4w2v/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

__*FAIL!*__ The parameter names are obfuscated, and Angular doesn't know what needs to be injected. Obviously, the folks building Angular have thought through this, and have provided alternate approaches to annotating a function.

#### Approach 1: Inline array annotation

In this approach, instead of just providing a controller function, we pass an array whose elements consist of a list of names of the dependencies followed by the function itself. This overcomes the issues caused with minified JavaScript, by allowing flexible parameter names.

<iframe width="100%" height="200" src="http://jsfiddle.net/anandmanisankar/6x23952t/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### Approach 2: `$inject` property annotation

Here, the function is annotated with a `$inject` property which is set to an array of dependency names which are to be injected.

<iframe width="100%" height="250" src="http://jsfiddle.net/anandmanisankar/vcjuxdeL/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The choice between these two approaches depends on ones preferred way of defining the function, inline or as a separate variable.

Earlier, I showed you only a part of the `annotate` function in [`injector.js`](https://github.com/angular/angular.js/blob/master/src/auto/injector.js#L81-116) in the Angular source. If you looked at the entire function, you will realize that it is capable of handling all the different annotation approaches described above.

{% highlight js%}
function annotate(fn, strictDi, name) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (typeof fn === 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        if (strictDi) {
          if (!isString(name) || !name) {
            name = fn.name || anonFn(fn);
          }
          throw $injectorMinErr('strictdi',
            '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
        }
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
          arg.replace(FN_ARG, function(all, underscore, name) {
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}
{% endhighlight %}


### Performance considerations and preferred annotation approach

You might wonder about the performance cost associated with such string parsing of all injectable functions. Angular takes care of this by caching the `$inject` property after the first time. So this doesn't happen everytime a function needs to be invoked.

**PRO TIP**: If you are looking for the approach with the best performance, go with the `$inject` property annotation approach. This approach entirely avoids the function definition parsing because this logic is wrapped within the following check in the `annotate` function: `if (!($inject = fn.$inject))`. If `$inject` is already available, no parsing required!

In this context, you need to worry about performance impact only if you used a lot of injectable functions in your angular code. Then it would be a trade-off between performance and your preferred coding style.

The implicit dependencies approach is probably the easiest and fastest to code. If you would prefer to stick to this style, you might be interested in tools like '[ng-annotate](https://github.com/olov/ng-annotate)' which help with adding and removing Angular dependency injection annotations in your source code. You could run this as a grunt task and replace the implicit annotations with explicit ones across your source code.

**PRO TIP**: Use the `ng-strict-di` in the angular app element if you want to enforce explicit function annotation. With this attribute set, application will fail to invoke functions which do not use explicit function annotation and are unsuitable for minification. You can see what happens in the strict-di mode in the `annotate` function definition : `throw $injectorMinErr('strictdi', '{0} is not using explicit annotation and cannot be invoked in strict mode', name);`

That covers pretty much all that I wanted to share on the injector sub-system in AngularJS and how it provides an intuitive dependency injection mechanism. I know I haven't explained the concept of provider in detail here. I'll reserve that for my [next post]({% post_url 2014-09-22-angularjs-provider-subsystem %}).
