# Lazyload-liveblog-entries #
**Contributors:** goldenapples    
**Tags:** liveblog  
**Requires at least:** 3.5  
**Tested up to:** 4.2  
**Stable tag:** 4.3  
**License:** GPLv2 or later  
**License URI:** http://www.gnu.org/licenses/gpl-2.0.html  

Improves the pagespeed and load time of large liveblogs by lazy-loading entries.

## Description ##

When using the [liveblog](https://wordpress.org/plugins/liveblog/) plugin
developed by Automattic, liveblogs with lots of entries, especially if
they take advantage of the oEmbed functionality to render content from
third-party providers liek Twitter or Vine, can take an inordinate amout
of time to load. This issue stems from embed handlers from these providers
scanning the entire markup of the document, and replacing numerous divs of
markup in the content at once, making the page unresponsive as the DOM
thrashes through dozens of replacements.

This plugin addresses this by loading a relatively small number of entries
initially, then attaching the rest in batches until all entries are
rendered. In this way, "above the fold" content is rendered and
interactive quickly, and additional content is rendered and replaced once
all visible content is loaded and ready.

## Installation ##

1. Upload the plugin folder to your plugins directory and activate it.  
2. That's it!

## Changelog ##

### 0.1 Initial release

###