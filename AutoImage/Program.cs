using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Net;

namespace AutoImage
{
    class Program
    {
        static void Main(string[] args)
        {
            new Program().Start();
        }

        public Regex UidRegex { get; set; }

        void Start()
        {
            var pattern = "all;\">([0-9A-Za-z.]+)</strong>.+?uid%3D(.+?)\"";
            UidRegex = new Regex(pattern);

            var sources = Enumerable.Range(0, 11);
            foreach (var source in sources)
            {
                Directory.CreateDirectory("Image/" + source);
                ProcessFile(File.ReadAllText("Source/" + source + ".txt"), source.ToString());
            }
        }

        void ProcessFile(string mailContent, string d)
        {
            var startFormat = "Content-Type: text/html; charset=UTF-8" + Environment.NewLine
                + "Content-Transfer-Encoding: base64";
            var endFormat = "------=_Part";
            var startIndex = mailContent.IndexOf(startFormat);
            var endIndex = mailContent.IndexOf(endFormat, startIndex);
            var start = startIndex + startFormat.Length;
            var end = endIndex;
            var base64 = mailContent.Substring(start, end - start).Trim().Replace(Environment.NewLine, "");
            var bytes = Convert.FromBase64String(base64);
            var html = Encoding.UTF8.GetString(bytes);

            var matches = UidRegex.Matches(html);

            List<Tuple<string, string>> tasks = new List<Tuple<string, string>>();

            foreach (Match match in matches)
            {
                var uid = match.Groups[2];
                var format = "http://bigmail.mail.daum.net/Mail-bin/bigfile_down?uid={0}";
                var href = string.Format(format, uid);
                var name = match.Groups[1].Value;

                tasks.Add(new Tuple<string, string>(href, name));
                Console.WriteLine(href);
                Console.WriteLine();
                Console.WriteLine(name);
                Console.WriteLine();
            }

            Parallel.ForEach(tasks, new Action<Tuple<string, string>>((tuple) =>
            {
                var href = tuple.Item1;
                var name = tuple.Item2;
                var client = new WebClient();

                Console.WriteLine(name + " 시작");
                client.DownloadFile(href, "Image/" + d + "/" + name);
                Console.WriteLine(name + " 종료");
            }));
        }
    }
}
