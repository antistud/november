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
    public class RequestController : ControllerBase
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


        public RequestController()
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
        public IActionResult Get()
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var profile = Profile();

                // var docs = c_request.Find(x => x.user_id == profile.user_id).ToList();

                // var games = c_game.Find(x => x.user_id == profile.user_id).ToList();
                // List<GameRequest> gamesls = new List<GameRequest>();

                // ls.Add(new GameRequestReturn() { mine = docs, others = games });
                // var json = JsonConvert.SerializeObject(ls);

                var query = from request in c_request.AsQueryable()
                            join game in c_game.AsQueryable() on
                            request.game_id equals game._id into game
                            select new { request, game };
                List<GameRequest> gamesls = new List<GameRequest>();
                foreach (var g in query)
                {
                    if (g.request.user_id == profile.user_id)
                    {
                        gamesls.Add(g.request);
                    }
                    else
                    {
                        try
                        {
                            if (g.game.First().user_id == profile.user_id)
                            {
                                gamesls.Add(g.request);
                            }
                        }
                        catch { }

                    }
                }
                return Ok(gamesls);


            }
            else
            {
                return Ok("false");
            };

        }
        [HttpPut]
        public IActionResult Put([FromBody] GameRequestPut body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var profile = Profile();

                var id = ObjectId.GenerateNewId().ToString();
                var gameId = ObjectId.Parse(body.game_id).ToString();
                c_request.InsertOneAsync(new GameRequest { _id = id, game_id = gameId, user_id = profile.user_id });
                return Ok(id.ToString());

            }
            else
            {
                return Ok("false");
            }
        }
        [Route("{requestId}")]
        [HttpPost]
        public IActionResult Post([FromBody] GameRequestPost body, string requestId)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();
            DateTime now = DateTime.Now;
            var id = ObjectId.Parse(requestId).ToString();
            var filter = Builders<GameRequest>.Filter.Eq(x => x._id, id);
            // Favorite
            if (body.step == "send_sent")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.send_sent, now);
                c_request.UpdateOneAsync(filter, update);
            }
            // 
            if (body.step == "send_recieved")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.send_recieved, now);
                c_request.UpdateOneAsync(filter, update);
            }

            if (body.step == "return_recieved")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.return_recieved, now);
                c_request.UpdateOneAsync(filter, update);
            }
            if (body.step == "return_sent")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.return_sent, now);
                c_request.UpdateOneAsync(filter, update);
            }
            if (body.requester_rating != 0)
            {
                var update = Builders<GameRequest>.Update.Set(x => x.requester_rating, body.requester_rating);
                c_request.UpdateOneAsync(filter, update);
            }
            if (body.lender_rating != 0)
            {
                var update = Builders<GameRequest>.Update.Set(x => x.lender_rating, body.lender_rating);
                c_request.UpdateOneAsync(filter, update);
            }

            return Ok("success");


        }
        [HttpDelete]
        public IActionResult Delete([FromBody] GameRequestPut body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var id = ObjectId.Parse(body._id).ToString();
            if (CheckSessionId() != false)
            {
                c_request.DeleteOne(a => a._id == id);
                return Ok("true");
            }
            else
            {
                return Ok("false");
            };
        }
        public IActionResult Default()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Content-Type", "application/json");
            return Ok("Method Not Found");
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
