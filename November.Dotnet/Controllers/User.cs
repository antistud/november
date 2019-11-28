﻿using System;
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
    [Route("User")]
    public class UserController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<User> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public string sg_apiKey;
        public SendGridClient sg_client;
        public EmailAddress sg_from;


        public UserController()
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

        [HttpPost]
        public string Post([FromBody] UserProfile body)
        {
            if (CheckSessionId() != false)
            {
                var profile = Profile();
                var filter = Builders<UserProfile>.Filter.Eq(x => x.user_id, profile.user_id);

                if (body.name != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.name, body.name);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.email != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.email, body.email);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.phone != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.phone, body.phone);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.address != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.address, body.address);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.city != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.city, body.city);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.state != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.state, body.state);
                    c_profile.UpdateOneAsync(filter, update);
                }
                if (body.zip != null)
                {
                    var update = Builders<UserProfile>.Update.Set(x => x.zip, body.zip);
                    c_profile.UpdateOneAsync(filter, update);
                }
            }
            return "none";

        }
        [HttpDelete]
        public string Patch([FromBody] User body)
        {
            return "none";

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
