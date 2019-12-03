using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
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
    [EnableCors("AllowAllOrigins")]
    [Route("Game")]
    public class GameController : ControllerBase
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
        public IMongoCollection<UserFriend> c_friend;
        public GameController()
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
            c_friend = db.GetCollection<UserFriend>("friend");

            //Send Grid 
            sg_apiKey = ConfigSendGrid.sendGridApi;
            sg_client = new SendGridClient(sg_apiKey);
            sg_from = new EmailAddress("jon@t3ch.net", "Example User");
        }

        [HttpGet]
        public IActionResult Get()
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {

                var profile = Profile();
                try
                {
                    var docs = c_game.Find(x => x.user_id == profile.user_id).ToList();
                    var json = JsonConvert.SerializeObject(docs);
                    return Ok(docs);
                }
                catch
                {
                    return Ok("No Games");
                }

            }
            else
            {
                return Ok("fail");
            };

        }
        [Route("Friends")]
        [HttpGet]
        public IActionResult GetFriendGames()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();
            var query = from friend in c_friend.AsQueryable()
                        join game in c_game.AsQueryable() on
                        friend.friend_id equals game.user_id into game
                        select new { friend, game };

            List<UserGame> gamesls = new List<UserGame>();
            foreach (var q in query)
            {
                if (q.friend.user_id == profile.user_id)
                {
                    foreach (var g in q.game)
                    {
                        gamesls.Add(g);
                    }

                }
            }

            return Ok(gamesls);
        }
        [Route("{gameId}")]
        [HttpGet]
        public IActionResult GetId(string gameId, [FromQuery] bool atlas, [FromQuery] bool play, [FromQuery] bool request)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var game_id = ObjectId.Parse(gameId).ToString();
            if (CheckSessionId() != false)
            {

                var profile = Profile();
                try
                {
                    var docs = c_game.Find(x => x._id == game_id).ToList().First();
                    if (atlas == true)
                    {
                        try
                        {
                            var api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=PaLV4upJP7&ids=" + docs.atlas_id);
                            docs.atlas = JsonConvert.DeserializeObject(api);
                        }
                        catch
                        {

                        }
                    }
                    if (play == true)
                    {
                        try
                        {
                            docs.play = c_play.Find(x => x.game_id == game_id).ToList().First();
                        }
                        catch
                        {

                        }
                    }
                    if (request == true)
                    {
                        try
                        {
                            docs.request = c_request.Find(x => x.game_id == game_id).ToList().First();
                        }
                        catch
                        {

                        }
                    }
                    return Ok(docs);
                }
                catch
                {
                    return Ok("no games");
                }

            }
            else
            {
                return Ok("false");
            };
        }
        [HttpPut]
        public IActionResult Put([FromBody] UserGame body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();

            try
            {
                var docs = c_game.Find(x => x.user_id == profile.user_id && x.atlas_id == body.atlas_id).ToList().First();
                return Ok("Game Already Added");
            }
            catch
            {
                var id = ObjectId.GenerateNewId().ToString();
                c_game.InsertOneAsync(new UserGame { _id = id, atlas_id = body.atlas_id, user_id = profile.user_id });
                return Ok(id.ToString());
            }


        }
        [HttpPost]
        public IActionResult Post([FromBody] UserGamePost body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();

            var id = ObjectId.Parse(body._id).ToString();
            var filter = Builders<UserGame>.Filter.Eq(x => x._id, id);
            // Favorite
            if (body.favorite == true)
            {
                var update = Builders<UserGame>.Update.Set(x => x.favorite, true);
                c_game.UpdateOneAsync(filter, update);
            }
            // 
            if (body.atlas_id != null)
            {
                var update = Builders<UserGame>.Update.Set(x => x.atlas_id, body.atlas_id);
                c_game.UpdateOneAsync(filter, update);
            }

            if (body.bgg_id != null)
            {
                var update = Builders<UserGame>.Update.Set(x => x.bgg_id, body.bgg_id);
                c_game.UpdateOneAsync(filter, update);
            }


            return Ok("success");



        }
        [HttpDelete]
        public IActionResult Delete([FromBody] UserGamePost body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var id = ObjectId.Parse(body._id).ToString();
            if (CheckSessionId() != false)
            {
                c_game.DeleteOne(a => a._id == id);
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
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
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
