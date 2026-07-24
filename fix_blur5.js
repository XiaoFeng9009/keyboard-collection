var f=require('fs');

// BlurOverlay - faster initial blur with custom easing, stronger blur
var c=f.readFileSync('./components/BlurOverlay.js','utf-8');
c=c.replace("'opacity .6s ease'", "'opacity .8s cubic-bezier(0.0,0.6,0.3,1.0)'");
c=c.replace('blur(12px)', 'blur(15px)');
c=c.replace('setTimeout(function() { setPhase(' + "'" + 'hidden' + "'" + ') }, 600)', 'setTimeout(function() { setPhase(' + "'" + 'hidden' + "'" + ') }, 800)');
f.writeFileSync('./components/BlurOverlay.js',c,'utf8');

// index.js - separate timings: blur -> data in background -> unblur -> navigate
c=f.readFileSync('./pages/index.js','utf-8');
var q=String.fromCharCode(39);
var oldFunc='setShowBlur(true)\n    setTimeout(function() {\n      setPage(1)\n      setFiltered(sortedKeyboards)\n      setResetKey(function(k){return k+1})\n      setShowBlur(false)\n      setTimeout(function() {\n        router.push('+q+'/'+q+')\n      }, 600)\n    }, 800)';
var newFunc='setShowBlur(true)\n    setTimeout(function() {\n      setPage(1)\n      setFiltered(sortedKeyboards)\n      setResetKey(function(k){return k+1})\n    }, 200)\n    setTimeout(function() {\n      setShowBlur(false)\n    }, 1000)\n    setTimeout(function() {\n      router.push('+q+'/'+q+')\n    }, 1800)';
c=c.replace(oldFunc, newFunc);
f.writeFileSync('./pages/index.js',c,'utf8');

console.log('done');
