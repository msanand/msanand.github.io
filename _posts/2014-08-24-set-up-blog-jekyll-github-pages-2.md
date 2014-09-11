---
layout: post
title:  "How to set up a blog with Jekyll and Github Pages - Part 2"
date:   2014-08-24 05:37:00
categories: blogging
tags: blogging github-pages jekyll
comments: true
analytics: true
---

Continuing from where I left off in my [previous post]({% post_url 2014-08-17-set-up-blog-jekyll-github-pages %}), here's how you can jazz-up your Jekyll blog:

###Bootstrap

The standard Jekyll scaffolding is just one way to bootstrap your jekyll blog. Some might fing it basic, and would expect a little more to be available out-of-the-box. Fortunately, there are a few other ways in which you could bootstrap a more functional blog.<br>

* [Octopress](http://octopress.org/)
* [Jekyll Bootstrap](http://jekyllbootstrap.com/)
* [Poole](https://github.com/poole/poole)

Octopress and Jekyll Bootstrap are frameworks on top of Jekyll to help you quickly get started with blogging and publish. Apart from scaffolding a initial structure for you with some additional functionality like comments, it gives you some useful rake commands to quickly create posts and pages.

Poole is a little less intrusive. It calls itself a 'butler for Jekyll', providing a responsive theme, related posts section, etc. on top of standard Jekyll scaffolding and comes with a couple of minimalistic theming options. It doesn't come with a rakefile and also doesn't provide as much functionality out-of-the-box as the previous two. But I think it gives the right amount of freedom for customization.

###Theming
The standard styles that jekyll scaffolds when you do a `jekyll new` is fairly simple - good enough, but basic. But worry not, you have full freedom to go ahead and style it the way you want. Dig into the main.css file and play around. Or if you are in a hurry, you can use one of the many bootstraps that come along with predefined themes.

Jekyll Bootstrap and Octopress come with a default theme. Poole provides a couple of minimalistic options in [Lanyon](https://github.com/poole/lanyon) and [Hyde](https://github.com/poole/hyde).

If you want more, check out:

* [http://jekyllthemes.org/](http://jekyllthemes.org/)
* [https://www.jekyllthemes.net/](https://www.jekyllthemes.net/)

###Socialize your blog

#####Disqus Comments

Jekyll Bootstrap and Octopress come pre-built with Disqus comments that can be enabled through the YAML configuration. But if you use Poole, like I do, then you'll need to do this yourself. Here's how:


Create an html file under the '\_includes' folder and add the following content: (Make sure you add your disqus shortname in the snippet below)

{% highlight html%}

{% if page.comments %}
<!-- Add Disqus comments. -->
<div id="disqus_thread"></div>
<script type="text/javascript">
  /* * * ADD YOUR DISQUS SHORTNAME HERE * * */
  var disqus_shortname = '<your_disqus_shortname>';

  (function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
</script>
<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
<a href="http://disqus.com" class="dsq-brlink">comments powered by  <span class="logo-disqus">Disqus</span></a>
{% endif %}

{% endhighlight %}

Modify the '\_layouts/default.html' file and include the following line:

{% raw %}
`{% include comments.html %}`
{% endraw %}

Now you can enable comments in your post by setting 'comments:true' in the post YAML front matter.

#####Sharing

Almost all social network sites provide options to embed their sharing button on other website. All you need to do is to get that code snippet, create a partial HTML like we did earlier for Disqus, and inject that anywhere you like using the liquid templating syntax.

Let's take twitter as an example. Create a partial HTML called 'twitter.html' in the '_includes' directory, and insert the following snippet: (Make sure you add your twitter handle in snippet below)

{% highlight HTML%}

<a href="https://twitter.com/share" class="twitter-share-button" data-via="<your_twitter_handle>">Tweet</a>

<!-- Put this just before the closing body tag -->
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

{% endhighlight %}

Now you can insert this snippet anywhere you want to by adding the following lines:

{% raw %}
`{% include twitter.html %}`
{% endraw %}

You can do this for other social networking sites like facebook, linkedIn, etc.

There are also providers like [Add This](http://www.addthis.com/), providing a single consolidated social sharing option.

### Custom Domain

Now that you have a rounded up blog, its time to set-up your custom domain with Github Pages.

* Create a CNAME file containing your custom domain at the root of your git repository
* Configure a CNAME record with your DNS provider pointing to your Github user page (username.github.io)
* If your custom domain is an apex domain, then also configure an A Record that resolves to the following IP Addresses
    * 192.30.252.153
    * 192.30.252.154

With that, you should have a shiny new blog of your own!

That ends my rant on 'Jekyll'. I promise not to utter that word again! Its time to move one... find a new topic...
