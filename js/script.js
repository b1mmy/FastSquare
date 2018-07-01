/* Settings for app */
var settings = {
  url: 'https://source.unsplash.com/random?',
  sections: ['Cats','Dogs','Food','World'],
  current: 'Cats',
  slideshow: 'false',
  timing: 10,
  duration: 1000,
  hide: 5000
};
/* End settings for app */
/* Local storage settings */
if(!localStorage.getItem("sections")) localStorage.setItem("sections",JSON.stringify(settings.sections));
if(!localStorage.getItem("current")) localStorage.setItem("current",settings.current);
if(!localStorage.getItem("timing")) localStorage.setItem("timing",settings.timing);
if(!localStorage.getItem("slideshow")) localStorage.setItem("slideshow",settings.slideshow);
var url = settings.url,
    sections = JSON.parse(localStorage.getItem("sections")),
    current = localStorage.getItem("current"),
    cur = 0,
    block = false,
    options = '',
    inputs = '',
    images = document.querySelectorAll('#all .img'),
    slideshow = localStorage.getItem("slideshow"),
    timing = localStorage.getItem("timing"),
    m = 0;
/* End local storage settings */
/* Start app */
/* Only for phonegap build
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  navigator.splashscreen.hide();*/
  document.getElementById('splashscreen').style.backgroundImage = 'url("splashes/' + (window.screen.availWidth > window.screen.availHeight ? 'landscape' : 'portrait') + '.png")';
  setTimeout(function(){document.getElementById('splashscreen').classList.add('active');},500);
  checkInternet();
  setTimeout(function(){document.querySelector('#all').style.opacity = 1.0;},1000);
  /* Only for web app */
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
      toggleFullScreen();
    }
  }, false);
  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  /* **************** */
