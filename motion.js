/* Motion: scroll reveals, number count-ups, and arrow nudges. Loaded at the end of <body> on every page. */
(function(){
  // Wrap trailing/leading arrows in links so hover can nudge them
  document.querySelectorAll('.go, .back, .next a.title, .press .when').forEach(function(a){
    a.innerHTML=a.innerHTML.replace(/(\s*)(→|←|↗)/,'$1<span class="arr" aria-hidden="true">$2</span>');
  });

  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(still||!('IntersectionObserver' in window))return;

  // Reveal targets: each row's label and content, plus stat cells. In the work grid, each card reveals on its own.
  var targets=[];
  document.querySelectorAll('.row').forEach(function(row){
    Array.prototype.forEach.call(row.children,function(ch){
      var grid=ch.querySelector(':scope > .cards');
      if(grid)Array.prototype.forEach.call(ch.children,function(g){
        if(g===grid)targets.push.apply(targets,grid.children);else targets.push(g);
      });
      else targets.push(ch);
    });
  });
  document.querySelectorAll('.proof > div, .stats > div, .band-line, .next').forEach(function(el){targets.push(el)});

  var fold=window.innerHeight;
  var rv=new IntersectionObserver(function(entries){
    var hits=entries.filter(function(e){return e.isIntersecting});
    hits.sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left});
    hits.forEach(function(e,i){
      var el=e.target;
      el.style.transitionDelay=Math.min(i,5)*70+'ms';
      el.classList.add('in');
      rv.unobserve(el);
      setTimeout(function(){el.style.transitionDelay=''},900+i*70);
    });
  },{rootMargin:'0px 0px -8% 0px'});
  targets.forEach(function(el){
    if(el.getBoundingClientRect().top<fold)return; // already on screen: leave it alone
    el.classList.add('rv');
    rv.observe(el);
  });
  // Filtering re-shows hidden cards; the filter has its own animation, so skip the reveal
  document.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click',function(){document.querySelectorAll('.card.rv').forEach(function(c){c.classList.add('in');rv.unobserve(c)})});
  });

  // Count-ups. "A → B" counts from A to B; a single number of 10+ (or with decimals) counts from 0; anything else stays put.
  var NUM=/\d[\d,]*(?:\.\d+)?/g;
  function parse(s){return parseFloat(s.replace(/,/g,''))}
  function fmt(v,like){
    var dec=(like.split('.')[1]||'').length,s=v.toFixed(dec);
    if(like.indexOf(',')>-1){var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');s=p.join('.')}
    return s;
  }
  function plan(el){
    var t=el.textContent,m=t.match(NUM);
    if(!m)return null;
    var arrow=t.match(/^(.*?\d[\d,.]*\s*→\s*)(\d[\d,.]*)(.*)$/);
    if(arrow)return {pre:arrow[1],to:arrow[2],post:arrow[3],from:parse(m[0])};
    if(m.length!==1)return null;
    var v=parse(m[0]);
    if(v<10&&m[0].indexOf('.')<0)return null;
    var i=t.indexOf(m[0]);
    return {pre:t.slice(0,i),to:m[0],post:t.slice(i+m[0].length),from:0};
  }
  // Prime each number at its start value right away (no flash of the final value), then count when it scrolls in
  function prime(el){
    var p=plan(el);if(!p)return null;
    var final=el.textContent,live=document.createElement('span'),sr=document.createElement('span');
    live.setAttribute('aria-hidden','true');live.textContent=p.pre+fmt(p.from,p.to)+p.post;
    sr.className='sr';sr.textContent=final;
    el.textContent='';el.appendChild(live);el.appendChild(sr);
    return function(){
      var end=parse(p.to),dur=1300,t0;
      function frame(now){
        if(!t0)t0=now;
        var k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,4);
        live.textContent=p.pre+fmt(p.from+(end-p.from)*e,p.to)+p.post;
        if(k<1)requestAnimationFrame(frame);else el.textContent=final;
      }
      requestAnimationFrame(frame);
    };
  }
  var runs=new Map();
  var nums=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){nums.unobserve(e.target);setTimeout(runs.get(e.target),150)}});
  },{threshold:.6});
  document.querySelectorAll('.num, .vis.fig .big').forEach(function(el){var go=prime(el);if(go){runs.set(el,go);nums.observe(el)}});
})();
