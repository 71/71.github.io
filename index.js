
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


if (fetch) {
  var count = document.getElementById('projects-count')
  
  fetch("https://api.github.com/users/6A")
    .then(function (res) { return res.json(); })
    .then(function (res) { return count.innerText = 'over ' + res.public_repos; })
}
