inherits = (el, className) ->
    el? and (el.classList.contains(className) or inherits(el.parentElement, className))

$ = document.querySelector
$$ = document.querySelectorAll

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
    time          = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8))

    tick = () ->
        currentTime += 1 / 60
        p = currentTime / time
        t = (-0.5 * (Math.cos(Math.PI * pos) - 1))

        if p < 1
            requestAnimationFrame(tick)
            window.scrollTo(0, currentScroll + ((scrollTarget - currentScroll) * t))
        else
            window.scrollTo(0, scrollTarget)

    tick()

document.onclick = (e) ->    
    if inherits(e.target, 'interactive')

    else if inherits(e.target, 'close')

    else


ready = () ->
    originalMailTo = document.getElementById('mail').href

    document.getElementById('message').onchange = (e) ->
        document.getElementById('mail').href = originalMailTo + '&body=' + encodeURIComponent(e.target.value)
