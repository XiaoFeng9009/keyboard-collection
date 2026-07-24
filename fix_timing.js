var f=require('fs');
var q=String.fromCharCode(39);

// BlurOverlay - faster transitions
var c=f.readFileSync('./components/BlurOverlay.js','utf-8');
c=c.replace('opacity .8s cubic-bezier(0.0,0.6,0.3,1.0)', 'opacity .4s cubic-bezier(0.0,0.6,0.3,1.0)');
c=c.replace('setTimeout(function() { setPhase('+q+'hidden'+q+') }, 800)', 'setTimeout(function() { setPhase('+q+'hidden'+q+') }, 400)');
f.writeFileSync('./components/BlurOverlay.js',c,'utf8');

// handleGoHome - ~1000ms total
c=f.readFileSync('./pages/index.js','utf-8');
var old='setShowBlur(true)\n    setTimeout(function() {\n      setPage(1)\n      setFiltered(sortedKeyboards)\n      setResetKey(function(k){return k+1})\n    }, 200)\n    setTimeout(function() {\n      setShowBlur(false)\n    }, 1000)\n    setTimeout(function() {\n      router.push('+q+'/'+q+')\n    }, 1800)';
var neu='setShowBlur(true)\n    setTimeout(function() {\n      setPage(1)\n      setFiltered(sortedKeyboards)\n      setResetKey(function(k){return k+1})\n    }, 100)\n    setTimeout(function() {\n      setShowBlur(false)\n    }, 550)\n    setTimeout(function() {\n      router.push('+q+'/'+q+')\n    }, 1000)';
c=c.replace(old, neu);
f.writeFileSync('./pages/index.js',c,'utf8');

console.log('done');
