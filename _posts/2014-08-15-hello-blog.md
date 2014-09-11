---
layout: post
title:  "Hello Blog!"
date:   2014-08-15 08:07:00
categories: blogging
tags: blogging github-pages jekyll
comments: true
analytics: true
---

{% highlight js%}
function blog(thoughts) {
	return thoughts.toString();
}
{% endhighlight %}

Having decided to blog, and contribute to some more garbage on the internet, I went looking out for a really quick way to set up shop.<br>

My criteria:

* Minimal
* Responsive
* Quick set-up
* Hassle-free templating
* Sufficient control over layouting
* Quick and easy publishing and hosting  
* More focus on content, less on styling
* Write content like code

There were some obvious 'go to' blog sites like [Wordpress][wordpress] and [Blogger][blogger]. But I wanted to keep away from those, as I knew they didn't meet some of my criteria.

I was curious about some of the new blogging platforms like [Ghost][ghost], [Medium][medium], [Svtle][svtle], etc. They looked nice, simple and had a clear focus on content. Their USP, compared to the traditional blogging platforms, was content discovery. But somehow they looked more like magazine articles to me, than blogs - which can be good or bad, depending on one's perspective. Anyway, I started comparing these new platforms to analyze the pros/cons, when I accidently bumped into a few bloggers talking about moving their blogs to '[Github Pages][github-pages]' and why they did so.

I was aware of Github pages for projects, but never really thought of it as a blogging platform. A bit of googling got me introduced to [Jekyll][jekyll] and the built-in support in Github Pages. In a matter of minutes, most of my criteria was being checked off. And even before I realized, I was heads down into it. It felt a lot like coding. And in no time, I was ~~writing~~ marking down my first blog.

Jekyll is essentially a parser + generator bundled as a ruby gem, and is the engine behind Github Pages. It parses content (markdown/textile), liquifies it with templates and spits out a static website ready to be served - in my case, graciously, by Github! Thanks to the in-built support, one needs to maintain just the templates and content, and Github takes care of generating the static website. For me, the icing on the cake was the following:

* Freedom to write content in my favorite text editor
* Write content offline and publish anytime
* Preview my blog locally (offline) before publishing
* Publish blogs with a mere git push

A simple, version controlled, static site generator with markdown and templating was probably close to what I had in my mind (subconciously) an hour ago when I stared looking for a blogging platform. Yes, all this happened in 60 minutes! For a change, I was happy about not being a victim of analysis-paralysis.

There are some more aspects like SEO, administration, plugin support, theming etc. that I haven't analyzed as yet. But I'm already feeling positive about Github Pages + Jekyll combination. And since this has taken me only few minutes to go from zilch to live, I have no complaints!

Over the next few days, I will be experimenting with this platform and in the process, blogging about it. So I don't have to break my head over topics to blog about - a win-win! (And a big relief! Phew!)


[jekyll]: http://jekyllrb.com
[ghost]: https://ghost.org/
[medium]: https://medium.com/
[svtle]: https://svbtle.com/
[wordpress]: https://wordpress.com/
[blogger]: https://www.blogger.com/
[github-pages]: https://pages.github.com/
