using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
// using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestController : ControllerBase
    {

        public AppHost host;

        public RequestController()
        {
            host = new AppHost();


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

                // var docs = c_request.Find(x => x.user_id == profile.user_id).ToList();

                // var games = c_game.Find(x => x.user_id == profile.user_id).ToList();
                // List<GameRequest> gamesls = new List<GameRequest>();

                // ls.Add(new GameRequestReturn() { mine = docs, others = games });
                // var json = JsonConvert.SerializeObject(ls);

                var query = from request in host.c_request.AsQueryable()
                            join game in host.c_game.AsQueryable() on
                            request.game_id equals game._id into game
                            select new { request, game };
                List<GameRequest> gamesls = new List<GameRequest>();
                foreach (var g in query)
                {
                    if (g.request.user_id == profile.user_id)
                    {
                        // let req = new GameRequest(g.request);
                        // req.game_name = g.game.
                        try{
                            g.request.user = GetProfile(g.request.user_id);
                        }catch{
                        }
                
                        try{
                            g.request.game = GetGame(g.game.First().atlas_id);
                        }catch{
                        }
                        gamesls.Add(g.request);
                    }
                    else
                    {
                        try
                        {
                            if (g.game.First().user_id == profile.user_id)
                            {
                                  try{
                            g.request.user = GetProfile(g.request.user_id);
                        }catch{
                        }
                
                        try{
                            g.request.game = GetGame(g.game.First().atlas_id);
                        }catch{
                        }
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
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var profile = Profile();

                var id = ObjectId.GenerateNewId().ToString();
                var gameId = ObjectId.Parse(body.game_id).ToString();
                host.c_request.InsertOneAsync(new GameRequest { _id = id, game_id = gameId, user_id = profile.user_id });
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
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();
            DateTime now = DateTime.Now;
            var id = ObjectId.Parse(requestId).ToString();
            var filter = Builders<GameRequest>.Filter.Eq(x => x._id, id);
            // Favorite
            if (body.step == "send_sent")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.send_sent, now);
                host.c_request.UpdateOneAsync(filter, update);
            }
            // 
            if (body.step == "send_recieved")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.send_recieved, now);
                host.c_request.UpdateOneAsync(filter, update);
            }

            if (body.step == "return_recieved")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.return_recieved, now);
                host.c_request.UpdateOneAsync(filter, update);
            }
            if (body.step == "return_sent")
            {
                var update = Builders<GameRequest>.Update.Set(x => x.return_sent, now);
                host.c_request.UpdateOneAsync(filter, update);
            }
            if (body.requester_rating != 0)
            {
                var update = Builders<GameRequest>.Update.Set(x => x.requester_rating, body.requester_rating);
                host.c_request.UpdateOneAsync(filter, update);
            }
            if (body.lender_rating != 0)
            {
                var update = Builders<GameRequest>.Update.Set(x => x.lender_rating, body.lender_rating);
                host.c_request.UpdateOneAsync(filter, update);
            }
              if (body.status != 0)
            {
                var update = Builders<GameRequest>.Update.Set(x => x.status, body.status);
                host.c_request.UpdateOneAsync(filter, update);
            }
             

            return Ok("success");


        }
        [HttpDelete]
        public IActionResult Delete([FromBody] GameRequestPut body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var id = ObjectId.Parse(body._id).ToString();
            if (CheckSessionId() != false)
            {
                host.c_request.DeleteOne(a => a._id == id);
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

        UserProfile GetProfile(string user_id)
        {
            return host.c_profile.Find(x => x.user_id == user_id).ToList().First();
        }
        AtlasGame GetGame(string atlas_id)
        {
            var atlas = host.c_atlas.Find(x => x.atlas_id == atlas_id).ToList().First();
            atlas.data = JsonSerializer.Deserialize<AtlasEndpoint>(atlas.cache).games.First();
            atlas.cache = null;
            return atlas;
        }
    }
}
