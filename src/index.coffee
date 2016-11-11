any = (el, predicate) ->
    el? and (predicate(el) or any(el.parentElement, predicate))

all = (el, predicate) ->
    if el? then (predicate(el) and any(el.parentElement, predicate)) else true

$ = document.querySelector
$$ = document.querySelectorAll

menu = null
closeBtn = null

if document.readyState is 'complete'
    ready()
else
    document.onreadystatechange = () ->
        if document.readyState is 'complete'
            ready()

makeMap = (element, ratioX, ratioY) ->
    if ratioX > 1
        ratioX = ratioX / document.body.offsetWidth
    if ratioY > 1
        ratioY = ratioY / document.body.offsetHeight

    map = document.createElement('div')
    map.className = 'map'
    map.style.backgroundColor = window.getComputedStyle(element).backgroundColor

    getColor = (color) ->
        r = parseInt(color.substr(1, 2), 16)
        g = parseInt(color.substr(3, 2), 16)
        b = parseInt(color.substr(5, 2), 16)

        yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        if (yiq >= 128) then 'black' else 'white'

    process = (child) ->
        div = document.createElement('div')
        style = window.getComputedStyle(child)

        if child.hasAttribute('data-title')
            div.innerText = child.getAttribute('data-title')
            div.style.color = getColor(style.color)
        else if child.hasAttribute('data-subtitle')
            div.innerText = child.getAttribute('data-subtitle')
            div.style.color = getColor(style.color)

        for prop in ['backgroundColor', 'opacity', 'visibility']
            div.style[prop] = style[prop]

        div.style.width = (child.offsetWidth * ratioX) + 'px'
        div.style.height = (child.offsetHeight * ratioY) + 'px'
        div.style.left = (child.offsetLeft * ratioX) + 'px'
        div.style.top = (child.offsetTop * ratioY) + 'px'

        map.appendChild(div)

        for c in child.children
            process(c)

    for c in element.children
        process(c)

    return map


scrollTo = (scrollTarget, speed) ->
    scrollTarget ?= 0
    speed        ?= 2000

    currentScroll = window.scrollY
    currentTime   = 0
    time          = Math.max(.1, Math.min(Math.abs(window.scrollY - scrollTarget) / speed, .8))

    tick = () ->
        currentTime += 1 / 60
        p = currentTime / time
        t = (-0.5 * (Math.cos(Math.PI * p) - 1))

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

        ratioX = Math.min(document.body.offsetWidth, document.body.offsetHeight)
        ratioY = ratioX * (document.body.offsetWidth / document.body.offsetHeight)

        ratioX = 300
        ratioY = 600

        map = makeMap(document.body, ratioX, ratioY)
        map.style.height = ratioY + 'px'
        map.style.width = ratioX + 'px'

        document.body.appendChild(map)

    if menu.classList.contains('shown')
        menu.classList.remove('shown')
    else if all(e.target, (_) -> _.tagName is 'DIV' or _.tagName is 'SECTION' or _.tagName is 'HTML' or _.tagName is 'BODY')
        rect = menu.getBoundingClientRect()

        menu.style.left = (e.x - (rect.width / 2)) + 'px'
        menu.style.top = (e.y - (rect.height / 2)) + 'px'

        closeBtn.style.left = e.x + 'px'
        closeBtn.style.top = e.y + 'px'

        menu.classList.add('shown')



ready = () ->
    originalMailTo = document.getElementById('mail').href

    document.getElementById('message').onchange = (e) ->
        document.getElementById('mail').href = originalMailTo + '&body=' + encodeURIComponent(e.target.value)
