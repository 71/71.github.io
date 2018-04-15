
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
  
  fetch("https://api.github.com/users/6A")
    .then(res => res.json())
    .then(res => count.innerText = 'over ' + res.public_repos)
}
