using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace November.Dotnet
{

    public class UserFriend
    {
        public ObjectId _id { get; set; }
        public ObjectId user_id { get; set; }
        public ObjectId friend_id { get; set; }
        public bool accepted { get; set; }
    }
    public class UserFriendPut
    {
        public string friend_id { get; set; }
    }

}