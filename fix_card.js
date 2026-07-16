var f=require('fs');
var c=f.readFileSync('./components/KeyboardCard.js','utf-8');
// Remove hasLinks variable declaration
c=c.replace('\n  const hasLinks = kb.icLink || kb.gbLink','');
// Remove the entire links section (from hasLinks && div to closing /div)
c=c.replace('\n  {hasLinks && <div style={{marginTop:8,display:\"flex\",gap:8,fontSize:11}}>\n          {kb.icLink && <a href={kb.icLink} target=\"_blank\" rel=\"noopener\" style={{color:\"var(--text-secondary)\",textDecoration:\"underline\",textUnderlineOffset:2}} onClick={e=>e.stopPropagation()}>IC</a>}\n          {kb.gbLink && <a href={kb.gbLink} target=\"_blank\" rel=\"noopener\" style={{color:\"var(--text-secondary)\",textDecoration:\"underline\",textUnderlineOffset:2}} onClick={e=>e.stopPropagation()}>GB</a>}\n        </div>}','');
f.writeFileSync('./components/KeyboardCard.js',c,'utf-8');
console.log('done');
