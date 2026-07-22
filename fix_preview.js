var f=require('fs');
var c=f.readFileSync('./components/KeyboardDetail.js','utf-8');
c=c.replace('maxWidth:80%,maxHeight:80%', 'maxWidth:95%,maxHeight:95%');
f.writeFileSync('./components/KeyboardDetail.js',c,'utf8');
c=f.readFileSync('./components/StudioDetail.js','utf-8');
c=c.replace('maxWidth:80%,maxHeight:80%', 'maxWidth:95%,maxHeight:95%');
f.writeFileSync('./components/StudioDetail.js',c,'utf8');
console.log('done');
