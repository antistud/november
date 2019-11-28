using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
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
        public IMongoCollection<GamePlay> c_play;
        public IMongoCollection<GameRequest> c_request;

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
            c_game = db.GetCollection<UserGame>("game");
            c_play = db.GetCollection<GamePlay>("play");
            c_request = db.GetCollection<GameRequest>("request");

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
                try
                {
                    var docs = c_play.Find(x => x.user_id == profile.user_id).ToList();
                    var json = JsonConvert.SerializeObject(docs);
                    return json;
                }
                catch
                {
                    return "no plays";
                }

            }
            else
            {
                return "false";
            };

        }
        [HttpPut]
        public string Put([FromBody] GamePlayPut body)
        {
            if (CheckSessionId() != false)
            {
                var profile = Profile();
                try
                {
                    var id = ObjectId.GenerateNewId();
                    var gameId = ObjectId.Parse(body.game_id);
                    c_play.InsertOneAsync(new GamePlay { _id = id, story = body.story, rating = body.rating, length = body.length, user_id = profile.user_id, game_id = gameId });
                    return id.ToString();
                }
                catch
                {
                    return "failed";
                }
            }
            else
            {
                return "false";
            }
        }
        [HttpPost]
        public string Post([FromBody] User body)
        {
            return "Success";

        }
        [HttpDelete]
        public string Delete([FromBody] UserGamePost body)
        {
            var id = ObjectId.Parse(body._id);
            if (CheckSessionId() != false)
            {
                c_play.DeleteOne(a => a._id == id);
                return "true";
            }
            else
            {
                return "false";
            };
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
