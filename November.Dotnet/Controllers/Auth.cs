﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace November.Dotnet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<User> collection;
        public AuthController()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@cluster0-a2vtd.gcp.mongodb.net/test?retryWrites=true&w=majority");
            db = client.GetDatabase("test");
            collection = db.GetCollection<User>("user");

        }
        [HttpGet]
        public string Get()
        {

            return "success";
        }
    }
}
