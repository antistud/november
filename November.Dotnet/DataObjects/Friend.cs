using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{

    public class UserFriend
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string friend_id { get; set; }
        public bool accepted { get; set; }
        public UserProfileSummary friend { get; set; }
        public UserProfileSummary user { get; set; }
    }
    public class UserFriendPut
    {
        public string friend_id { get; set; }
    }


}