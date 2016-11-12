using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Albion;
using Markdig;

namespace Jeebot
{
    public sealed partial class Bot
    {
        public readonly HttpListener Listener;
        public readonly Engine Engine;

        public Bot()
        {
            Engine = new Engine();
            Engine.Register(this);

            Listener = new HttpListener();
            Listener.Prefixes.Add("http://*:8080/");
            Listener.Start();

            Listener.GetContextAsync().ContinueWith(task => Respond(task.Result));
        }

        private async Task Respond(HttpListenerContext ctx)
        {
            ctx.Response.Headers.Remove(HttpResponseHeader.Server);
            ctx.Response.Headers.Remove(HttpResponseHeader.Date);

#if DEBUG
            ctx.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
#else
            ctx.Response.Headers.Add("Access-Control-Allow-Origin", "https://6a.github.io");
#endif

            if (!ctx.Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase))
            {
                ctx.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                ctx.Response.Close(Encoding.UTF8.GetBytes("Invalid request (expected POST)."), false);
            }
            else if (ctx.Request.ContentLength64 > 200)
            {
                ctx.Response.StatusCode = (int)HttpStatusCode.RequestEntityTooLarge;
                ctx.Response.Close(Encoding.UTF8.GetBytes("Request message too large (over 200 bytes)."), false);
            }
            else
            {
                string input = await ReadInput(ctx.Request);

                if (string.IsNullOrWhiteSpace(input))
                {
                    ctx.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    ctx.Response.Close(Encoding.UTF8.GetBytes("Invalid request (empty)."), false);
                }
                else
                {
                    Answer<string> answer = Engine.Ask<string>(input);

                    if (answer == null)
                    {
                        ctx.Response.StatusCode = (int)HttpStatusCode.NotFound;
                        ctx.Response.Close(Encoding.UTF8.GetBytes("No answer could be found."), false);
                    }
                    else
                    {
                        ctx.Response.StatusCode = (int)HttpStatusCode.OK;
                        ctx.Response.Close(Encoding.UTF8.GetBytes(Markdown.ToHtml(answer.IsAsync ? await answer.CallAsync() : answer.Call())), false);
                    }
                }
            }

            await Listener.GetContextAsync().ContinueWith(async task => await Respond(task.Result));
        }

        private async static Task<string> ReadInput(HttpListenerRequest req)
        {
            using (StreamReader sr = new StreamReader(req.InputStream))
            {
                return await sr.ReadToEndAsync();
            }
        }
    }
}
