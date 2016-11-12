using Albion;

namespace Jeebot
{
    public sealed partial class Bot
    {
        [Sentence("Who are you?")]
        public string WhoAreYou() => "I'm Greg, a 17-years-old French student. Right now, you're talking to my bot, which runs on [Albion](https://github.com/6a/albion).";

        [Sentence("How old are you?")]
        public string HowOld() => "I'm 17 years old.";

        [Sentence("Is this site {_}?", "Is this website {_}?", "Is this page {_}?")]
        public string IsThisSiteSmth([Any("OpenSource", "Open-Source", "OSS")] string _)
        {
            switch (_.ToLower())
            {
                case "opensource":
                case "open-source":
                case "oss":
                    return "Yes, it is. You can find its code [here](https://github.com/6a/6a.github.io)";
                default:
                    return "Huh? Yep?";
            }
        }
    }
}
