fs     = require 'fs'
pug    = require 'pug'
stylus = require 'stylus'


link = (link, text) ->
  "<a href=\"#{link}\" target=\"_blank\" rel=\"noopener noreferrer\">#{text}</a>"

plink = (project, text) ->
  link("https://github.com/71/#{project}", text)

en_fr_ko = (en, fr, ko) ->
  ("<span class=#{lang}>#{text}</span>" for lang, text of { en, fr, ko } when text?).join("")


categories = [
  'education'
  'experience'
  'languages'
  'life'
  'programming'
  'projects'
]

eventsSources =
  life: """
    - 1999-10-21: #{en_fr_ko("Born in France", "Né en France", "프랑스에서 태어났습니다")}.
  """

  languages: """
    - 2001-01: #{en_fr_ko("French", "Français", "프랑스어")}, #{en_fr_ko("native", "natif", "원어민")}.
    - 2007-09: #{en_fr_ko("German", "Allemand", "독일어")}, #{en_fr_ko("elementary", "élémentaire", "초급")}.
    - 2010-09: #{en_fr_ko("English", "Anglais", "영어")}, #{en_fr_ko("fluent", "courant", "능숙")}.
    - 2018-07: #{en_fr_ko("Korean", "Coréen", "한국어")}, #{en_fr_ko("lower intermediate", "intermédiaire inférieur", "중급")}.
    - 2019-11: #{en_fr_ko("Japanese", "Japonais", "일본어")}, #{en_fr_ko("elementary", "élémentaire", "초급")}.
  """

  education: """
    - 2014-09-01 to 2017-07-01: Lycée George de la Tour, Metz, #{en_fr_ko("France", "France", "프랑스")}.
    - 2017-09-01 to 2022-07-01: [EPITA](https://www.epita.fr), #{en_fr_ko("Paris Area", "région parisienne", "파리 지역")}, #{en_fr_ko("France", "France", "프랑스")}.
    - 2019-03-02 to 2019-06-23: [#{en_fr_ko("Sejong University", "Sejong University", "세종대학교")}](http://www.sejong.ac.kr), #{en_fr_ko("Seoul, Republic of Korea", "Séoul, République de Corée", "서울, 대한민국")}.
  """

  experience: """
    - 2018-06-14 to 2018-08-23: #{en_fr_ko("Internship at the ", "Stage au ")}[LRDE](https://www.lrde.epita.fr)<span class=ko>에서 인턴십</span>,
        Created a pattern-based LTL formula rewriting engine for Spot. 5,000 lines added.
    - 2019-01-07 to 2019-02-28: #{en_fr_ko("Internship at ", "Stage à l'")}[IRIF](https://www.irif.fr)<span class=ko>에서 인턴십</span>,
        Implementation of a type checker for a toy programming language with type inference,
        with the help of the Inferno OCaml library, which had to be extended for the toy language
        to support polymorphic recursion.
    - 2019-09-02 to 2022-09-02: #{en_fr_ko("Apprenticeship at ", "Apprentissage à ")}[Google France](https://about.google)<span class=ko>에서 견습</span>,.
  """

  programming: '''
    - 2012-11: [HTML](repos:html), [CSS](repos:css), [JavaScript](repos:javascript), Batch.
    - 2013-05: [C#](repos:csharp).
    - 2016-08: [Rust](repos:rust).
    - 2017-09: OCaml.
    - 2017-11: Haskell, [F#](repos:fsharp).
    - 2018-06: C, C++, Java.
    - 2019-10: [Go](repos:go).
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
    - 2020-04-10: stadiacontroller, Go, Full support for the Google Stadia controller on Windows.
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

  o 'languages'  , /^- ([\d-]+): (.+?), (.+)\.$/gm                 , ([ _, date, title, proficiency ]) -> { title: "#{title} (#{proficiency})." }

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

  for yr in [1999..2021]
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
        if timeline.months.length > 0 and timeline.months[timeline.months.length - 1].skip
          continue
        else
          month = { offset, skip: 1 }
          offset += 1
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

    if year.months[year.months.length - 1].skip
      offset -= 1

    timeline.years.push(year)
    offset += 1

  for bar, i in bars when bar?
    bar.length = offset - bar.offset

  timeline.length = offset

  fs.writeFileSync '../index.html', pug.renderFile 'index.pug',
    categories: categories
    timeline  : timeline
