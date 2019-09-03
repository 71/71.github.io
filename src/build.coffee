fs     = require 'fs'
pug    = require 'pug'
stylus = require 'stylus'


link = (link, text) ->
  "<a href=\"#{link}\" target=\"_blank\" rel=\"noopener noreferrer\">#{text}</a>"

plink = (project, text) ->
  link("https://github.com/71/#{project}", text)


categories = [
  'education'
  'experience'
  'languages'
  'life'
  'programming'
  'projects'
]

eventsSources =
  life: '''
    - 1999-10-21: Born in France.
  '''

  languages: '''
    - 2001-01: French, native.
    - 2007-09: German, elementary.
    - 2010-09: English, fluent.
    - 2018-07: Korean, lower intermediate.
  '''

  education: '''
    - 2014-09-01 to 2017-07-01: Lycée George de la Tour, Metz, France.
    - 2017-09-01 to 2022-07-01: [EPITA](https://www.epita.fr), Paris Area, France.
    - 2019-03-02 to 2019-06-23: [Sejong University](http://www.sejong.ac.kr), Seoul, Republic of Korea.
  '''

  experience: '''
    - 2018-06-14 to 2018-08-23: Internship at [LRDE](https://www.lrde.epita.fr),
        Created a pattern-based LTL formula rewriting engine for Spot. 5,000 lines added.
    - 2019-01-07 to 2019-02-28: Internship at [IRIF](https://www.irif.fr),
        Implementation of a type checker for a toy programming language with type inference,
        with the help of the Inferno OCaml library, which had to be extended for the toy language
        to support polymorphic recursion.
    - 2019-09-02 to 2022-09-02: Apprenticeship at [Google France](https://about.google),.
  '''

  programming: '''
    - 2012-11: [HTML](repos:html), [CSS](repos:css), [JavaScript](repos:javascript), Batch.
    - 2013-05: [C#](repos:csharp).
    - 2017-09: OCaml.
    - 2017-11: Haskell, [F#](repos:fsharp).
  '''

  projects: '''
    - 2013-10-20: Albion, C#, Basic natural language processing in C#.
    - 2016-10-20: Styx (styx-history), Rust, Simple programming language targeting x86.
    - 2017-07-01: Ryder, C#, Runtime redirection of method calls.
    - 2017-07-14: Cometary, C#, Compiler plugins in C#.
    - 2018-02-17: Wake, Kotlin, Minimalistic Markdown editor for Android.
    - 2018-07-26: Fast.Fody, F#, Fast and easy modifications of .NET assemblies.
    - 2018-10-12: lesspass.kt, Kotlin, LessPass client for Android.
    - 2019-04-04: Dance, TypeScript, Kakoune keybindings for VS Code.
  '''


events = []
months =
  en: ['Jan', 'Feb', 'Mar' , 'Apr'  , 'May', 'Jun' , 'Jul' , 'Aug' , 'Sept', 'Oct', 'Nov', 'Dec']
  fr: ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Déc']
  ko: "#{mth}월" for mth in [1..12]

o = (type, regex, map) ->
  source = eventsSources[type]
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, text, ref) -> link(ref, text))
    .replace(/project:(\w+)/g, 'https://github.com/71/$1')
    .replace(/repos:(\w+)/g, 'https://github.com/71?tab=repositories&language=$1')

  while (match = regex.exec source)
    result = map match

    if result.bar?
      events.push { result..., type, date: new Date(result.start), start: new Date(result.start), end: new Date(result.end) }
    else
      events.push { result..., type, date: new Date(match[1]) }


do ->
  o 'life'       , /^- ([\d-]+): (.+)$/gm                          , ([ _, date, title ]) -> { title }

  o 'languages'  , /^- ([\d-]+): (.+?), (.+)\.$/gm                 , ([ _, date, title, proficiency ]) -> { title: "#{title} (#{proficiency}).", descr: "Started learning #{title}" }

  o 'education'  , /^- ([\d-]+) to ([\d-]+): (.+)$/gm              , ([ _, start, end, title ]) -> { start, end, title, bar: 0 }

  o 'experience' , /^- ([\d-]+) to ([\d-]+): (.+),([\s\S]*?\.)$/gm , ([ _, start, end, title, descr ]) => { start, end, title: title + '.', descr: (if descr != '.' then descr else null), bar: 1 }

  o 'programming', /^- ([\d-]+): (.+)$/gm                          , ([ _, date, title ]) => { title }

  o 'projects'   , /^- ([\d-]+): (.+?)(?: \((.+?)\))?, (.+?), (.+)$/gm, ([ _, date, title, url, lang, descr ]) => { title: plink(url or title, title) + '.', lang, descr }


  events.sort((a, b) -> a.date.valueOf() - b.date.valueOf())

  for event, i in events
    event.nth = i


exports.build = ->
  style = fs.readFileSync './index.styl', 'utf-8'

  stylus style
    .set 'filename', __dirname + '/index.styl'
    .render (err, css) ->
      fs.writeFileSync '../index.css', css


  bars = [null, null, null, null]
  timeline = { years: [], months: [], events: [] }

  offset = 0
  skipped = false

  for yr in [1999..2020]
    skipYear = true
    year = { year: yr, fr: ''+yr, en: ''+yr, ko: ''+yr, offset, months: [] }

    for mth in (if yr == 1999 then [9..11] else [0..11])
      skipMonth = true
      month = { month: mth, fr: months.fr[mth], en: months.en[mth], ko: months.ko[mth], offset, events: [] }

      for bar, i in bars when bar?
        if 1900 + bar.end.getYear() == yr and bar.end.getMonth() == mth
          if skipMonth
            skipMonth = false
            offset += 1

          bar.length = offset - bar.offset
          bars[i] = null

      for event in events when 1900 + event.date.getYear() == yr and event.date.getMonth() == mth
        event.offset = offset

        if skipMonth
          skipMonth = false

        if event.bar?
          if bars[event.bar]
            event.bar = bars.indexOf(null)

          bars[event.bar] = event
        else
          event.bar = bars.indexOf(null)

        timeline.events.push(event)
        offset += 1

      if skipMonth
        continue
      #   if timeline.months.length > 0 and timeline.months[timeline.months.length - 1].skip
      #     timeline.months[timeline.months.length - 1].skip += 1

      #     continue
      #   else
      #     month = { offset, skip: 1 }
      #     offset += 1
      else
        skipYear = false

      year.months.push(month)
      timeline.months.push(month)

    if skipYear
      continue
    #   if timeline.years.length > 0 and timeline.years[timeline.years.length - 1].skip
    #     timeline.years[timeline.years.length - 1].skip += 1

    #     continue
    #   else
    #     offset += 1
    #     year = { offset, skip: 1 }
    #     offset += 1

    timeline.years.push(year)
    offset += 1

  for bar, i in bars when bar?
    bar.length = offset - bar.offset

  timeline.length = offset

  fs.writeFileSync '../index.html', pug.renderFile 'index.pug',
    categories: categories
    timeline  : timeline
