using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("Utility")]
    public class UtilityController : ControllerBase
    {

        public AppHost host;

        public UtilityController()
        {
            host = new AppHost();

        }
        [HttpGet]
        [Route("ImportAtlasGames")]
        public IActionResult ImportAtlasGames()
        {
            if (CheckSessionId() == true)
            {
                var api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=" + ConfigAtlas.client_id);
                var games = JsonSerializer.Deserialize<Object>(api);
                return Ok("success");
            }
            else
            {
                return Ok("Missing Key");
            }
        }

        bool CheckSessionId()
        {
            var session_id = Request.Headers["Authorization"].ToString();
            var docs = host.c_sessions.Find(x => x.session_id == session_id).ToList();
            List<UserSession> results = new List<UserSession>();
            var found = false;
            foreach (var d in docs)
            {
                if (d.session_id == session_id)
                {
                    found = true;
                }
            }
            if (found == false)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        UserProfile Profile()
        {
            var session_id = Request.Headers["Authorization"].ToString();
            var session = host.c_sessions.Find(x => x.session_id == session_id).ToList().First();
            var profile = host.c_profile.Find(x => x.user_id == session.user_id).ToList().First();

            return profile;
        }

        string randompassword()
        {
            return Slice(Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", ""), 0, 8);

        }
        string Slice(string source, int start, int end)
        {
            if (end < 0) // Keep this for negative end support
            {
                end = source.Length + end;
            }
            int len = end - start;               // Calculate length
            return source.Substring(start, len); // Return Substring of length
        }
    }
}
