---
layout: post
title:  "How to set up a blog with Jekyll and Github Pages - Part 1"
date:   2014-08-17 09:10:00
categories: blogging
tags: blogging github-pages jekyll
comments: true
analytics: true
---

In my [previous post]({% post_url 2014-08-15-hello-blog %}), I wrote about some of my expectations from a blogging platform, and reasons why I was excited about Jekyll & Github Pages.

Here, I'll give you a quick run-through of how to get a blog up and running in a matter of few hours. <br>

###Hosting with Github Pages

Github allows 1 user page per account, which is hosted in a specially named git repository - '{username}.github.io'. Github recognizes this repository as the one hosting the user page, and serves its contents at the root of the URL http://{username}.github.io.

So, you could plonk an HTML file at the root of this repository and access it out of the above mentioned URL. Easy and free! That pretty much takes care of the hosting part.
But considering we don't want to build a blog from scratch, but instead want to leverage the site generation capabilities of Jekyll to help build one for us, lets continue...

###What is Jekyll?

Before getting into the exactly details of how to install and use Jekyll, let me introduce you to it first. Jekyll, Reader... Reader, Jekyll.

As I mentioned in my [previous blog]({% post_url 2014-08-15-hello-blog %}), Jekyll is an open source tool that builds a static web site from dynamic components like templates, liquid code, markdown, etc.

> Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through Markdown (or Textile) and Liquid converters, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server.

The directory structure of a basic Jekyll site looks something like this:

{% highlight bash%}
.
|
|-- _config.yml
|
|-- _includes
|       |
|       |-- head.html
|       |-- ...
|
|-- _layouts
|       |
|       |-- page.html
|       |-- post.html
|       |-- ...
|
|-- _posts
|       |
|       |-- 2014-01-01-blog.md
|       |-- ...
|
|-- index.html

{% endhighlight %}

Jekyll can be configured using a YAML based config file, using which you could modify its default behaviour. When the above directory structure is built using Jekyll, the output is a static web site generated under the '_site' folder.

Considering Github internally runs Jekyll, it is sufficient to push your templates and content maintaining the above structure, into your user page repository. Github, using Jekyll, will automatically build the static web site for you.

So, technically, you need not install Jekyll locally on your system. But you lose out on some of the advantages of having a local Jekyll installation - namely the ability to locally build and preview your web-site before publishing it, and even do so offline.

Not having a local Jekyll build environment for your blog is akin to not having a local build for your development project, and pushing your code to the central repository hoping that the central build will succeed. :) Not recommended!

###Installing Jekyll

Jekyll is bundled as a ruby gem, and hence require Ruby and RubyGems as pre-requisites. I would recommend visiting the [official installation page](http://jekyllrb.com/docs/installation/) for the steps to install Jekyll.

**PRO TIP**: If you want to keep your local Jekyll installation in sync with the version used in Github Pages, then install the Github Pages gem instead of the Jekyll gem - `gem install github-pages`. This ensures that your local Jekyll build churns out exactly the same site as the Github Pages build would.

###Scaffolding the initial Jekyll content
Once you are done with the installation, you can scaffold a new Jekyll directory structure using the following command:

`jekyll new <directory>`

This generates a standard jekyll folder structure (like the one mentioned earlier) under the specified directory, with basic templates and content that you can start with. Add your post as a markdown or textile content in the \_posts folder, push this into your Github user page repository and you are good to go!

Jekyll also comes with a built-in server that helps you preview your web-site locally. You can preview your jekyll website at `localhost:4000` by running the command `jekyll serve`.

**PRO TIP**: You can pass an additional argument to the jekyll serve command to make jekyll watch for changes and serve them automatically - `jekyll serve --watch`

You can build your jekyll site locally using the command - `jekyll build`. This generates the site in the \_site folder.

**PRO TIP**: You can maintain a \_drafts folder at the root level for all your blogs which are work-in-progress. Jekyll ignores the posts in the drafts folder when building the site, but at the same time provides a convenient command line argument to include them in the build on your local system - `jekyll serve --drafts`

Now you have a jekyll based blog where you can add your posts as markdown, a local environment to build and preview your web-site, and free hosting space in Github Pages!

###Jazzing up your blog:

In my [next post]({% post_url 2014-08-24-set-up-blog-jekyll-github-pages-2 %}), I'll talk about how you can jazz-up your blog with comments, sharing options, etc.
