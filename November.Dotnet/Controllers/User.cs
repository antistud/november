using System;
using System.Collections.Generic;
using System.Linq;
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
    [Route("User")]
    public class UserController : ControllerBase
    {
        public AppHost host;

        public UserController()
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


                return Ok(Profile());
            }
            else
            {
                return Ok("false");
            };

        }

        [Route("Friends")]
        [HttpGet]
        public IActionResult GetFriends()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var profile = Profile();
                var docs = host.c_friend.Find(x => x.user_id == profile.user_id).ToList();
                List<UserFriend> friends = new List<UserFriend>();
                foreach (var f in docs)
                {
                    try
                    {
                        f.friend = GetProfileSummary(f.friend_id);
                    }
                    catch { }

                    friends.Add(f);
                }
                return Ok(docs);
            }
            else
            {
                return Ok("false");
            };

        }
        [Route("All")]
        [HttpGet]
        public IActionResult GetAll()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var docs = new List<UserProfileSummary>();
                var users = host.c_profile.Find(_ => true).ToList();
                foreach (var user in users)
                {
                    if (user.username != null && user.name != null)
                    {
                        var p = new UserProfileSummary(user);
                        docs.Add(p);
                    }

                }
                return Ok(docs);
            }
            else
            {
                return Ok("false");
            };

        }
        [Route("Friend/{id}")]
        [HttpPut]
        public IActionResult Put(string id)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();
            var friendId = ObjectId.Parse(id).ToString();
            try
            {
                var docs = host.c_friend.Find(x => x.user_id == friendId && x.friend_id == profile.user_id).ToList().First();
                return Ok("Friend Already Added");
            }
            catch
            {
                var newid = ObjectId.GenerateNewId().ToString();
                host.c_friend.InsertOneAsync(new UserFriend { _id = newid, friend_id = profile.user_id, user_id = friendId });
                var newFriedid = ObjectId.GenerateNewId().ToString();
                host.c_friend.InsertOneAsync(new UserFriend { _id = newFriedid, friend_id = friendId, user_id = profile.user_id });
                return Ok(id.ToString());
            }

        }
        [Route("Friend/{id}")]
        [HttpPost]
        public IActionResult Post(UserFriend body, string id)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            var profile = Profile();

            var friendId = ObjectId.Parse(id).ToString();

            // Favorite
            try
            {
                var friend = host.c_friend.Find(x => x.user_id == profile.user_id && x.friend_id == friendId).ToList().First();
                var filter = Builders<UserFriend>.Filter.Eq(x => x._id, friend._id);
                var update = Builders<UserFriend>.Update.Set(x => x.accepted, body.accepted);
                host.c_friend.UpdateOneAsync(filter, update);
                return Ok("success");
            }
            catch
            {
                return Ok("failed");
            }


        }

        [HttpPost]
        public IActionResult Post([FromBody] UserProfile body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            try
            {
                host.c_profile.Find(x => x.username == body.username && x.user_id != body.user_id).ToList().First();
                return Ok("Username Already Exists");
            }
            catch
            {
                if (CheckSessionId() != false)
                {
                    var profile = Profile();
                    var filter = Builders<UserProfile>.Filter.Eq(x => x.user_id, profile.user_id);

                    if (body.name != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.name, body.name);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.email != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.email, body.email);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.username != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.username, body.username);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.phone != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.phone, body.phone);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.address != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.address, body.address);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.city != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.city, body.city);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.state != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.state, body.state);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                    if (body.zip != null)
                    {
                        var update = Builders<UserProfile>.Update.Set(x => x.zip, body.zip);
                        host.c_profile.UpdateOneAsync(filter, update);
                    }
                }
                return Ok("Success");

            }


        }
        [HttpDelete]
        public IActionResult Patch([FromBody] User body)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            return Ok("none");

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
        UserProfileSummary GetProfileSummary(string user_id)
        {
            return new UserProfileSummary(host.c_profile.Find(x => x.user_id == user_id).ToList().First());
        }
    }
}
