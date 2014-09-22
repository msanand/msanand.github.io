---
layout: post
title: "AngularJS&#58; The Best Parts"
date:   2014-08-31 20:01 IST
categories: javascript
tags: javascript angularjs
comments: true
analytics: true
---

Having concluded my [blog series on 'Jekyll']({% post_url 2014-08-24-set-up-blog-jekyll-github-pages-2 %}), I decided to move on to a topic that I have been glued to for sometime now - **AngularJS**.

Having worked on web technologies for a few years now, I have some experience working with a few JavaScript frameworks and libraries. Surprisingly, AngularJS turned out to be a very different beast.

>The superheroic Javascript MVW framework

AngularJS is a structural framework for building dynamic web applications. It is not a library. So, by the principle of 'inversion of control', the developer is expected to code following certain rules and guidelines laid out by the framework.

Angular is opinionated about how a dynamic web application should be built. And almost all of the opinions are backed by strong design principles and justifications. It also simplifies the application development process by abstracting a lot of the internal complexity and exposing only what the application developer needs to know.
<br>

>It is very helpful indeed if the framework guides developers through the entire journey of building an app: from designing the UI, through writing the business logic, to testing.
>
> <cite>&mdash; The Zen of Angular</cite>

The AngularJS journey can evoke mixed feelings. The learning curve is very different from other JS frameworks. The initial barrier to get started is very low. But once you start diving deep the learning curve suddenly becomes steep. [Ben Nadel](http://www.bennadel.com/) sums up his experience succintly through this time series:

![Feelings about AngularJS over time](/assets/images/feelings_about_angularjs_over_time.png "Feelings about AngularJS over time")

Although I'm still in transit, my journey so far has been pretty similar, if not as dramatic. But there have been some key elements of Angular that have got me very interested. Here, I'll try to cover a few of those aspects that I have begun to love in AngularJS.

### The simplicity of data binding

In almost all cases, setting up data binding requires some amount of coding to bind the view and model together. The way in which Angular approaches two-way binding is pretty cool and intuitive. It saves you from writing considerable amount of boiler-plate code.

The model acts as the single source of truth for all the data in your application. The data binding directives ({% raw %}{{ }}{% endraw %}) provided by Angular binds the model to the DOM seamlessly. Rest is magic!

The beauty lies in the simplicity:
<iframe width="100%" height="150" src="http://jsfiddle.net/anandmanisankar/L6nofag6/embedded/html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The simplicity is achieved through some smart change detection implemented using 'Dirty checking', as against traditional 'change listeners' or 'accessors' that are used in some other JS frameworks like Backbone. In simple terms, Angular remembers the bound value and compares it to the new value to detect any change. This, it does through an operation called `$digest` loop which loops through all the variables under watch in the current scope and its children to check if it is dirty.

With the dirty checking approach, the data models can be plain old JavaScript objects (POJOs or POJSOs), without the need for any getter/setter. This makes your code much simpler and cleaner.

There is a lot of discussion around performance impact of dirty checking as against other approaches, but Misko Hevery, the father of AngularJS, quashes those arguments in [this stackoverflow response](http://stackoverflow.com/questions/9682092/databinding-in-angularjs/9693933#9693933).  

The complexity of the `$digest` loop can be seen from this comment in the `$digest` method in angular.js source.

{% highlight javascript%}
// Insanity Warning: scope depth-first traversal
// yes, this code is a bit crazy, but it works and we have tests to prove it!
{% endhighlight %}

But like I said before, the beauty lies in the simplicity that abstracts the internal complexity!

In future, Object.observe() - the new ECMAScript 6 API under construction, will replace these custom change detection mechanism. The native implementation should make change detection much faster.

<hr>
#### **Update: 5<sup>th</sup> Sep 2014**
What makes data binding in Angular even more powerful is the fact that the binding source can be an expression. Angular evaluates the expression between the double curly brace notation ({% raw %}{{ }}{% endraw %}) before binding.

Here's a quick example:
<iframe width="100%" height="150" src="http://jsfiddle.net/anandmanisankar/05eryfmh/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
<hr>

### Well implemented MVC (or MVVM or MVP or MVW)

There has been a lot of debate over whether AngularJS implements MVC or MVVM or MVP. A pissed-off Igor Minar (Lead of AngularJS) decided to end the debate with [this post](https://plus.google.com/+AngularJS/posts/aZNVhj355G2) in the AngularJS forum, deciding to call Angular a MVW framework: Model - View - Whatever!

>I'd rather see developers build kick-ass apps that are well-designed and follow separation of concerns, than see them waste time arguing about MV* nonsense. And for this reason, I hereby declare AngularJS to be MVW framework - Model-View-Whatever. Where Whatever stands for "whatever works for you".
>
> <cite>&mdash; Igor Minar</cite>

Many of the frameworks/libraries implementing MVC give you the option of defining the M, the V and the C, and ask you to tie them together yourself. AngularJS lets you focus only on separating out M-V-C (or VM), and internally takes care of the wiring. You also don't need to inherit from any framework object to define your entities. It feels like a very natural approach to implementing MVC.

>Angular is the only framework that doesn’t make MVC seem like putting lipstick on a pig.

<iframe width="100%" height="150" src="http://jsfiddle.net/anandmanisankar/bwhpavha/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The `$scope` object acts like a ViewModel which provides the data required for the view. The controller initializes the `$scope` and provides functions to manage the behaviour. It does not store any state of its own. The view is the HTML that has the corresponding controller directive. Very clear separation of concerns!

###Declarative User Interface

>Any application that can be written in JavaScript, will eventually be written in JavaScript.
>
> <cite>&mdash; Jeff Atwood</cite>

Web programming was becoming JavaScript heavy. Some frameworks took it a notch further by taking the convoluted approach of defining user interface procedurally in Javascript and in turn generating the HTML, entirely ditching the declarative nature of user interface definition using HTML. But over the last few years, HTML has back in-focus again - thanks to [HTML5](http://www.w3.org/TR/html5/) and [Web Components](http://www.w3.org/TR/components-intro/). After all, HTML is what the matters to the browser at the end of the day!

Being declarative, HTML feels more intuitive for defining the user interface. It is also easy to understand and manipulate. It provides a clear separation of the presentation layer from the imperative logic.

>Angular is built around the belief that declarative code is better than imperative when it comes to building UIs and wiring software components together, while imperative code is excellent for expressing business logic.
>
> <cite>&mdash; The Zen of Angular</cite>

AngularJS fully leverages the declarative power of HTML for building the User Interface. It doesn't stop there; It enhances HTML further by teaching it some new tricks. Angular uses concepts of custom element, templates, etc. to make HTML, and thereby building User Interface, more powerful and intuitive.

It also uses HTML to determine the execution of the application. By linking controllers to sections of HTML using special attributes, you can declaratively tell Angular which controller to use for which parts of the user interface. The framework will take care of the loading and linking.

### Directives

>Angular is what HTML would have been had it been designed for applications.

HTML is an awesome declarative language for building static content. But it doesn't provide much support in building dynamic applications - hence the dependency on JavaScript. But what if HTML was given a boost with custom constructs.

>HTML enhanced for web apps!

'Directives' are Angular's way of boosting HTML with additional functionality. It breaks the boundaries of traditional HTML elements and opens it up to infinite possibilities. The core concept behind this is 'custom elements' driven by the 'Web Components' initiative. But Angular likes to call it 'directives'.

AngularJS allows developers to build their own custom HTML constructs: elements, attributes, classes, etc. All the traditional DOM manipulation that is done to build something new is now captured in this concept called directives, thereby separating this out from the M-V-C and improving greatly improving the modularty of the application. Directives are re-usable elements that act as the building blocks for your application view.

I also find the usage of directives (if designed well) greatly enhances the readability of the HTML. Imagine HTML with some rich elements like `<colorpicker></colorpicker>`, `<datepicker></datepicker>`, etc. instead of infinitely nested div elements.

**Side-note:** Polymer, another initiative driven by Google, is making the Web Components standard available to modern day browsers. I really hope to see some synergy between Polymer and AngularJS in the area of Web Components, instead of each taking a path of its own.

### Dependency Injection

AngularJS has a built-in Dependency Injection mechanism that works with almost all the JavaScript constructs of Angular. All Angular objects have their dependencies injected, be it framework dependencies or custom built dependencies.

Angular has chosen dependency injection over AMD(Asynchronous Module Definition) patterns, as a design decision. And from whatever I've seen so far, it seems to have been a wise choice. It helps you compose your application by grabbing whatever you need, without worrying where it resides and how it should be created.

{% highlight javascript%}
var app = angular.app('MyApp',[])
app.controller('MyCtrl', function($scope, $location, MyService) {
    // Do what you need to do!
  });
{% endhighlight %}

Here, you see that the controller 'MyCtrl' is provided with all that it needs - framework services like the scope, $location service and also custom services like MyService. Creating these dependencies and managing them is the responsibility of an AngularJS sub-system called Injector. Later, I will [post in detail on how the Injector sub-system of AngularJS works]({% post_url  2014-09-08-angularjs-dependency-injection-demystified %}). For now, just admire the beauty of the design.  

Dependency Injection is one of the design principles that I really like. It helps you compose a SPA (Single Page Application) better. I have personally used it and have found tremendous benefits, especially when it comes to testability.


### Testability

>It is a really, really good idea to regard app testing as equal in importance to app writing. Testing difficulty is dramatically affected by the way the code is structured.
>
> <cite>&mdash; The Zen of Angular</cite>

AngularJS doesn't treat testing as an afterthought. It is built with testability in mind. It ensures applications built with this framework are unit testing ready. This is mainly possible because AngularJS puts together the application using Dependency Injection.

Any sub-system of your application can be tested by mocking the dependency that is injected into it. In fact, Angular provides a mock HTTP server that can be inject in places where $http is a dependency. It also clearly separates out the application logic from the DOM manipulations, making testing a lot easier.

These, in my opinion, are some of the best features of AngularJS. This doesn't mean it is perfect. Angular has its own flaws in being highly opinionated and sometimes complicated. It is also built mainly for CRUD applications, and is not suited for games or graphics intensive applications. But the core design principles are fairly strong, which is why I think it is quite powerful and stands out in the web development world. Plus the backing from Google is giving it that extra push!

I'll cling on to this topic for a few more posts, while I explore some of the intricacies of this superheroic JavaScript framework.
