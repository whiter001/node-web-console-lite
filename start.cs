// csc /target:winexe start.cs
using System;
using System.Diagnostics;
namespace Rpc
{
    class Test
    {
        static void Main()
        {
            ProcessStartInfo info = new ProcessStartInfo("cmd","/k node watcher.js");
            info.CreateNoWindow = true;
            info.UseShellExecute = false;
            Process.Start(info);
        }
    }
}
