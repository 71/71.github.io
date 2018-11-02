
const greeting = document.getElementById('greeting')
const hour = new Date(Date.now()).getHours()

if (hour > 16)
  greeting.innerText = 'Good evening'
else if (hour > 11)
  greeting.innerText = 'Good afternoon'
else if (hour > 4)
  greeting.innerText = 'Good morning'
else
  greeting.innerText = 'Good night'

  
const projects = document.getElementById('projects')

for (const project of document.getElementsByClassName('project')) {
  project.onpointerenter = () => {
    h++
    projects.style.backgroundColor = project.getAttribute('data-accent')
  }
  project.onpointerleave = () => {
    if (--h === 0)
      projects.style.backgroundColor = ''
  }
}

if (fetch) {
  const count = document.getElementById('projects-count')
  
  fetch("https://api.github.com/users/71")
    .then(res => res.json())
    .then(res => count.innerText = 'over ' + res.public_repos)
}
