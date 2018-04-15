
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
  
  fetch("https://api.github.com/users/6A")
    .then(function (res) { return res.json(); })
    .then(function (res) { return count.innerText = 'over ' + res.public_repos; })
}
