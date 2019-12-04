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

        public AppHost host;
        public PlayController()
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
                try
                {
                    var docs = host.c_play.Find(x => x.user_id == profile.user_id).ToList();
                    return Ok(docs);
                }
                catch
                {
                    return Ok("no plays");
                }

            }
            else
            {
                return Ok("false");
            };

        }
        [HttpPut]
        public IActionResult Put([FromBody] GamePlayPut body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var profile = Profile();
                try
                {
                    var id = ObjectId.GenerateNewId().ToString();
                    var gameId = ObjectId.Parse(body.game_id).ToString();
                    host.c_play.InsertOneAsync(new GamePlay { _id = id, story = body.story, rating = body.rating, length = body.length, user_id = profile.user_id, game_id = gameId });
                    return Ok(id.ToString());
                }
                catch
                {
                    return Ok("failed");
                }
            }
            else
            {
                return Ok("false");
            }
        }
        [HttpPost]
        public IActionResult Post([FromBody] User body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            return Ok("Success");

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
                host.c_play.DeleteOne(a => a._id == id);
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
    }
}
