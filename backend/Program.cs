using System;

namespace Jeebot
{
    class Program
    {
        static Bot Server;

        static void Main(string[] args)
        {
            Server = new Bot();
            Console.ReadKey(true);
        }
    }
}
