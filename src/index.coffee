any = (el, predicate) ->
    el? and (predicate(el) or any(el.parentElement, predicate))

all = (el, predicate) ->
    if el? then (predicate(el) and any(el.parentElement, predicate)) else true

$ = document.querySelector
$$ = document.querySelectorAll

menu = null

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
            menu.appendChild(document.createElement('br'))

        document.body.prepend(menu)

    if menu.classList.contains('shown')
        clip = menu.firstChild
        clip.style.left = e.x + 'px'
        clip.style.top = e.y + 'px'
        menu.classList.remove('shown')
    else if all(e.target, (_) -> ['div', 'section', 'svg', 'body', 'html'].indexOf(_.tagName.toLowerCase()) isnt -1 and !_.classList.contains('arrow'))
        menu.classList.add('shown')
        clip = menu.firstChild
        clip.style.left = e.x + 'px'
        clip.style.top = e.y + 'px'


ready = () ->
    messages = document.getElementById('messages')
    message = document.getElementById('message')

    originalMailTo = document.getElementById('email').href

    document.getElementById('message').onchange = (e) ->
        document.getElementById('email').href =
            if e.target.value == ''
                originalMailTo
            else
                originalMailTo + '&body=' + encodeURIComponent(e.target.value)

    document.getElementsByClassName('arrow')[0].onclick = (e) ->
        scrollTo(window.innerHeight, 10)

    message.oninput = (e) ->
        document.getElementById('send').disabled = not /\w+/.test(e.target.value)

    document.getElementById('userinput').onsubmit = (e) ->
        e.preventDefault()

        unless /\w+/.test(message.value)
            return

        atEnd = document.body.offsetHeight - window.innerHeight - document.body.scrollTop == 0

        sent = document.createElement('div')
        sent.className = 'sent'
        sent.innerHTML = "<p>#{message.value}</p>"
        messages.appendChild(sent)

        received = document.createElement('div')
        received.className = 'received loading'
        received.innerHTML = '<p>Loading...</p>'
        messages.appendChild(received)

        try
            xhr = new XMLHttpRequest()

            xhr.open('POST', 'https://jeebot.herokuapp.com/api/ask', yes)
            xhr.onreadystatechange = () ->
                if xhr.readyState is XMLHttpRequest.DONE
                    received.classList.remove('loading')

                    if xhr.status is 200
                        received.innerHTML = xhr.responseText
                    else
                        received.classList.add('failed')
                        received.innerHTML = if xhr.responseText != "" then "<p>#{xhr.responseText}</p>" else "<p>Error #{xhr.status} encountered when trying to talk to the bot.</p>"

                    if atEnd
                        messages.scrollTop = messages.offsetHeight
                        scrollTo(document.body.offsetHeight - window.innerHeight, 10)

            xhr.send(message.value)

        catch
            received.classList.add('failed')
            received.innerHTML = "<p>Error encountered when trying to talk to the bot.</p>"

        message.value = ''
        document.getElementById('send').disabled = true
