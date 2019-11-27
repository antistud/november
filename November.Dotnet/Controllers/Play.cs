using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlayController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<User> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public string sg_apiKey;
        public SendGridClient sg_client;
        public EmailAddress sg_from;
        public IMongoCollection<UserGame> c_game;


        public PlayController()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            var host = ConfigDb.host;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/november?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<User>("user");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");
            c_game = db.GetCollection<UserGame>("play");

            //Send Grid 
            sg_apiKey = ConfigSendGrid.sendGridApi;
            sg_client = new SendGridClient(sg_apiKey);
            sg_from = new EmailAddress("jon@t3ch.net", "Example User");
        }
        [HttpGet]
        public string Get([FromQuery] GamePlay body)
        {

            return "Comeing Soon";

        }
        [HttpPut]
        public string Put([FromQuery] string email, [FromBody] string url)
        {
            return "Success";
        }
        [HttpPost]
        public string Post([FromBody] User body)
        {
            return "Success";

        }
        [HttpDelete]
        public string Delete([FromBody] User body)
        {
            return "Success";
        }
        public string Default()
        {
            return "Method Not Found";
        }

        bool CheckSessionId()
        {
            var session_id = Request.Headers["Authorization"].ToString();
            var docs = c_sessions.Find(x => x.session_id == session_id).ToList();
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
            var session = c_sessions.Find(x => x.session_id == session_id).ToList().First();
            var profile = c_profile.Find(x => x.user_id == session.user_id).ToList().First();

            return profile;
        }
    }
}
