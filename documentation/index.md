---
layout: documentation
title: Documentation
---
##What is Curio?
Curio is a simple AJAX content loader built on pure javascript (no jquery).
It supports only modern browser (i.e. above IE9). With its limited supported
probably I would not recommend using this in production version.

##Getting started with Curio

Curio can be included on your page with sample include tag or may be used
along with AMD loader.

{%  highlight html %}
<!-- add this tag to your page -->
<script type="text/javascript" src="path/to/curio.js"></script>
{% endhighlight %}

Sample HTML setup.

{%  highlight html %}
<div id="content"></div>

<ul id="content-nav">
    <li><a href="actual/path1" data-href="path/to/ajax1">Link 1</a></li>
    <li><a href="actual/path2" data-href="path/to/ajax2">Link 2</a></li>
    <li><a href="actual/path3" data-href="path/to/ajax3">Link 3</a></li>
</ul>
{% endhighlight %}

Intialize curio object.

{%  highlight js %}
curio('#content-nav', {

    elContent: '#content'

});
{% endhighlight %}

###Options

Curio accepts following options. Options are passed to the editor on
initialisation.

`elContent`  
Specify where data received from html is rendered.
{%  highlight js %}
{
    elContent: '#content'
}
{% endhighlight %}


`elLoader`  
Specify which element to show while AJAX request is active.  
If this element is not specified a `loading` class will be added to `elContent` element.
{%  highlight js %}
{
    elLoader: '#loader'
}
{% endhighlight %}

`doCache`  
Specify to enable caching of AJAX request.
{%  highlight js %}
{
    doCache: true
}
{% endhighlight %}

`history`  
Specify this option to enable using History API.
{%  highlight js %}
{
    history: true
}
{% endhighlight %}

###Hooks

`beforeFetch`  
Called before making AJAX request.
{%  highlight js %}
{
    beforeFetch: function () {
        // some animation before initiating AJAX request.
    }
}
{% endhighlight %}

`onRender`  
Called immediately when content is rendered.
{%  highlight js %}
{
    onRender: function () {
        // some animation post rendering
    }
}
{% endhighlight %}

##Future
Again this isn't yet complete. So please wait before you use this in
production.
