using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
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
    [Route("Auth")]
    public class AuthController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<User> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public string sg_apiKey;
        public SendGridClient sg_client;
        public EmailAddress sg_from;


        public AuthController()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            var host = ConfigDb.host;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/november?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<User>("user");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");

            //Send Grid 
            sg_apiKey = ConfigSendGrid.sendGridApi;
            sg_client = new SendGridClient(sg_apiKey);
            sg_from = new EmailAddress("noreply@garishgames.com", "Garish Games");
        }
        [HttpGet]
        public string Get()
        {
            if (CheckSessionId() != false)
            {


                return JsonConvert.SerializeObject(Profile());
            }
            else
            {
                return "false";
            };

        }
        [HttpPut]
        public string Put([FromBody] UserPut body)
        {
            // var sg_subject = "This is going to be Fun!!!";
            // var sg_to = new EmailAddress(body.email);
            // var sg_plainTextContent = "You have requested to be a part of something special.  All you have to do now is click the link " + body.url;
            // var sg_htmlContent = $"<strong>You have requested to be a part of something special.</strong><br>All you have to do now is click the link<br><br><a href='{body.url}'>Go</a>";
            // var sg_msg = MailHelper.CreateSingleEmail(sg_from, sg_to, sg_subject, sg_plainTextContent, sg_htmlContent);
            // var sg_response = sg_client.SendEmailAsync(sg_msg);
            if (CheckSessionId() != false)
            {

                try
                {
                    var docs = c_auth.Find(x => x.username == body.email).ToList().First();
                    return "User Already Added";
                }
                catch
                {
                    var id = ObjectId.GenerateNewId();
                    var password = randompassword();
                    c_auth.InsertOneAsync(new User { _id = id, username = body.email, hash = UserPassword.HashPassword(password) });
                    var sg_subject = "This is going to be Fun!!!";
                    var sg_to = new EmailAddress(body.email);
                    var sg_plainTextContent = "You have been invited to BoxShare username: " + body.email + " password: " + password;
                    var sg_htmlContent = $"<strong>You have been invited to BoxShare.</strong><br><br>username: " + body.email + "<br>password: " + password + "";
                    var sg_msg = MailHelper.CreateSingleEmail(sg_from, sg_to, sg_subject, sg_plainTextContent, sg_htmlContent);
                    var sg_response = sg_client.SendEmailAsync(sg_msg);
                    sg_response.ToJson();
                    return "success";
                }
            }
            else
            {
                return "You must be logged in to create a user";
            }

        }
        [HttpPut]
        [Route("Reset")]
        public string PutReset([FromBody] User body)
        {
            try
            {
                c_auth.Find(x => x.username == body.username).ToList().First();
                return "user already exists";
            }
            catch
            {
                c_auth.InsertOneAsync(new User { username = body.username });
                return "success";
            }

        }
        [HttpPost]
        public string Post([FromBody] User body)
        {
            var docs = c_auth.Find(x => x.username == body.username).ToList();
            var sid = "";
            List<User> results = new List<User>();
            var found = false;
            foreach (var d in docs)
            {
                if (d.hash == UserPassword.HashPassword(body.password))
                {
                    sid = CreateSessionId();
                    DateTime now = DateTime.Now;

                    c_sessions.InsertOneAsync(new UserSession { username = body.username, session_id = sid, user_id = d._id, created = now });
                    found = true;
                }
            }
            if (found == false)
            {
                return "missing or wrong password";
            }
            else
            {

                return sid;
            }

        }
        [HttpPatch]
        public string Patch([FromBody] User body)
        {
            return UserPassword.HashPassword(body.password);

        }
        [HttpDelete]
        public string Delete()
        {

            if (CheckSessionId() != false)
            {
                var session_id = Request.Headers["Authorization"];
                c_sessions.DeleteOne(a => a.session_id == session_id);
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
        string CreateSessionId()
        {

            Guid guid = Guid.NewGuid();
            string str = guid.ToString();
            return str;
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
