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
    public class CollectionController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<UserAuth> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public string sg_apiKey;
        public SendGridClient sg_client;
        public EmailAddress sg_from;
        public IMongoCollection<Collection> c_collection;


        public CollectionController()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            var host = ConfigDb.host;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/november?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<UserAuth>("auth");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");
            c_collection = db.GetCollection<Collection>("collection");

            //Send Grid 
            sg_apiKey = ConfigSendGrid.sendGridApi;
            sg_client = new SendGridClient(sg_apiKey);
            sg_from = new EmailAddress("jon@t3ch.net", "Example User");
        }
        [HttpGet]
        public string Get()
        {

            if (CheckSessionId() != false)
            {

                var profile = Profile();
                var docs = c_collection.Find(x => x.user_id == profile.user_id).ToList().First();
                var json = JsonConvert.SerializeObject(docs.games);
                var games = json.Replace("\"", "").Replace("[", "").Replace("]", "");
                var api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=PaLV4upJP7&ids=" + games);
                return api;
            }
            else
            {
                return "false";
            };

        }
        [HttpPut]
        public string Put([FromQuery] string email, [FromBody] string url)
        {
            return "Success";
        }
        [HttpPost]
        public string Post([FromBody] UserAuth body)
        {
            return "Success";

        }
        [HttpDelete]
        public string Delete([FromBody] UserAuth body)
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
