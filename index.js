
var greeting = document.getElementById('greeting')
var hour = new Date(Date.now()).getHours()

if (hour > 16)
  greeting.innerText = 'Good evening'
else if (hour > 11)
  greeting.innerText = 'Good afternoon'
else if (hour > 4)
  greeting.innerText = 'Good morning'
else
  greeting.innerText = 'Good night'

  
var projects = document.getElementById('projects')

var loop = function () {
  var project = list[i];

  project.onpointerenter = function () {
    h++
    projects.style.backgroundColor = project.getAttribute('data-accent')
  }
  project.onpointerleave = function () {
    if (--h === 0)
      projects.style.backgroundColor = ''
  }
};

for (var i = 0, list = document.getElementsByClassName('project'); i < list.length; i += 1) loop();

if (fetch) {
  var count = document.getElementById('projects-count')
  
  fetch("https://api.github.com/users/71")
    .then(function (res) { return res.json(); })
    .then(function (res) { return count.innerText = 'over ' + res.public_repos; })
}
