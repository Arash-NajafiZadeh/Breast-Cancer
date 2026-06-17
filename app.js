(function(){
  var sections = window.APP_SECTIONS || [];
  var mainOrder = [1,30,3,2,7,5,6,4,0,9,31];
  var cards = document.getElementById('sectionCards') || document.getElementById('steps');
  var steps = document.getElementById('steps');
  var reader = document.getElementById('reader');
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  var backTop = document.getElementById('backTop');
  var langToggle = document.getElementById('langToggle');
  var currentIndex = -1;
  var currentLang = 'fa';

  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];});}
  function formatText(value){var safe=escapeHtml(value);return safe.replace(/^([^:：]{2,48})[:：]/,'<strong class="text-key">$1:</strong>');}
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
  function detailButton(title,icon,body,imageName,imageLabel){return '<button class="detail-tile" data-click-label="'+escapeHtml(clickHint())+'" type="button" data-detail-title="'+escapeHtml(title)+'" data-detail-body="'+escapeHtml(body)+'" data-detail-image="'+escapeHtml(imageName||'')+'" data-detail-label="'+escapeHtml(imageLabel||title)+'"><span>'+icon+'</span><strong>'+escapeHtml(title)+'</strong></button>';}

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
    var body='<div class="symptom-grid pro-grid">';
    for(var i=0;i<groups.length;i++){
      var g=groups[i]; if(!g.title){continue;}
      body+='<section class="symptom-card media-card"><div class="media-body"><h3><span>'+iconForTitle(g.title)+'</span>'+escapeHtml(g.title)+'</h3><ul>';
      for(var j=0;j<g.items.length;j++){body+='<li>'+formatText(cleanTitle(g.items[j]))+'</li>';}
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
    var body='<div class="self-flow pro-flow">';
    for(var i=0;i<items.length;i++){
      var it=items[i]; body+='<section class="flow-card '+(it.kind==='info'?'info-only':'media-card')+'"><div class="media-body"><h3><span>'+it.icon+'</span>'+escapeHtml(it.t)+'</h3><ul>';
      for(var j=0;j<it.lines.length;j++){body+='<li>'+formatText(it.lines[j])+'</li>';}
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
    return '<p class="reader-lead">'+escapeHtml(p[0])+'</p><div class="spotlight-grid"><section class="spotlight-card"><h3>✨ چرا تشخیص زود هنگام مهم است؟</h3><div class="mini-icon-grid">'+detailButton('تشخیص زودهنگام','🔎',p[3])+detailButton('آرامش خاطر','💗',p[4])+detailButton('کاهش عوارض','🛡️',p[5])+detailButton('تشخیص نوع ضایعه','⚕️',p[6])+detailButton('مسئولیت نسبت به بدن','🌷',p[7])+'</div></section><section class="spotlight-card hot"><h3>👩‍⚕️ آیا برای همه لازم است؟</h3><p>'+escapeHtml(p[9])+'</p><button class="primary-btn" type="button" data-self-exam="true">رفتن به آموزش خودآزمایی پستان</button></section></div><div class="method-list"><h3>روش‌های تشخیص زود هنگام و تشخیص</h3><p>'+escapeHtml(p[11])+'</p><div class="mini-icon-grid">'+buttons+'</div></div>';
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
      if(/عوامل افزایش خطر/.test(text)){return;}
      var parts=text.split(':'); var title=(parts[0]||text).trim(); var desc=(parts.slice(1).join(':')||text).trim();
      body+=detailButton(title,reducing?'✓':'!',desc,'',title);
    });
    return body+'</div></section></div>';
  }
  function renderCelebritiesArticle(){
    var people=[]; var current={name:cleanTitle(sections[9].title),lines:[]};
    sections[9].paragraphs.forEach(function(p){if(/^[۰-۹0-9]+\./.test(p)){people.push(current);current={name:cleanTitle(p),lines:[]};}else{current.lines.push(p);}}); people.push(current);
    var body='<p class="reader-lead strong-lead">روایت‌هایی کوتاه از تجربه، آگاهی و امید. برای خواندن داستان کامل هر نفر، کارت را لمس کنید.</p><div class="people-grid story-grid">';
    var hooks=['تصمیمی شجاعانه پیش از بیماری','صدایی که زنان جوان را بیدار کرد','از موسیقی تا ساخت مرکز تشخیص زود هنگام','بازگشت دوباره با امید و آگاهی','از بانوی اول آمریکا تا نبرد با سرطان','قهرمانی که مبارزه را زود شروع کرد','انتخاب سخت، امید روشن','وقتی صداقت یک بانوی اول تابو را شکست','روایت قدرت پس از خبر غیرمنتظره','اجرایی برای همه بیماران بی‌کلاه‌گیس','افسانه‌ای که از درمان عبور کرد','هنر، امید و ادامه زندگی','تصمیم پیشگیرانه برای زندگی دوباره','سکوت، درمان و تبدیل شدن به صدای آگاهی','از قاب تلویزیون تا پیام امید'];
    people.forEach(function(person,index){
      var code='celebrity-'+String(index+1).padStart(2,'0');
      var full=person.lines.join(' ');
      var preview=full.length>115?full.slice(0,115)+'...':full;
      var hook=hooks[index]||'روایتی برای امید و آگاهی';
      body+='<button class="person-card story-card" type="button" data-detail-title="'+escapeHtml(person.name)+'" data-detail-body="'+escapeHtml(formatText(full))+'" data-detail-image="'+code+'" data-detail-label="عکس '+escapeHtml(person.name)+'">'+imageBox('عکس '+person.name,code)+'<div><h3>'+escapeHtml(person.name)+'</h3><strong>'+escapeHtml(hook)+'</strong><p>'+formatText(preview)+'</p><span class="read-more">برای خواندن داستان کامل کلیک کنید</span></div></button>';
    });
    return body+'</div>';
  }

  var enPath = {
    0:['Breast Cancer','Basic, clear introduction','●'],
    1:['Signs and Symptoms','Important changes and when to seek care','!'],
    2:['Risk and Protection Factors','What increases or reduces risk','✓'],
    3:['Early Detection Methods','Self-check and clinical detection','⌕'],
    4:['If You Notice a Change','Clear next steps after concern','→'],
    5:['Treatment Methods','Main treatment options explained simply','+'],
    6:['Care After Treatment','Follow-up, recovery, and quality of life','♥'],
    7:['Myths and Facts','Common wrong beliefs corrected','?'],
    9:['From Stage to Battle','Stories of hope and awareness','★'],
    30:['Breast Self-Exam','Complete step-by-step guide','🎀'],
    31:['About Us','Coming soon','ℹ️']
  };
  function isEnglish(){return currentLang==='en';}
  function uiLabel(fa,en){return isEnglish()?en:fa;}
  function clickHint(){return isEnglish()?'Tap to open':'برای باز کردن لمس کنید';}
  function metaFor(index){
    if(isEnglish() && enPath[index]){return {title:enPath[index][0],subtitle:enPath[index][1],icon:enPath[index][2]};}
    if(index===30){return {title:'خودآزمایی پستان',subtitle:'آموزش کامل مرحله‌به‌مرحله',icon:'🎀'};}
    if(index===31){return {title:'درباره ما',subtitle:'به‌زودی تکمیل می‌شود',icon:'ℹ️'};}
    if(index===9){return {title:'از صحنه تا نبرد',subtitle:sections[9].subtitle,icon:sections[9].icon};}
    return {title:cleanTitle(sections[index].title),subtitle:sections[index].subtitle,icon:sections[index].icon};
  }
  function compactInteractivePage(sectionIndex, lead, className, icons){
    var raw=sections[sectionIndex].paragraphs;
    var intro=''; var items=[];
    for(var i=0;i<raw.length;i++){
      var text=cleanTitle(raw[i]); if(!text){continue;}
      if(i===0 && text.length>90){intro=text; continue;}
      if(isLikelyHeading(text,i) || /^[۰-۹0-9]+[.)،]/.test(text) || text.indexOf(':')>-1){items.push({title:text.split(':')[0].replace(/^[۰-۹0-9]+[.)،]\s*/,''), body:text});}
      else if(items.length){items[items.length-1].body+=' '+text;}
      else{items.push({title:text.slice(0,36), body:text});}
    }
    var body='<p class="reader-lead strong-lead">'+formatText(lead)+'</p>'+(intro?'<div class="top-explain">'+formatText(intro)+'</div>':'')+'<div class="'+className+' compact-cards">';
    for(var j=0;j<items.length;j++){var item=items[j];body+=detailButton(item.title,icons[j%icons.length],formatText(item.body),'',item.title);}
    return body+'</div>';
  }
  function renderActionAfterConcernArticle(){
    return compactInteractivePage(4,'اگر علامت یا شک وجود دارد، قدم‌ها را کوتاه، روشن و بدون ترس دنبال کنید.','action-grid',['🧘‍♀️','👩‍⚕️','🩺','📝','🤝','⏱️','🏥','💗']);
  }
  function renderAfterTreatmentArticle(){
    return compactInteractivePage(6,'پس از درمان، مراقبت منظم و توجه به کیفیت زندگی مهم است.','care-grid',['📅','💪','🥗','🧠','💗','🩺','🌿','🤝']);
  }
  function enTile(title,icon,body,imageName,label){return detailButton(title,icon,body,imageName||'',label||title);}
  function englishApprox(text){var out=cleanTitle(text);var dict=[['گزینه زیر مجموعه','Subsection'],['زیرمجموعه','Subsection'],['سرطان پستان','Breast cancer'],['علائم و نشانه‌ها','Signs and symptoms'],['باورهای نادرست','Myths'],['واقعیت','Fact'],['توده','lump'],['پستان','breast'],['پزشک','doctor'],['ماما','midwife'],['درمان','treatment'],['تشخیص زود هنگام','early detection'],['تشخیص زودهنگام','early detection'],['ماموگرافی','mammography'],['سونوگرافی','ultrasound'],['نمونه‌برداری','biopsy'],['معاینه بالینی','clinical exam'],['خودآزمایی','self-exam'],['مراقبت','care'],['پس از درمان','after treatment'],['اقدامات پس از شک','steps after concern'],['عوامل خطر','risk factors'],['کاهش خطر','risk reduction'],['افزایش خطر','increased risk'],['هورمونی','hormonal'],['خانوادگی','family'],['ژنتیکی','genetic'] ,['توده‌های خوش‌خیم و بدخیم','Benign and malignant lumps'],['توده‌های پستان به دو دسته اصلی تقسیم می‌شوند','Breast lumps are divided into two main categories'],['اهمیت تشخیص زودهنگام','The importance of early detection'],['وضعیت اپیدمیولوژیک','Epidemiological status'],['عوامل مؤثر در ایجاد','Factors involved in developing'],['سابقه خانوادگی و عوامل ژنتیکی','Family history and genetic factors'],['برخی ضایعات پیش‌سرطانی','Some precancerous lesions'],['عوامل هورمونی','Hormonal factors'],['عوامل سبک زندگی','Lifestyle factors'],['قرارگیری در معرض','Exposure to'],['وجود توده یا ضخیم‌شدگی','Lump or thickening'],['تغییر در اندازه، شکل یا ظاهر','Change in size, shape, or appearance'],['تغییرات در نوک','Nipple changes'],['تغییرات در پوست','Skin changes'],['درد یا ناراحتی','Pain or discomfort'],['ناحیه زیر بغل یا ترقوه','Underarm or collarbone area'],['اقدامات پس از شک','Steps after suspicion'],['روش‌های درمان','Treatment methods'],['مراقبت‌های پس از درمان','Care after treatment'],['باورهای نادرست','Misconceptions'],['تصورات غیرواقعی','Unrealistic beliefs'],['پیشگیری','prevention'],['عوامل خطر','risk factors'],['علائم','symptoms'],['نشانه','sign'],['معاینه','examination'],['بالینی','clinical'],['ترشح','discharge'],['پوست','skin'],['نوک','nipple'],['زیر بغل','underarm'],['ترقوه','collarbone'],['خوش‌خیم','benign'],['بدخیم','malignant'],['غیرسرطانی','non-cancerous'],['سرطانی','cancerous'],['زودهنگام','early'],['زود هنگام','early'],['مراجعه','visit'],['ضروری','necessary'],['لازم','needed'],['افزایش می‌دهد','increases'],['کاهش می‌دهد','reduces'],['باید','should'],['ممکن است','may'],['توصیه می‌شود','is recommended'],['در صورت','if'],['تغییر','change'],['غیرعادی','unusual'],['مداوم','persistent']];for(var i=0;i<dict.length;i++){out=out.split(dict[i][0]).join(dict[i][1]);}return out;}
  function renderEnglishArticle(index){
    if(index===1){return '<div class="symptom-grid pro-grid">'+[
      ['Lump or thickening','🔎','A new lump, hardness, or thick area in the breast or underarm should be checked by a doctor or midwife.','symptom-lump'],
      ['Change in size or shape','🧍‍♀️','A sudden change in breast size, shape, or new asymmetry needs attention.','symptom-size-shape'],
      ['Nipple changes','📍','New nipple inversion, unusual sensitivity, thickening, or clear/bloody discharge should be evaluated.','symptom-nipple'],
      ['Skin changes','🌸','Redness, darkening, dimpling, orange-peel texture, scaling, wounds, or persistent itching may need care.','symptom-skin'],
      ['Persistent pain','⚡','Pain that continues, is unusual, or is not related to the menstrual cycle should be followed up.','symptom-pain'],
      ['Underarm or collarbone swelling','🫱','Swelling or enlarged lymph nodes under the arm or near the collarbone should be checked.','symptom-armpit']
    ].map(function(x){return '<section class="symptom-card media-card"><div class="media-body"><h3><span>'+x[1]+'</span>'+x[0]+'</h3><p>'+x[2]+'</p></div>'+imageBox(x[0],x[3])+'</section>';}).join('')+'</div>';}
    if(index===30){return '<div class="self-flow pro-flow">'+[
      ['Best time','🗓️','A few days after your period ends, or one fixed day each month after menopause.',''],['Suitable place','🚿','Choose a private place with a large mirror. Checking in the shower with wet skin can make touching easier.',''],['Mirror check','🪞','Stand in front of a mirror and look with arms down, hands on waist, and arms raised.','self-mirror'],['What to look for','👁️','Look for size, shape, skin dimpling, swelling, color change, or nipple changes.','self-look-changes'],['Circular touch','🌀','Use the pads of three fingers and move in circles or lines across the whole breast.','self-circular-touch'],['Underarm check','🫱','Check the underarm and the area around the breast with light, medium, and firm pressure.','self-armpit'],['Nipple pressure','📍','Gently press the nipple to notice any unusual discharge.','self-nipple-pressure'],['Standing position','🙆‍♀️','Check while standing or sitting; raising one arm can make touch easier.','self-standing-arm-up'],['Lying position','🛏️','Lie down with a pillow under the shoulder to examine more evenly.','self-lying-pillow'],['If something is unusual','🏥','A hard lump, uneven area, persistent pain, or unusual discharge should be checked promptly.','']
    ].map(function(x){return '<section class="flow-card media-card"><div class="media-body"><h3><span>'+x[1]+'</span>'+x[0]+'</h3><p>'+x[2]+'</p></div>'+(x[3]?imageBox(x[0],x[3]):'<div class="ui-ornament">'+x[1]+'</div>')+'</section>';}).join('')+'</div>';}
    if(index===3){return '<div class="spotlight-grid"><section class="spotlight-card"><h3>✨ Why early detection matters</h3><div class="mini-icon-grid">'+enTile('Find small changes','🔎','Early detection can identify small changes before they become serious.')+enTile('Peace of mind','💗','It helps confirm breast health and reduce uncertainty.')+enTile('Better outcomes','🛡️','Timely action can reduce complications and improve treatment success.')+'</div></section><section class="spotlight-card hot"><h3>👩‍⚕️ Is it needed for everyone?</h3><p>All women should be aware of their breast health. The right method and timing depend on age, risk factors, and medical advice.</p><button class="primary-btn" type="button" data-self-exam="true">Open Breast Self-Exam</button></section></div><div class="method-list"><h3>Clinical methods</h3><div class="mini-icon-grid">'+enTile('Clinical breast exam','👩‍⚕️','A doctor or midwife checks the breast and underarm by touch and may request more tests.')+enTile('Mammography','🩻','Low-dose X-ray imaging that can detect small breast changes.')+enTile('Ultrasound','〰️','Sound-wave imaging used to evaluate lumps or dense breast tissue.')+enTile('MRI','🧲','Detailed imaging used in selected high-risk or unclear cases.')+enTile('Biopsy','🔬','A tissue sample is examined to make a definite diagnosis.')+'</div></div>';}
    if(index===2){return '<div class="risk-board"><section class="risk-column danger"><h3>Factors that may increase risk</h3><div class="mini-icon-grid">'+['Age','Family history','Personal history','Dense breast tissue','Hormonal factors','Unhealthy weight','Low physical activity','Alcohol or smoking'].map(function(t){return enTile(t,'!',t+' can be related to higher breast cancer risk depending on personal conditions.');}).join('')+'</div></section><section class="risk-column safe"><h3>Protective habits</h3><div class="mini-icon-grid">'+['Healthy weight','Healthy diet','Regular activity','No smoking','Avoid alcohol','Breastfeeding','Regular medical follow-up','Genetic counseling when needed'].map(function(t){return enTile(t,'✓',t+' may support better breast health and risk management.');}).join('')+'</div></section></div>';}
    if(index===4){return '<p class="reader-lead strong-lead">If you notice a change, do not panic and do not delay. Follow clear steps.</p><div class="action-grid compact-cards">'+['Stay calm','Book a visit','Tell your doctor or midwife','Write down changes','Follow recommended tests','Return for results'].map(function(t,i){var icons=['🧘‍♀️','👩‍⚕️','🩺','📝','⏱️','🏥'];return enTile(t,icons[i],t+' is part of a safe and practical follow-up path.');}).join('')+'</div>';}
    if(index===6){return '<p class="reader-lead strong-lead">After treatment, regular follow-up and self-care support quality of life.</p><div class="care-grid compact-cards">'+['Follow-up visits','Physical activity','Healthy eating','Emotional support','Report new symptoms','Long-term care plan'].map(function(t,i){var icons=['📅','💪','🥗','🧠','🩺','🌿'];return enTile(t,icons[i],t+' helps recovery, confidence, and ongoing health.');}).join('')+'</div>';}
    if(index===5){return '<div class="top-explain treatment-intro">Treatment is selected by the medical team based on the person’s condition. Sometimes one method is used, and sometimes a combination is needed.</div><div class="mini-icon-grid treatment-grid">'+['Surgery','Radiation therapy','Chemotherapy','Hormone therapy','Immunotherapy','Supportive care'].map(function(t,i){var icons=['🔪','☢️','💊','🧬','🛡️','🫶'];return enTile(t,icons[i],t+' may be recommended depending on diagnosis, stage, and medical advice.');}).join('')+'</div>';}
    if(index===7){return '<div class="myth-sections"><section class="myth-section"><h3>Common myths and facts</h3><div class="mini-icon-grid">'+[['Every breast lump is cancer','Many breast lumps are benign, but every new change should be checked.'],['Breast pain always means cancer','Pain is often hormonal or benign, but persistent unusual pain needs evaluation.'],['Mammography causes cancer','The radiation dose is low and the benefit of early detection is usually much greater.'],['No family history means no risk','Many people with breast cancer have no family history.'],['Breast cancer is always fatal','Early detection and modern treatment can lead to good outcomes.']].map(function(x){return enTile(x[0],'✕','<div class="myth-pop"><div class="wrong"><span>✕</span><strong>Myth</strong><p>'+x[0]+'</p></div><div class="right"><span>✓</span><strong>Fact</strong><p>'+x[1]+'</p></div></div>');}).join('')+'</div></section></div>';}
    if(index===0){return '<div class="english-full">'+[
      ['p','Breast cancer is one of the most common cancers among women. In this disease, cells in breast tissue lose their normal control and divide abnormally and excessively. These cells can form a mass that may be benign or malignant. Most breast cancers begin in the milk ducts (ductal carcinoma) or in the milk-producing lobules (lobular carcinoma).'],
      ['h','Benign and malignant lumps'],
      ['p','Breast lumps are divided into two main categories:'],
      ['p','Benign lumps (non-cancerous): These lumps usually remain limited to their original location, do not invade nearby tissues, and do not have the ability to metastasize (spread to other parts of the body). They often do not create a serious risk for the patient and can be removed surgically if needed.'],
      ['p','Malignant lumps (cancerous): These lumps have invasive features and can invade surrounding tissues. They may spread to other organs through the lymphatic system or bloodstream (metastasis). Timely diagnosis and treatment of this type of lump is vitally important.'],
      ['h','The importance of early detection'],
      ['p','Although breast cancer is one of the most common cancers, when it is identified in early stages it is also one of the most treatable cancers. Early detection significantly increases survival rates and helps preserve quality of life.'],
      ['h','Epidemiological status'],
      ['p','Breast cancer is the most common cancer among women worldwide. According to 2022 statistics, in 157 out of 185 countries, it had the highest number of cases among women. In the United States, one out of every 8 women develops breast cancer during her lifetime (about 13 percent). The average age at diagnosis is about 62 years, although about 9 percent of cases occur in women under 45.'],
      ['p','In Iran, breast cancer is also the most common cancer among women and ranks fifth in mortality. Its prevalence is about 36 cases per 100,000 women, and the approximate mortality rate is reported as 11 cases per 100,000 women.'],
      ['h','Factors involved in developing breast cancer'],
      ['p','The exact cause of breast cancer is unknown in many cases. However, a combination of genetic, hormonal, and environmental factors plays a role in its development. The most important risk factors include the following:'],
      ['p','Family history and genetic factors'],
      ['p','Some precancerous lesions'],
      ['p','Hormonal factors (such as early onset of menstruation, late menopause, not having children, or pregnancy at an older age)'],
      ['p','Lifestyle factors (obesity, alcohol consumption, lack of physical activity)'],
      ['p','Exposure to certain environmental factors and radiation'],
      ['p','Despite significant advances in early detection and modern treatment methods, public awareness and regular early detection practices (such as mammography, clinical examination, and breast self-exam) remain the most important tools for reducing deaths caused by this disease.']
    ].map(function(x){return '<section class="chunk info-chunk '+(x[0]==='h'?'is-heading-only':'')+'">'+(x[0]==='h'?'<h3>'+x[1]+'</h3>':'<p>'+formatText(x[1])+'</p>')+'</section>';}).join('')+'</div>';}
    if(index===9){var hooks=['A brave decision before illness','A voice that awakened young women','From music to early detection advocacy','Returning with hope and awareness','From First Lady to public courage','A champion who acted early','A difficult choice with a hopeful message','Honesty that broke a taboo','Strength after unexpected news','A performance for every patient','A legend who kept going','Art, hope, and life after treatment','A preventive decision for life','From silence to awareness','From television to a message of hope'];return '<p class="reader-lead strong-lead">Short stories of courage, awareness, and hope. Tap each card to read more.</p><div class="people-grid story-grid">'+hooks.map(function(h,i){var code='celebrity-'+String(i+1).padStart(2,'0');return '<button class="person-card story-card" type="button" data-detail-title="Story '+(i+1)+'" data-detail-body="'+h+'. This story reminds us that awareness, timely care, and hope can change lives." data-detail-image="'+code+'" data-detail-label="Photo">'+imageBox('Photo',code)+'<div><h3>'+h+'</h3><strong>Hope and awareness</strong><p>Tap to read the full story of courage and early detection.</p><span class="read-more">Click to read the full story</span></div></button>';}).join('')+'</div>';}
    if(index===31){return '<div class="support-box"><div class="support-icon">ℹ️</div><h3>About Us</h3></div>';}
    var source=sections[index]&&sections[index].paragraphs?sections[index].paragraphs:[];return '<div class="english-full">'+source.map(function(t){return '<section class="chunk info-chunk"><p>'+formatText(englishApprox(t))+'</p></section>';}).join('')+'</div>';
  }
  function renderTreatmentsArticle(){
    var raw=sections[5].paragraphs;
    var intro=raw[0]||'';
    var icons=['🔪','☢️','💊','🧬','🎯','🛡️','🫶','⚕️'];
    var items=[];
    for(var i=1;i<raw.length;i++){
      var text=cleanTitle(raw[i]); if(!text||(text.indexOf('هدفمند')>-1&&text.indexOf('درمان')>-1)){continue;} text=text.replace(/BRCA[۱۲12]\s*یا\s*BRCA[۱۲12]،?/g,'').replace(/BRCA[۱۲12]،?/g,'');
      if(isLikelyHeading(text,i) || /^[۰-۹0-9]+[.)،]/.test(text)){items.push({title:text.replace(/^[۰-۹0-9]+[.)،]\s*/,''), body:''});}
      else if(items.length){items[items.length-1].body+=(items[items.length-1].body?' ':'')+text;}
      else{items.push({title:text.slice(0,36), body:text});}
    }
    var body='<div class="top-explain treatment-intro">'+formatText(intro)+'</div><div class="mini-icon-grid treatment-grid">';
    for(var j=0;j<items.length;j++){var item=items[j];body+=detailButton(item.title,icons[j%icons.length],item.body||item.title,'',item.title);}
    return body+'</div>';
  }
  function cardHtml(s,index,number){return '<span class="card-icon">'+escapeHtml(s.icon)+'</span><span class="card-content"><span class="card-title">'+escapeHtml(index===9?'از صحنه تا نبرد':cleanTitle(s.title))+'</span><span class="card-subtitle">'+escapeHtml(s.subtitle)+'</span><span class="card-meta">'+number+' · '+s.paragraphs.length+' بند آموزشی</span></span>';}
  function renderLists(){
    steps.innerHTML='';
    for(var i=0;i<mainOrder.length;i++){
      var sectionIndex=mainOrder[i];
      var virtual=sectionIndex===30;
      var s=metaFor(sectionIndex);
      var item=document.createElement('button');
      item.type='button'; item.className='path-card'; item.setAttribute('data-click-label',clickHint());
      if(virtual){item.setAttribute('data-self-exam','true');}else{item.setAttribute('data-index',sectionIndex);}
      var title=s.title;
      item.innerHTML='<span class="path-icon">'+escapeHtml(s.icon||'💗')+'</span><span class="path-copy"><strong>'+escapeHtml(title)+'</strong><small>'+escapeHtml(s.subtitle)+'</small></span>';
      steps.appendChild(item);
    }
  }
  function renderCancerOverviewArticle(){
    var body='';
    var riskStarted=false;
    for(var i=0;i<sections[0].paragraphs.length;i++){
      var text=cleanTitle(sections[0].paragraphs[i]); if(!text){continue;}
      if(text==='سابقه خانوادگی و عوامل ژنتیکی'){riskStarted=true; body+='<div class="mini-icon-grid overview-risk-grid">';}
      if(riskStarted){
        if(text.indexOf('با وجود پیشرفت')===0){body+='</div><section class="chunk info-chunk"><p>'+formatText(text)+'</p></section>';riskStarted=false;continue;}
        body+=detailButton(text.replace(/^(.{2,34}?)(\s*\(.+\))?$/,'$1'),'💗',text,'',text);
      }else{
        var heading=isLikelyHeading(text,i);
        body+='<section class="chunk info-chunk '+(heading?'is-heading-only':'')+'">'+(heading?'<h3>':'<p>')+formatText(text)+(heading?'</h3>':'</p>')+'</section>';
      }
    }
    if(riskStarted){body+='</div>';}
    return body;
  }
  function renderDefaultArticle(index){
    var s=sections[index],body='',hiddenCount=0;
    for(var i=0;i<s.paragraphs.length;i++){var p=cleanTitle(s.paragraphs[i]); if(!p){continue;} var low=isLowPriority(p); if(low){hiddenCount++;} var heading=isLikelyHeading(p,i); body+='<section class="chunk info-chunk '+(low?'low-priority':(heading?'is-heading-only':''))+'">'+(heading?'<h3>':'<p>')+formatText(p)+(heading?'</h3>':'</p>')+'</section>';}
    if(hiddenCount){body='<button type="button" class="stats-toggle" id="statsToggle">'+uiLabel('نمایش آمار و توضیحات تکمیلی','Show statistics and extra details')+'</button>'+body;} return body;
  }
  function renderReader(index){
    if(index!==30&&index!==31&&(index<0||index>=sections.length)){return;} currentIndex=index;
    var s=index===30?{title:'خودآزمایی پستان',subtitle:'آموزش کامل و مرحله‌به‌مرحله'}:(index===31?{title:'درباره ما',subtitle:'به‌زودی تکمیل می‌شود'}:sections[index]); var body='',specialClass='';
    if(isEnglish()){body=renderEnglishArticle(index);specialClass=' english-article';}
    else if(index===1){body=renderSymptomsArticle();specialClass=' symptoms-article';}
    else if(index===30){body=renderSelfExamArticle();specialClass=' self-exam-article';}
    else if(index===3){body=renderScreeningArticle();specialClass=' screening-article';}
    else if(index===2){body=renderRisksArticle();specialClass=' risks-article';}
    else if(index===7){body=renderMythsArticle();specialClass=' myths-article';}
    else if(index===4){body=renderActionAfterConcernArticle();specialClass=' action-article';}
    else if(index===5){body=renderTreatmentsArticle();specialClass=' treatments-article';}
    else if(index===6){body=renderAfterTreatmentArticle();specialClass=' care-article';}
    else if(index===9){body=renderCelebritiesArticle();specialClass=' celebrities-article';}
    else if(index===31){body='<div class="support-box"><div class="support-icon">ℹ️</div><h3>درباره ما</h3></div>';specialClass=' about-article';}
    else if(index===0){body=renderCancerOverviewArticle();specialClass=' overview-article';}
    else{body=renderDefaultArticle(index);}
    var orderPos=mainOrder.indexOf(index); var prevIndex=orderPos>0?mainOrder[orderPos-1]:-1; var nextIndex=orderPos>-1&&orderPos<mainOrder.length-1?mainOrder[orderPos+1]:-1;
    var meta=metaFor(index); var title=meta.title; var subtitle=meta.subtitle;
    reader.innerHTML='<div class="article'+specialClass+'"><header class="article-header"><h2>'+escapeHtml(title)+'</h2><p>'+escapeHtml(subtitle)+'</p></header><div class="article-body">'+body+'</div><div class="next-prev centered-nav"><button type="button" class="secondary" id="prevSection" '+(prevIndex<0?'disabled':'')+'>'+uiLabel('قبلی','Previous')+'</button><button type="button" id="nextSection" '+(nextIndex<0?'disabled':'')+'>'+uiLabel('بعدی','Next')+'</button></div></div>';
    reader.setAttribute('data-prev',prevIndex); reader.setAttribute('data-next',nextIndex); persianizeText(reader); setTimeout(function(){reader.scrollIntoView({behavior:'smooth',block:'start'});},10);
  }
  document.addEventListener('click',function(e){
    var target=e.target; while(target&&target!==document){if(target.getAttribute&&target.getAttribute('data-index')!==null){renderReader(parseInt(target.getAttribute('data-index'),10));return;} if(target.getAttribute&&target.getAttribute('data-self-exam')!==null){renderReader(30);return;} target=target.parentNode;}
    if(e.target&&e.target.id==='closeReader'){reader.innerHTML='<div class="reader-empty">'+uiLabel('از مسیر بالا یک بخش را انتخاب کنید تا متن کامل اینجا نمایش داده شود.','Choose a section from the path above to view the full content.')+'</div>'; currentIndex=-1;}
    if(e.target&&e.target.id==='prevSection'){var prev=parseInt(reader.getAttribute('data-prev'),10); if(prev>-1){renderReader(prev);}}
    if(e.target&&e.target.id==='nextSection'){var next=parseInt(reader.getAttribute('data-next'),10); if(next>-1){renderReader(next);}}
    if(e.target&&e.target.id==='statsToggle'){var lows=reader.querySelectorAll('.low-priority'); for(var i=0;i<lows.length;i++){lows[i].className=lows[i].className.indexOf('is-visible')===-1?lows[i].className+' is-visible':lows[i].className.replace(' is-visible','');}}
    if(e.target&&(e.target.id==='detailClose'||e.target.id==='detailModal')){var old=document.getElementById('detailModal'); if(old){old.parentNode.removeChild(old);}}
    var detail=e.target; while(detail&&detail!==document){if(detail.getAttribute&&detail.getAttribute('data-detail-title')!==null){var old=document.getElementById('detailModal'); if(old){old.parentNode.removeChild(old);} var title=detail.getAttribute('data-detail-title'); var body=detail.getAttribute('data-detail-body'); var image=detail.getAttribute('data-detail-image'); var label=detail.getAttribute('data-detail-label')||title; if(body.indexOf('<')===-1){body=formatText(body);} var imageHtml=image?imageBox(label,image):''; var modal=document.createElement('div'); modal.className='detail-modal'; modal.id='detailModal'; modal.innerHTML='<div class="detail-dialog"><button class="detail-close" id="detailClose" type="button">×</button><h3>'+escapeHtml(title)+'</h3>'+imageHtml+'<div class="detail-text">'+body+'</div></div>'; document.body.appendChild(modal); persianizeText(modal); return;} detail=detail.parentNode;}
  });
  if(menuToggle&&mainNav){menuToggle.onclick=function(){var open=mainNav.className.indexOf('is-open')===-1; mainNav.className=open?'main-nav is-open':'main-nav'; menuToggle.setAttribute('aria-expanded',open?'true':'false');};}
  if(langToggle){langToggle.onclick=function(){var en=document.body.classList.toggle('en-mode');document.documentElement.lang=en?'en':'fa';document.documentElement.dir=en?'ltr':'rtl';currentLang=en?'en':'fa';document.body.setAttribute('data-click-label',clickHint());langToggle.innerHTML=en?'EN / FA':'FA / EN';renderLists();if(currentIndex>-1){renderReader(currentIndex);}};}

  backTop.onclick=function(){window.scrollTo(0,0);}; window.onscroll=function(){backTop.className=window.pageYOffset>500?'back-top is-visible':'back-top';}; document.body.setAttribute('data-click-label',clickHint()); renderLists(); var welcome=document.getElementById('welcomeScreen'); if(welcome){setTimeout(function(){welcome.className='welcome-screen is-hidden';},2600); welcome.onclick=function(){welcome.className='welcome-screen is-hidden';};} persianizeText(document.getElementById('guide')); persianizeText(document.getElementById('sections')); reader.innerHTML='<div class="reader-empty">'+uiLabel('از مسیر بالا یک بخش را انتخاب کنید تا متن کامل اینجا نمایش داده شود.','Choose a section from the path above to view the full content.')+'</div>';
})();
