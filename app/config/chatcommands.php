<?php 

/*
|--------------------------------------------------------------------------
| Chat Commands Deinitions
|--------------------------------------------------------------------------
| 
| Define chat /cmd shortcodes here.  The key is the /command shortcode
| and the value is the HTML to replace it with.  The %s is where the 
| original chat message will be placed
| 
*/

return array(
	'/code' => '<pre><code>%s</code></pre>',
	'/quote' => '<blockquote>%s</blockquote>',
	'/h1' => '<h1>%s</h1>',
	'/h2' => '<h2>%s</h2>',
	'/h3' => '<h3>%s</h3>',
	'/h4' => '<h4>%s</h4>',
	'/b' => '<strong>%s</strong>',
	'/i' => '<em>%s</em>',
);