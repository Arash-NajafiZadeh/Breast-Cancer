(function(){
  var sections = window.APP_SECTIONS || [];
  var mainOrder = [1,30,3,2,7,5,6,4,0,8,9];
  var cards = document.getElementById('sectionCards') || document.getElementById('steps');
  var steps = document.getElementById('steps');
  var reader = document.getElementById('reader');
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  var backTop = document.getElementById('backTop');
  var currentIndex = -1;

  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];});}
  function cleanTitle(text){return String(text||'').replace(/^گزینه\s*زیر\s*مجموعه[:：]?\s*/,'').replace(/^زیرمجموعه[:：]?\s*/,'').replace(/\s*\(گزینه اصلی\)\s*/,'').trim();}
  function isLikelyHeading(text,index){if(index===0||text.length>88||/[.!؟،:]$/.test(text)){return false;}return true;}
  function isLowPriority(text){return /اپیدمیولوژیک|آمار|سال ۲۰۲۲|۱۵۷ کشور|۱۸۵ کشور|۱۰۰ هزار|در ایالات متحده|در ایران نیز/.test(text);}
  function iconForTitle(title){
    if(/توده|ضخیم/.test(title)){return '🔎';} if(/اندازه|شکل|ظاهر|تقارن/.test(title)){return '🧍‍♀️';} if(/نوک/.test(title)){return '📍';}
    if(/پوست|رنگ|زخم|خارش|فرورفتگی|برآمدگی/.test(title)){return '🌸';} if(/درد|ناراحتی/.test(title)){return '⚡';} if(/زیر بغل|ترقوه/.test(title)){return '🫱';}
    if(/آماده|زمان|مکان/.test(title)){return '🗓️';} if(/آینه|مشاهده/.test(title)){return '🪞';} if(/لمس|دایره|فشار/.test(title)){return '🖐️';}
    if(/خوابیده|درازکش/.test(title)){return '🛏️';} if(/ایستاده|نشسته|دست/.test(title)){return '🙆‍♀️';} if(/غیرعادی|مراجعه/.test(title)){return '🏥';} return '💗';
  }
  function assetPicture(name,label){
    return '<img src="assets/images/'+name+'.svg" alt="'+escapeHtml(label)+'" loading="lazy" data-fallback="svg" onload="this.closest(\'.image-slot\').classList.add(\'has-image\')" onerror="if(this.dataset.fallback===\'svg\'){this.dataset.fallback=\'png\';this.src=\'assets/images/'+name+'.png\'}else if(this.dataset.fallback===\'png\'){this.dataset.fallback=\'jpg\';this.src=\'assets/images/'+name+'.jpg\'}else{this.closest(\'.image-slot\').classList.remove(\'has-image\');this.style.display=\'none\'}">';
  }
  function imageBox(label,name){return '<div class="image-slot" data-image="'+escapeHtml(name||'')+'">'+(name?assetPicture(name,label):'<div class="image-icon">🖼️</div>')+'<strong>'+escapeHtml(label)+'</strong><span class="image-help">نام فایل: '+escapeHtml(name||'بدون نام')+'.svg / .png / .jpg</span></div>';}
  function toPersianDigits(value){return String(value).replace(/[0-9]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d];});}
  function persianizeText(root){var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);var nodes=[];while(walker.nextNode()){nodes.push(walker.currentNode);}for(var i=0;i<nodes.length;i++){nodes[i].nodeValue=toPersianDigits(nodes[i].nodeValue);}}
  function detailButton(title,icon,body,imageName,imageLabel){return '<button class="detail-tile" type="button" data-detail-title="'+escapeHtml(title)+'" data-detail-body="'+escapeHtml(body)+'" data-detail-image="'+escapeHtml(imageName||'')+'" data-detail-label="'+escapeHtml(imageLabel||title)+'"><span>'+icon+'</span><strong>'+escapeHtml(title)+'</strong></button>';}

  function groupedByRawLabels(paragraphs){
    var groups=[],current=null;
    for(var i=0;i<paragraphs.length;i++){
      var p=paragraphs[i];
      if(/^گزینه\s*زیر\s*مجموعه[:：]?/.test(p)||/^زیرمجموعه[:：]?/.test(p)||/^[۰-۹0-9]+[.)،]\s+/.test(p)||/^(زمان مناسب|مکان|نکات قابل توجه|حالت‌های بررسی|علائم غیرعادی|نکات کلیدی خودآزمایی)[:：]?/.test(p)){
        current={title:cleanTitle(p),items:[]}; groups.push(current);
      }else if(current){current.items.push(p);}else{groups.push({title:cleanTitle(p),items:[]});}
    }
    return groups;
  }
  function renderSymptomsArticle(){
    var groups=groupedByRawLabels(sections[1].paragraphs);
    var imageLabels=['عکس توده یا ضخیم‌شدگی','عکس تغییر شکل و اندازه','۳ عکس: فرورفتگی، حساسیت، ترشح نوک پستان','عکس تغییرات پوست، فرورفتگی و زخم','عکس یا آیکون درد مداوم','عکس محل زیر بغل و ترقوه'];
    var imageNames=['symptom-lump','symptom-size-shape','symptom-nipple','symptom-skin','symptom-pain','symptom-armpit'];
    var body='<p class="reader-lead strong-lead">علائم و نشانه‌ها ۶ بخش اصلی دارد. برای هر علامت مهم، جای عکس جداگانه گذاشته شده تا آموزش با یک نگاه قابل فهم باشد.</p><div class="symptom-grid pro-grid">';
    for(var i=0;i<groups.length;i++){
      var g=groups[i]; if(!g.title){continue;}
      body+='<section class="symptom-card media-card"><div class="media-body"><h3><span>'+iconForTitle(g.title)+'</span>'+escapeHtml(g.title)+'</h3><ul>';
      for(var j=0;j<g.items.length;j++){body+='<li>'+escapeHtml(cleanTitle(g.items[j]))+'</li>';}
      body+='</ul></div>'+imageBox(imageLabels[i]||'عکس علامت',imageNames[i]||'symptom')+'</section>';
    }
    body+='</div>'; return body;
  }
  function renderSelfExamArticle(){
    var items=[
      {t:'زمان مناسب',icon:'🗓️',kind:'info',lines:['در زمان قاعدگی: چند روز پس از پایان قاعدگی (هفته اول چرخه).','در زنان یائسه: انتخاب یک روز ثابت در ماه (مانند اول هر ماه).']},
      {t:'مکان مناسب',icon:'🚿',kind:'info',lines:['محلی خلوت با آینه بزرگ.','انجام آن در حمام با پوست مرطوب لمس را آسان‌تر می‌کند.']},
      {t:'مشاهده در آینه',icon:'🪞',img:'عکس ایستادن روبه‌روی آینه',file:'self-mirror',lines:['دست‌ها کنار بدن.','دست‌ها روی کمر با فشار شانه‌ها به عقب.','دست‌ها بالا یا پشت سر.']},
      {t:'به چه چیزهایی دقت کنیم؟',icon:'👁️',img:'عکس شکل، اندازه، فرورفتگی و برآمدگی',file:'self-look-changes',lines:['تقارن شکل و اندازه پستان‌ها.','وجود فرورفتگی، برآمدگی، چین‌خوردگی، قرمزی یا تغییر رنگ پوست.','تغییرات نوک پستان مانند فرورفتگی، ترشح خونی یا غیرعادی.']},
      {t:'لمس چرخشی یا شعاعی',icon:'🌀',img:'عکس حرکت دایره‌ای یا شعاعی با سه انگشت',file:'self-circular-touch',lines:['پستان را مانند صفحه ساعت در نظر بگیرید.','با نوک سه انگشت میانی به صورت دایره‌ای یا شعاعی حرکت کنید.','از نوک پستان به سمت بیرون پیش بروید.']},
      {t:'لمس زیر بغل و اطراف پستان',icon:'🫱',img:'عکس بررسی زیر بغل',file:'self-armpit',lines:['نواحی زیر بغل و اطراف پستان را بررسی کنید.','با فشارهای کم، متوسط و زیاد بافت را لمس نمایید.']},
      {t:'فشار ملایم نوک پستان',icon:'📍',img:'عکس فشار ملایم نوک پستان',file:'self-nipple-pressure',lines:['نوک پستان را با فشار ملایم بررسی کنید.','هدف، توجه به ترشح احتمالی است.']},
      {t:'حالت ایستاده یا نشسته',icon:'🙆‍♀️',img:'عکس بررسی در حالت ایستاده با یک دست بالا',file:'self-standing-arm-up',lines:['در حالت ایستاده یا نشسته بررسی انجام شود.','بالا بردن یک دست می‌تواند لمس بعضی نواحی را آسان‌تر کند.']},
      {t:'حالت درازکش',icon:'🛏️',img:'عکس حالت خوابیده با بالش زیر شانه',file:'self-lying-pillow',lines:['درازکش با قرار دادن بالش زیر شانه.','این حالت برای لمس دقیق‌تر برخی نواحی کمک‌کننده است.']},
      {t:'اگر چیز غیرعادی دیدید',icon:'🏥',kind:'info',lines:['توده یا گره سفت.','نواحی سفت یا ناهموار.','درد مداوم یا ترشح غیرعادی.','در صورت مشاهده هرگونه تغییر غیرعادی، سریعاً به پزشک مراجعه شود.']}
    ];
    var body='<p class="reader-lead strong-lead">در این بخش فقط جاهایی که واقعاً برای یادگیری نیاز به تصویر دارند جای عکس دارند؛ زمان و مکان با المان ساده نمایش داده شده‌اند.</p><div class="self-flow pro-flow">';
    for(var i=0;i<items.length;i++){
      var it=items[i]; body+='<section class="flow-card '+(it.kind==='info'?'info-only':'media-card')+'"><div class="media-body"><h3><span>'+it.icon+'</span>'+escapeHtml(it.t)+'</h3><ul>';
      for(var j=0;j<it.lines.length;j++){body+='<li>'+escapeHtml(it.lines[j])+'</li>';}
      body+='</ul></div>'+(it.img?imageBox(it.img,it.file):'<div class="ui-ornament">'+it.icon+'</div>')+'</section>';
    }
    body+='</div>'; return body;
  }
  function renderScreeningArticle(){
    var p=sections[3].paragraphs;
    var clinical=[
      ['معاینه بالینی پستان','👩‍⚕️',p[47]],['ماموگرافی','🩻',p[48]],['سونوگرافی','〰️',p[49]],['MRI','🧲',p[50]],['نمونه‌برداری','🔬',p[51]]
    ];
    var buttons=''; clinical.forEach(function(item){buttons+=detailButton(item[0],item[1],item[2],'',item[0]);});
    return '<p class="reader-lead">'+escapeHtml(p[0])+'</p><div class="spotlight-grid"><section class="spotlight-card"><h3>✨ چرا غربالگری مهم است؟</h3><div class="mini-icon-grid">'+detailButton('تشخیص زودهنگام','🔎',p[3])+detailButton('آرامش خاطر','💗',p[4])+detailButton('کاهش عوارض','🛡️',p[5])+detailButton('تشخیص نوع ضایعه','⚕️',p[6])+detailButton('مسئولیت نسبت به بدن','🌷',p[7])+'</div></section><section class="spotlight-card hot"><h3>👩‍⚕️ آیا برای همه لازم است؟</h3><p>'+escapeHtml(p[9])+'</p><button class="primary-btn" type="button" data-self-exam="true">رفتن به آموزش خودآزمایی پستان</button></section></div><div class="method-list"><h3>روش‌های غربالگری و تشخیص</h3><p>'+escapeHtml(p[11])+'</p><div class="mini-icon-grid">'+buttons+'</div></div>';
  }
  function splitFact(text){var parts=text.split('واقعیت:');return {myth:(parts[0]||'').trim(),fact:(parts.slice(1).join('واقعیت:')||'').trim()};}
  function renderMythsArticle(){
    var body='<p class="reader-lead strong-lead">هر گروه را جدا ببینید؛ روی هر باور بزنید تا واقعیت همان مورد باز شود.</p><div class="myth-sections">';
    var currentTitle='',currentButtons='';
    function flush(){if(currentTitle){body+='<section class="myth-section"><h3>'+escapeHtml(currentTitle)+'</h3><div class="mini-icon-grid">'+currentButtons+'</div></section>';}}
    sections[7].paragraphs.forEach(function(p){
      if(!/واقعیت:/.test(p)){flush(); currentTitle=cleanTitle(p); currentButtons=''; return;}
      var pair=splitFact(p);
      currentButtons+=detailButton(pair.myth.replace(/^[۰-۹0-9]+\.\s*/,''),'✕','<div class="myth-pop"><div class="wrong"><span>✕</span><strong>باور نادرست</strong><p>'+escapeHtml(pair.myth)+'</p></div><div class="right"><span>✓</span><strong>واقعیت</strong><p>'+escapeHtml(pair.fact)+'</p></div></div>','',pair.myth);
    });
    flush();
    return body+'</div>';
  }
  function renderRisksArticle(){
    var body='<p class="reader-lead strong-lead">برای جلوگیری از متن طولانی، هر عامل به صورت کارت بازشونده نمایش داده شده است.</p><div class="risk-board"><section class="risk-column danger"><h3>موارد افزایش خطر</h3><div class="mini-icon-grid">';
    var reducing=false;
    sections[2].paragraphs.forEach(function(p){
      var text=cleanTitle(p).replace(/^✅\s*/,''); if(!text){return;}
      if(/عوامل کاهش خطر/.test(text)){reducing=true; body+='</div></section><section class="risk-column safe"><h3>موارد کاهش خطر</h3><div class="mini-icon-grid">'; return;}
      if(/عوامل افزایش خطر|عوامل خطر|قابل تغییر/.test(text)){return;}
      var parts=text.split(':'); var title=(parts[0]||text).trim(); var desc=(parts.slice(1).join(':')||text).trim();
      body+=detailButton(title,reducing?'✓':'!',desc,'',title);
    });
    return body+'</div></section></div>';
  }
  function renderCelebritiesArticle(){
    var people=[]; var current={name:cleanTitle(sections[9].title),lines:[]};
    sections[9].paragraphs.forEach(function(p){if(/^[۰-۹0-9]+\./.test(p)){people.push(current);current={name:cleanTitle(p),lines:[]};}else{current.lines.push(p);}}); people.push(current);
    var body='<p class="reader-lead strong-lead">از صحنه تا نبرد؛ روایت‌هایی برای امید، آگاهی و تشخیص به‌موقع.</p><div class="people-grid">';
    people.forEach(function(person,index){var code='celebrity-'+String(index+1).padStart(2,'0');body+='<article class="person-card">'+imageBox('عکس '+person.name,code)+'<div><h3>'+escapeHtml(person.name)+'</h3><p>'+escapeHtml(person.lines.join(' '))+'</p></div></article>';});
    return body+'</div>';
  }
  function compactInteractivePage(sectionIndex, lead, className, icons){
    var raw=sections[sectionIndex].paragraphs;
    var intro='';
    var items=[];
    for(var i=0;i<raw.length;i++){
      var text=cleanTitle(raw[i]); if(!text){continue;}
      if(i===0 && text.length>90){intro=text; continue;}
      if(isLikelyHeading(text,i) || /^[۰-۹0-9]+[.)،]/.test(text) || text.indexOf(':')>-1){items.push({title:text.split(':')[0].replace(/^[۰-۹0-9]+[.)،]\s*/,''), body:text});}
      else if(items.length){items[items.length-1].body+=' '+text;}
      else{items.push({title:text.slice(0,36), body:text});}
    }
    var body='<p class="reader-lead strong-lead">'+escapeHtml(lead)+'</p>'+(intro?'<div class="top-explain">'+escapeHtml(intro)+'</div>':'')+'<div class="'+className+' compact-cards">';
    for(var j=0;j<items.length;j++){var item=items[j];body+=detailButton(item.title,icons[j%icons.length],item.body,'',item.title);}
    return body+'</div>';
  }
  function renderActionAfterConcernArticle(){
    return compactInteractivePage(4,'اگر علامت یا شک وجود دارد، قدم‌ها را کوتاه، روشن و بدون ترس دنبال کنید.','action-grid',['🧘‍♀️','👩‍⚕️','🩺','📝','🤝','⏱️','🏥','💗']);
  }
  function renderAfterTreatmentArticle(){
    return compactInteractivePage(6,'پس از درمان، مراقبت منظم و توجه به کیفیت زندگی مهم است.','care-grid',['📅','💪','🥗','🧠','💗','🩺','🌿','🤝']);
  }
  function renderSupportArticle(){
    return '<div class="support-box"><div class="support-icon">🤝</div><h3>گروه‌های حمایتی</h3></div>';
  }
  function renderTreatmentsArticle(){
    var raw=sections[5].paragraphs;
    var intro=raw[0]||'';
    var icons=['🔪','☢️','💊','🧬','🎯','🛡️','🫶','⚕️'];
    var items=[];
    for(var i=1;i<raw.length;i++){
      var text=cleanTitle(raw[i]); if(!text){continue;}
      if(isLikelyHeading(text,i) || /^[۰-۹0-9]+[.)،]/.test(text)){items.push({title:text.replace(/^[۰-۹0-9]+[.)،]\s*/,''), body:''});}
      else if(items.length){items[items.length-1].body+=(items[items.length-1].body?' ':'')+text;}
      else{items.push({title:text.slice(0,36), body:text});}
    }
    var body='<div class="top-explain treatment-intro">'+escapeHtml(intro)+'</div><div class="mini-icon-grid treatment-grid">';
    for(var j=0;j<items.length;j++){var item=items[j];body+=detailButton(item.title,icons[j%icons.length],item.body||item.title,'',item.title);}
    return body+'</div>';
  }
  function cardHtml(s,index,number){return '<span class="card-icon">'+escapeHtml(s.icon)+'</span><span class="card-content"><span class="card-title">'+escapeHtml(index===9?'از صحنه تا نبرد':cleanTitle(s.title))+'</span><span class="card-subtitle">'+escapeHtml(s.subtitle)+'</span><span class="card-meta">'+number+' · '+s.paragraphs.length+' بند آموزشی</span></span>';}
  function renderLists(){
    steps.innerHTML='';
    for(var i=0;i<mainOrder.length;i++){
      var sectionIndex=mainOrder[i];
      var virtual=sectionIndex===30;
      var s=virtual?{title:'خودآزمایی پستان',subtitle:'آموزش کامل مرحله‌به‌مرحله',icon:'🤲',paragraphs:['']} : sections[sectionIndex];
      if(sectionIndex===8){s={title:'گروه‌های حمایتی',subtitle:'همراهی و حمایت',icon:'🤝',paragraphs:['']};}
      var item=document.createElement('button');
      item.type='button'; item.className='path-card';
      if(virtual){item.setAttribute('data-self-exam','true');}else{item.setAttribute('data-index',sectionIndex);}
      var title=sectionIndex===9?'از صحنه تا نبرد':(sectionIndex===8?'گروه‌های حمایتی':cleanTitle(s.title));
      item.innerHTML='<span class="path-icon">'+escapeHtml(s.icon||'💗')+'</span><span class="path-copy"><strong>'+escapeHtml(title)+'</strong><small>'+escapeHtml(s.subtitle)+'</small></span><span class="path-arrow">‹</span>';
      steps.appendChild(item);
    }
  }
  function renderDefaultArticle(index){
    var s=sections[index],body='',hiddenCount=0;
    for(var i=0;i<s.paragraphs.length;i++){var p=cleanTitle(s.paragraphs[i]); if(!p){continue;} var low=isLowPriority(p); if(low){hiddenCount++;} var heading=isLikelyHeading(p,i); body+='<section class="chunk info-chunk '+(low?'low-priority':(heading?'is-heading-only':''))+'">'+(heading?'<h3>':'<p>')+escapeHtml(p)+(heading?'</h3>':'</p>')+'</section>';}
    if(hiddenCount){body='<button type="button" class="stats-toggle" id="statsToggle">نمایش آمار و توضیحات تکمیلی</button>'+body;} return body;
  }
  function renderReader(index){
    if(index!==30&&(index<0||index>=sections.length)){return;} currentIndex=index;
    var s=index===30?{title:'خودآزمایی پستان',subtitle:'آموزش کامل و مرحله‌به‌مرحله'}:sections[index]; var body='',specialClass='';
    if(index===1){body=renderSymptomsArticle();specialClass=' symptoms-article';}
    else if(index===30){body=renderSelfExamArticle();specialClass=' self-exam-article';}
    else if(index===3){body=renderScreeningArticle();specialClass=' screening-article';}
    else if(index===2){body=renderRisksArticle();specialClass=' risks-article';}
    else if(index===7){body=renderMythsArticle();specialClass=' myths-article';}
    else if(index===4){body=renderActionAfterConcernArticle();specialClass=' action-article';}
    else if(index===5){body=renderTreatmentsArticle();specialClass=' treatments-article';}
    else if(index===6){body=renderAfterTreatmentArticle();specialClass=' care-article';}
    else if(index===8){body=renderSupportArticle();specialClass=' support-article';}
    else if(index===9){body=renderCelebritiesArticle();specialClass=' celebrities-article';}
    else{body=renderDefaultArticle(index);}
    var prevIndex=index===30?-1:(mainOrder.indexOf(index)>0?mainOrder[mainOrder.indexOf(index)-1]:-1); var nextIndex=index===30?1:(mainOrder.indexOf(index)>-1&&mainOrder.indexOf(index)<mainOrder.length-1?mainOrder[mainOrder.indexOf(index)+1]:-1);
    var title=index===30?'خودآزمایی پستان':(index===9?'از صحنه تا نبرد':(index===8?'گروه‌های حمایتی':cleanTitle(s.title))); var subtitle=index===30?'آموزش کامل و مرحله‌به‌مرحله':s.subtitle;
    reader.innerHTML='<div class="article'+specialClass+'"><header class="article-header"><h2>'+escapeHtml(title)+'</h2><p>'+escapeHtml(subtitle)+'</p></header><div class="article-tools"><button type="button" id="closeReader">بستن متن</button><a href="#guide">مسیر اصلی</a><a href="#focus">خودآزمایی</a><a href="#top">بالای صفحه</a></div><div class="article-body">'+body+'</div><div class="next-prev"><button type="button" class="secondary" id="prevSection" '+(prevIndex<0?'disabled':'')+'>بخش قبلی</button><button type="button" id="nextSection" '+(nextIndex<0?'disabled':'')+'>بخش بعدی</button></div></div>';
    reader.setAttribute('data-prev',prevIndex); reader.setAttribute('data-next',nextIndex); persianizeText(reader); setTimeout(function(){reader.scrollIntoView({behavior:'smooth',block:'start'});},10);
  }
  document.addEventListener('click',function(e){
    var target=e.target; while(target&&target!==document){if(target.getAttribute&&target.getAttribute('data-index')!==null){renderReader(parseInt(target.getAttribute('data-index'),10));return;} if(target.getAttribute&&target.getAttribute('data-self-exam')!==null){renderReader(30);return;} target=target.parentNode;}
    if(e.target&&e.target.id==='closeReader'){reader.innerHTML='<div class="reader-empty">از فهرست بالا یک بخش را انتخاب کنید تا متن کامل اینجا نمایش داده شود.</div>'; currentIndex=-1;}
    if(e.target&&e.target.id==='prevSection'){var prev=parseInt(reader.getAttribute('data-prev'),10); if(prev>-1){renderReader(prev);}}
    if(e.target&&e.target.id==='nextSection'){var next=parseInt(reader.getAttribute('data-next'),10); if(next>-1){renderReader(next);}}
    if(e.target&&e.target.id==='statsToggle'){var lows=reader.querySelectorAll('.low-priority'); for(var i=0;i<lows.length;i++){lows[i].className=lows[i].className.indexOf('is-visible')===-1?lows[i].className+' is-visible':lows[i].className.replace(' is-visible','');}}
    if(e.target&&e.target.id==='detailClose'){var old=document.getElementById('detailModal'); if(old){old.parentNode.removeChild(old);}}
    var detail=e.target; while(detail&&detail!==document){if(detail.getAttribute&&detail.getAttribute('data-detail-title')!==null){var old=document.getElementById('detailModal'); if(old){old.parentNode.removeChild(old);} var title=detail.getAttribute('data-detail-title'); var body=detail.getAttribute('data-detail-body'); var image=detail.getAttribute('data-detail-image'); var label=detail.getAttribute('data-detail-label')||title; var imageHtml=image?imageBox(label,image):''; var modal=document.createElement('div'); modal.className='detail-modal'; modal.id='detailModal'; modal.innerHTML='<div class="detail-dialog"><button class="detail-close" id="detailClose" type="button">×</button><h3>'+escapeHtml(title)+'</h3>'+imageHtml+'<div class="detail-text">'+body+'</div></div>'; document.body.appendChild(modal); persianizeText(modal); return;} detail=detail.parentNode;}
  });
  menuToggle.onclick=function(){var open=mainNav.className.indexOf('is-open')===-1; mainNav.className=open?'main-nav is-open':'main-nav'; menuToggle.setAttribute('aria-expanded',open?'true':'false');};
  backTop.onclick=function(){window.scrollTo(0,0);}; window.onscroll=function(){backTop.className=window.pageYOffset>500?'back-top is-visible':'back-top';}; renderLists(); persianizeText(document.getElementById('guide')); persianizeText(document.getElementById('sections')); reader.innerHTML='<div class="reader-empty">از فهرست بالا یک بخش را انتخاب کنید تا متن کامل اینجا نمایش داده شود.</div>';
})();