/* Only for phonegap build }; */
/* End of calls */
/* Functions */
function checkInternet() {
  var img = document.body.appendChild(document.createElement("img"));
  img.classList.add('connect');
  img.src = settings.url;
  img.onload = function(){
    var elems = document.querySelectorAll('.connect');
    for(var i = 0; i < elems.length; i++) elems[i].remove();
    document.getElementById('notconnected').style.display = 'none';
    start();
  };
  img.onerror = function(){
    var elems = document.querySelectorAll('.connect');
    for(var i = 0; i < elems.length; i++) elems[i].remove();
    document.getElementById('notconnected').style.display = 'block';
    setTimeout(function(){checkInternet();},1000);
  };
}
function start() {
  refreshSections();
  modalPos();
  window.onresize = function(){modalPos();};
  for(var i = 0; i < images.length; i++) {
    document.querySelectorAll('#all .img')[i].onclick = function(){
      if(parseInt(this.getAttribute('data-m'),10)*100 <= settings.hide && this.getAttribute('data-slideshow') != 'true') {
        changeImg();
      } else {
        showelems();
      }
    };
  }
  document.addEventListener('mousemove', showelems);
  document.getElementById('settings').onclick = function(){modal();};
  document.getElementById('modal').addEventListener('click', function (e) {if(e.target === e.currentTarget) modal();});
  document.getElementById('timing').value = timing;
  document.getElementById('timing').onkeyup = function() {
    timing = parseInt(this.value,10);
    localStorage.setItem("timing",timing);
  };
  document.getElementById('slideshowpower').value = slideshow;
  document.getElementById('slideshowpower').onchange = function(){
    slideshow = this.value == 'true' ? 'true' : 'false';
    localStorage.setItem("slideshow",slideshow);
    modal();
  };
  changeImg();
  slideshowscroll(false);
  mousenomove();
  setTimeout(function(){
    document.getElementById('splashscreen').classList.remove('active');
    setTimeout(function(){document.getElementById('splashscreen').style.display = 'none';},500);
  },2000);
}
function showelems() {
  window.m = 0;
  document.getElementById('settings').classList.remove('hide');
  document.getElementById('section').classList.remove('hide');
}
function mousenomove() {
  if(window.m*100 <= settings.hide) {
    window.m++;
  } else {
    document.getElementById('settings').classList.add('hide');
    document.getElementById('section').classList.add('hide');
  }
  var elems = document.querySelectorAll('#all .img');
  for(var i = 0; i < elems.length; i++) {
    elems[i].setAttribute('data-m',window.m);
    elems[i].setAttribute('data-slideshow',window.slideshow);
  }
  setTimeout(function(){mousenomove();},100);
}
function slideshowscroll(go) {
  if(slideshow == 'true' && go) changeImg();
  setTimeout(function(){slideshowscroll(true);},timing*settings.duration);
}
function changeImg() {
  var item = document.getElementsByClassName('img')[cur];
  item.style.backgroundImage = 'url(\'' + url + current + '&' + new Date().getTime() + '\')';
  block = true;
  setTimeout(function(){
    for(var i = 0; i < document.getElementsByClassName('img').length; i++) document.getElementsByClassName('img')[i].classList.toggle('active');
    block = false;
  },1500);
  cur = cur ? 0 : 1;
}
function changeSection(elem) {
  localStorage.setItem("current",elem.value);
  current = localStorage.getItem("current");
  changeImg();
}
function modalPos() {
  var elem = document.getElementById('modal-body');
  document.querySelector('*').style.fontSize = "2.5v" + (window.screen.availWidth > window.screen.availHeight ? "w" : "h") + "!important";
  document.querySelector('#modal-body h1').style.fontSize = "2.5v" + (window.screen.availWidth > window.screen.availHeight ? "w" : "h") + "!important";
  document.querySelector('#modal-body h2').style.fontSize = "1.5v" + (window.screen.availWidth > window.screen.availHeight ? "w" : "h") + "!important";
  elem.style.maxWidth = window.screen.availWidth <= 480 ? "100vw" : "50vw";
  if(elem.offsetHeight < document.getElementById('modal').offsetHeight+50) {
    elem.style.marginTop = "calc((100vh - " + elem.offsetHeight + "px)/2)";
    elem.style.marginBottom = "0";
  } else {
    elem.style.marginTop = "50px";
    elem.style.marginBottom = "50px";
  }
}
function refreshSections() {
  options = '';
  inputs = '';
  localStorage.setItem("sections",JSON.stringify(sections));
  for(var i = 0; i < sections.length; i++) {
    options += '<option value="' + sections[i] + '">' + sections[i] + '</option>';
    inputs += '<input type="text" value="' + sections[i] + '" />';
  }
  inputs += '<div id="settingsbuttons">';
  inputs += '<button id="plus"><i class="icon icon-add"></i></button>';
  inputs += '<button id="refreshSections"><i class="icon icon-ok"></i></button>';
  inputs += '<button id="reset"><i class="icon icon-reset"></i></button>';
  inputs += '<button id="exit"><i class="icon icon-off"></i></button>';
  inputs += '</div>';
  document.getElementById('section').innerHTML = options;
  document.getElementById('sections').innerHTML = inputs;
  current = localStorage.getItem("current");
  document.getElementById('section').value = (sections.indexOf(current)+1 ? current : sections[0]);
  document.getElementById('section').onchange = function(){changeSection(this);};
  document.getElementById('refreshSections').onclick = function(){addSections(true);};
  document.getElementById('reset').onclick = function(){reset();};
  document.getElementById('plus').onclick = function(){addSection();};
  /* Only for phonegap build document.getElementById('exit').onclick = function(){navigator.app.exitApp();}; */
}
function addSection() {
  addSections(false);
  sections.push('');
  refreshSections();
}
function reset() {
  localStorage.setItem("sections",JSON.stringify(settings.sections));
  localStorage.setItem("current",JSON.stringify(settings.current));
  sections = settings.sections;
  current = settings.current;
  refreshSections();
  modal();
  changeImg();
}
function addSections(ok) {
  var items = document.querySelectorAll('#sections input'),arr = [],re = /^[a-zA-ZА-Яа-яЁё\\s]+$/;
  for(var i = 0; i < items.length; i++) if(items[i].value.trim().length > 2 && re.test(items[i].value.trim())) arr.push(items[i].value);
  if(arr.length > 0) {
    sections = arr;
  } else {
    sections = [sections[0]];
  }
  refreshSections();
  if(ok) {
    modal();
    changeImg();
  };
}
function modal() {
  document.getElementById('modal').classList.toggle('active');
  modalPos();
}
/* End of functions */
