This plugin adds a `title` attribute to the footnote links, mainly for accessibility purpose.


```diff
 <div class="footnotes">
   <hr>
   <ol>
     <li id="fn-1">
       <p>Some clever joke</p>
-       <a href="#fnref-1" class="footnote-backref">↩</a>
+       <a href="#fnref-1" class="footnote-backref" title="Jump to reference">↩</a>
     </li>
   </ol>
 </div>
```

Usage:

* `.use(footnotesTitles, 'Jump to reference')`
* `.use(footnotesTitles, 'Going back to footnote with id $id')`
* If `$id` is found in the string, it gets replaced with the footnote id.
