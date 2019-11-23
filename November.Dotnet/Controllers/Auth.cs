using System;
using System.Collections.Generic;
using System.Linq;
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
    public class AuthController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<UserAuth> c_auth;
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
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/test?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<UserAuth>("auth");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");

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


                return JsonConvert.SerializeObject(Profile());
            }
            else
            {
                return "false";
            };

        }
        [HttpPut]
        public string Put([FromQuery] string email, [FromBody] string url)
        {
            var sg_subject = "This is going to be Fun!!!";
            var sg_to = new EmailAddress(email);
            var sg_plainTextContent = "You have requested to be a part of something special.  All you have to do now is click the link " + url;
            var sg_htmlContent = $"<strong>You have requested to be a part of something special.</strong><br>All you have to do now is click the link<br><br><a href='{url}'>Go</a>";
            var sg_msg = MailHelper.CreateSingleEmail(sg_from, sg_to, sg_subject, sg_plainTextContent, sg_htmlContent);
            var sg_response = sg_client.SendEmailAsync(sg_msg);
            return "success";
        }
        [HttpPost]
        public string Post([FromBody] UserAuth body)
        {
            var docs = c_auth.Find(x => x.username == body.username).ToList();
            var sid = "";
            List<UserAuth> results = new List<UserAuth>();
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
        [HttpDelete]
        public string Delete([FromBody] UserAuth body)
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

        Object Profile()
        {
            var session_id = Request.Headers["Authorization"].ToString();
            var session = c_sessions.Find(x => x.session_id == session_id).ToList().First();
            var profile = c_profile.Find(x => x.user_id == session.user_id).ToList().First();

            return profile;
        }
    }
}
