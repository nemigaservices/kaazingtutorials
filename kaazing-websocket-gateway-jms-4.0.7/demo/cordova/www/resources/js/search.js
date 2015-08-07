/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

// function expandAll() {
// 	$(window).keydown(function(e) {
// 		var ck = e.keyCode ? e.keyCode : e.which;
// 		if ((e.metaKey && ck == 70) || (e.ctrlKey && ck == 70)) {
// 			$('summary').trigger('click');
// 			window.find();
// 		}
// 	});
// }                                      

function expandCollapse() {
      $('summary').trigger('click');
}

// Google Site Search code

// (function() {
//   var cx = '016246780166740445154:0gomnx8rax8';
//   var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
//   gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
//       '//www.google.com/cse/cse.js?cx=' + cx;
//   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
// })();

(function() {
  var cx = '012595198655877718859:0gomnx8rax8';
  var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
  gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
      '//www.google.com/cse/cse.js?cx=' + cx;
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
})();