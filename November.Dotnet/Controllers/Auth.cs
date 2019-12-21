using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("Auth")]
    public class AuthController : ControllerBase
    {

        public AppHost host;

        public AuthController()
        {
            host = new AppHost();

        }
        [HttpGet]
        public IActionResult Get()
        {

            if (CheckSessionId() != false)
            {
                return Ok(Profile());
            }
            else
            {
                return Ok("false");
            };

        }
        [HttpPut]
        [Route("Reset")]
        public IActionResult PutReset([FromBody] UserPutReset body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                try
                {
                    var profile = Profile();
                    var user = host.c_auth.Find(x => x._id == profile.user_id).ToList().First();
                    var filter = Builders<User>.Filter.Eq(x => x._id, profile.user_id);
                    if (user.hash == UserPassword.HashPassword(body.password))
                    {
                        try
                        {
                            var passwordRegex = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$";
                            Regex rgx = new Regex(passwordRegex);
                            if (rgx.IsMatch(body.newpassword) == true)
                            {


                                var update = Builders<User>.Update.Set(x => x.hash, UserPassword.HashPassword(body.newpassword));
                                host.c_auth.UpdateOneAsync(filter, update);
                                try
                                {
                                    host.c_sessions.DeleteMany(a => a.user_id == profile.user_id);
                                }
                                catch
                                {

                                }

                                return Ok("password updated");
                            }
                            else
                            {
                                return Ok($"does not match REGEX:  {passwordRegex}");
                            }
                        }
                        catch
                        {
                            return Ok("password not updated");
                        }

                    }
                    else
                    {
                        return Ok("password does not match");
                    }
                }
                catch
                {
                    return Ok("User does not exist");
                }
            }
            else
            {
                return Ok("missing or wrong session id");
            }

        }
        [HttpPut]
        public IActionResult Put([FromBody] UserPut body)
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");

            if (CheckSessionId() != false)
            {
                var emailPattern = @"\b[\w\.-]+@[\w\.-]+\.\w{2,10}\b";
                Regex rgx = new Regex(emailPattern);
                if (rgx.IsMatch(body.email) == true)
                {
                    try
                    {
                        var docs = host.c_auth.Find(x => x.username.ToLower() == body.email.ToLower()).ToList().First();
                        return Ok("User Already Exists");
                    }
                    catch
                    {
                        var profile = Profile();
                        var id = ObjectId.GenerateNewId().ToString();
                        var password = randompassword();
                        host.c_auth.InsertOneAsync(new User { _id = id, username = body.email.ToLower(), hash = UserPassword.HashPassword(password) });
                        host.c_profile.InsertOneAsync(new UserProfile { user_id = id, username = randomUsername(), email = body.email.ToLower() });
                        host.c_friend.InsertOneAsync(new UserFriend { user_id = id, friend_id = profile.user_id });
                        var sg_subject = "This is going to be Fun!!!";
                        var sg_to = new EmailAddress(body.email.ToLower());
                        var sg_plainTextContent = "You have been invited to BoxShare username: " + body.email.ToLower() + " password: " + password + " URL: http://app.garishgames.com?e=" + body.email.ToLower() + "&p=" + password;
                        var sg_htmlContent = $"<strong>You have been invited to BoxShare.</strong><br><br>username: " + body.email.ToLower() + "<br>password: " + password + " <br><br> <a href='http://app.garishgames.com?e=" + body.email.ToLower() + "&p=" + password + "'>Go Now</a>";
                        var sg_msg = MailHelper.CreateSingleEmail(host.sg_from, sg_to, sg_subject, sg_plainTextContent, sg_htmlContent);
                        var sg_response = host.sg_client.SendEmailAsync(sg_msg);
                        sg_response.ToJson();
                        return Ok("success");
                    }
                }
                else
                {
                    return Ok($"{body.email} is not an email");
                }
            }
            else
            {
                return Ok("You must be logged in to create a user");
            }

        }

        [HttpPost]
        public IActionResult Post([FromBody] User body)
        {
            var docs = host.c_auth.Find(x => x.username.ToLower() == body.username.ToLower()).ToList();
            var sid = "";
            List<User> results = new List<User>();
            var found = false;
            foreach (var d in docs)
            {
                if (d.hash == UserPassword.HashPassword(body.password))
                {
                    sid = CreateSessionId();
                    DateTime now = DateTime.Now;

                    host.c_sessions.InsertOneAsync(new UserSession { username = body.username, session_id = sid, user_id = d._id, created = now });
                    found = true;
                }
            }
            if (found == false)
            {
                return Ok("missing or wrong password");
            }
            else
            {

                return Ok(sid);
            }

        }

        // [HttpPatch]
        // public IActionResult Patch([FromBody] User body)
        // {
        //     Response.Headers.Add("Access-Control-Allow-Origin", "*");
        //     Response.Headers.Add("Access-Control-Allow-Headers", "*");
        //     Response.Headers.Add("Content-Type", "application/json");
        //     return Ok(UserPassword.HashPassword(body.password));

        // }
        [HttpDelete]
        public IActionResult Delete()
        {

            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Content-Type", "application/json");
            if (CheckSessionId() != false)
            {
                var session_id = Request.Headers["Authorization"];
                host.c_sessions.DeleteOne(a => a.session_id == session_id);
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
        string CreateSessionId()
        {

            Guid guid = Guid.NewGuid();
            string str = guid.ToString();
            return str;
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
        string randomUsername()
        {
            return Slice(Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", ""), 0, 5).ToLower();
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
