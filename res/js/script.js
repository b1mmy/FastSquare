/* Settings for app */
var settings = {
  url: 'https://source.unsplash.com/random?',
  sections: ['Cats','Dogs','Food','World'],
  current: 'Cats'
};
/* End settings for app */
/* Local storage settings */
if(!localStorage.getItem("sections")) localStorage.setItem("sections",JSON.stringify(settings.sections));
if(!localStorage.getItem("current")) localStorage.setItem("current",settings.current);
var url = settings.url,
    sections = JSON.parse(localStorage.getItem("sections")),
    current = localStorage.getItem("current"),
    cur = 0,
    block = false,
    options = '',
    inputs = '',
    images = document.querySelectorAll('#all .img');
/* End local storage settings */
/* Call functions */
refreshSections();
modalPos();
window.onresize = function(){modalPos();};
for(var i = 0; i < images.length; i++) document.querySelectorAll('#all .img')[i].onclick = function(){changeImg();};
document.getElementById('refresh').onclick = function(){changeImg();};
document.getElementById('settings').onclick = function(){modal();};
document.getElementById('modal').addEventListener('click', function (e) {if(e.target === e.currentTarget) modal();});
changeImg();
/* End of calls */
/* Functions */
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
  var elems = document.querySelectorAll('#modal-body *');
  var summ = 0;
  document.querySelector('*').style.fontSize = "2.5v" + (window.screen.availWidth > window.screen.availHeight ? "w" : "h");
  elem.style.maxWidth = window.screen.availWidth <= 480 ? "100vw" : "50vw";
  elem.style.maxHeight = window.screen.availHeight <= 480 ? "100vh" : "50vh";
  elem.style.marginTop = "calc((100vh - " + elem.offsetHeight + "px)/2)";
  for(var i = 0; i < elems.length; i++) summ += elems[i].offsetHeight;
  elem.style.paddingTop = "calc((" + elem.offsetHeight + "px - " + summ + "px)/2)";
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
  inputs += '</div>';
  document.getElementById('section').innerHTML = options;
  document.getElementById('modal-body').innerHTML = inputs;
  current = localStorage.getItem("current");
  document.getElementById('section').value = (sections.indexOf(current)+1 ? current : sections[0]);
  document.getElementById('section').onchange = function(){changeSection(this);};
  document.getElementById('refreshSections').onclick = function(){addSections(true);};
  document.getElementById('reset').onclick = function(){reset();};
  document.getElementById('plus').onclick = function(){addSection();};
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
  var items = document.querySelectorAll('#modal-body input'),arr = [],re = /^[a-zA-ZА-Яа-яЁё\\s]+$/;
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
