using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using SendGrid;
using SendGrid.Helpers.Mail;
using MongoDB.Bson.Serialization;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("Game")]
    public class GameController : ControllerBase
    {

        public AppHost host;
        public GameController()
        {

            host = new AppHost();

        }



        [HttpGet]
        public IActionResult Get([FromQuery] bool atlas)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {

                var profile = Profile();
                try
                {
                    var docs = host.c_game.Find(x => x.user_id == profile.user_id).ToList();
                    var games = new List<UserGame>();
                    foreach (var doc in docs)
                    {
                        if (atlas == true)
                        {

                            try
                            {
                                var cache = host.c_atlas.Find(x => x.atlas_id == doc.atlas_id).ToList().First().cache;
                                doc.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(cache).games.First();

                            }
                            catch
                            {
                                var atlas_api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=" + ConfigAtlas.client_id + "&ids=" + doc.atlas_id);
                                doc.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(atlas_api).games.First();
                                host.c_atlas.InsertOneAsync(new AtlasGame { atlas_id = doc.atlas_id, cache = atlas_api });
                            }
                        }
                        games.Add(doc);
                    }
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
        [HttpPut]
        public IActionResult Put([FromBody] UserGame body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();

            try
            {
                var docs = host.c_game.Find(x => x.user_id == profile.user_id && x.atlas_id == body.atlas_id).ToList().First();
                return Ok("Game Already Added");
            }
            catch
            {

                try
                {
                    var atlas_game = host.c_atlas.Find(x => x.atlas_id == body.atlas_id).ToList().First().cache;
                }
                catch
                {
                    var api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=" + ConfigAtlas.client_id + "&ids=" + body.atlas_id);
                    host.c_atlas.InsertOneAsync(new AtlasGame { atlas_id = body.atlas_id, cache = api });
                }

                var id = ObjectId.GenerateNewId().ToString();
                host.c_game.InsertOneAsync(new UserGame { _id = id, atlas_id = body.atlas_id, user_id = profile.user_id });
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
                host.c_game.UpdateOneAsync(filter, update);
            }
            // 
            if (body.atlas_id != null)
            {
                var update = Builders<UserGame>.Update.Set(x => x.atlas_id, body.atlas_id);
                host.c_game.UpdateOneAsync(filter, update);
            }

            if (body.bgg_id != null)
            {
                var update = Builders<UserGame>.Update.Set(x => x.bgg_id, body.bgg_id);
                host.c_game.UpdateOneAsync(filter, update);
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
                host.c_game.DeleteOne(a => a._id == id);
                return Ok("true");
            }
            else
            {
                return Ok("false");
            };
        }

        [Route("Friends")]
        [HttpGet]
        public IActionResult GetFriendGames([FromQuery] bool atlas)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();
            var query = from friend in host.c_friend.AsQueryable()
                        join game in host.c_game.AsQueryable() on
                        friend.friend_id equals game.user_id into game
                        select new { friend, game };

            List<UserGame> gamesls = new List<UserGame>();
            foreach (var q in query)
            {
                if (q.friend.user_id == profile.user_id)
                {
                    foreach (var g in q.game)
                    {
                        if (atlas == true)
                        {

                            try
                            {
                                var cache = host.c_atlas.Find(x => x.atlas_id == g.atlas_id).ToList().First().cache;
                                g.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(cache).games.First();

                            }
                            catch
                            {
                                var atlas_api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=" + ConfigAtlas.client_id + "&ids=" + g.atlas_id);
                                g.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(atlas_api).games.First();
                                host.c_atlas.InsertOneAsync(new AtlasGame { atlas_id = g.atlas_id, cache = atlas_api });
                            }
                        }
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
                    var docs = host.c_game.Find(x => x._id == game_id).ToList().First();
                    if (atlas == true)
                    {

                        var atlas_game = new AtlasGame();
                        try
                        {
                            var cache = host.c_atlas.Find(x => x.atlas_id == docs.atlas_id).ToList().First().cache;
                            docs.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(cache).games.First();

                        }
                        catch
                        {
                            var atlas_api = new WebClient().DownloadString("https://www.boardgameatlas.com/api/search?client_id=" + ConfigAtlas.client_id + "&ids=" + docs.atlas_id);
                            docs.atlas = JsonSerializer.Deserialize<AtlasEndpoint>(atlas_api).games.First();
                            host.c_atlas.InsertOneAsync(new AtlasGame { atlas_id = docs.atlas_id, cache = atlas_api });
                        }

                    }
                    if (play == true)
                    {
                        try
                        {
                            var playReturn = from q_play in host.c_play.AsQueryable()
                                             join q_profile in host.c_profile.AsQueryable() on
                                             q_play.user_id equals q_profile.user_id into q_profile

                                             select new { q_play, q_profile };

                            List<GamePlayDetail> playls = new List<GamePlayDetail>();

                            foreach (var r in playReturn)
                            {
                                if (r.q_play.game_id == game_id)
                                {
                                    var req = new GamePlayDetail(r.q_play);
                                    try
                                    {
                                        var user = r.q_profile.ToList().First();
                                        req.user_username = user.username;
                                        req.user_name = user.name;
                                    }
                                    catch
                                    {
                                    }
                                    playls.Add(req);
                                }

                            }
                            docs.play = playls;
                        }
                        catch
                        {

                        }
                    }
                    if (request == true)
                    {
                        try
                        {
                            // host.c_request.Find(x => x.game_id == game_id).ToList();
                            var requestReturn = from q_request in host.c_request.AsQueryable()
                                                join q_profile in host.c_profile.AsQueryable() on
                                                q_request.user_id equals q_profile.user_id into q_profile

                                                select new { q_request, q_profile };

                            List<GameRequestDetail> requestls = new List<GameRequestDetail>();

                            foreach (var r in requestReturn)
                            {
                                if (r.q_request.game_id == game_id)
                                {
                                    var req = new GameRequestDetail(r.q_request);
                                    try
                                    {
                                        var user = r.q_profile.ToList().First();
                                        req.user_username = user.username;
                                        req.user_name = user.name;
                                    }
                                    catch
                                    {
                                    }
                                    requestls.Add(req);
                                }

                            }
                            docs.request = requestls;
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
