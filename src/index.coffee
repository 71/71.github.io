any = (el, predicate) ->
    el? and (predicate(el) or any(el.parentElement, predicate))

all = (el, predicate) ->
    if el? then (predicate(el) and any(el.parentElement, predicate)) else true

$ = document.querySelector
$$ = document.querySelectorAll

menu = null
closeBtn = null

now = new Date(Date.now())
hour = now.getHours()
document.title = 'Jee - ' +
    if hour > 16
        'Good evening'
    else if hour > 11
        'Good afternoon'
    else if hour > 4
        'Good morning'
    else
        'Good night'

if document.readyState is 'complete'
    ready()
else
    document.onreadystatechange = () ->
        if document.readyState is 'complete'
            ready()


scrollTo = (scrollTarget, speed) ->
    scrollTarget ?= 0
    speed        ?= 2000

    currentScroll = window.scrollY
    currentTime   = 0
    time          = Math.max(.1, Math.min(Math.abs(window.scrollY - scrollTarget) / speed, .8))

    ease = (p) ->
        if (p /= .5) < 1
            return .5 * Math.pow(p, 5)
        return 0.5 * (Math.pow((p - 2), 5) + 2)

    tick = () ->
        currentTime += 1 / 60
        p = currentTime / time
        t = ease(p)

        if p < 1
            requestAnimationFrame(tick)
            window.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t))
        else
            window.scrollTo(0, scrollTarget)

    tick()

document.onclick = (e) ->
    if menu is null
        menu = document.createElement('div')
        menu.id = 'menu'

        menuClip = document.createElement('div')
        menuClip.id = 'menuclip'

        menu.appendChild(menuClip)

        for el in document.querySelectorAll('[data-title], [data-subtitle]')
            isSub = el.hasAttribute('data-subtitle')

            child = document.createElement('a')
            child.classList.add(if isSub then 'subtitle' else 'title')
            child.innerText = el.getAttribute(if isSub then 'data-subtitle' else 'data-title').toUpperCase()
            child.setAttribute('data-offset', el.offsetTop)

            child.onclick = () ->
                scrollTo(@getAttribute('data-offset'))

            menu.appendChild(child)

        closeBtn = document.createElement('a')
        closeBtn.id = 'close'

        document.body.prepend(menu)
        document.body.prepend(closeBtn)

    if menu.classList.contains('shown')
        clip = menu.firstChild
        clip.style.left = e.x + 'px'
        clip.style.top = e.y + 'px'
        menu.classList.remove('shown')
    else if all(e.target, (_) -> ['div', 'section', 'svg', 'body', 'html'].indexOf(_.tagName.toLowerCase()) isnt -1)
        menu.classList.add('shown')
        clip = menu.firstChild
        clip.style.left = e.x + 'px'
        clip.style.top = e.y + 'px'


ready = () ->
    originalMailTo = document.getElementById('mail').href

    document.getElementById('message').onchange = (e) ->
        document.getElementById('mail').href = originalMailTo + '&body=' + encodeURIComponent(e.target.value)

    document.getElementsByClassName('arrow')[0].onclick = (e) ->
        scrollTo(window.innerHeight, 10)
