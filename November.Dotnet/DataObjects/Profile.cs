using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class UserProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
    }
    public class UserProfileSummary
    {
        public UserProfileSummary(UserProfile p)
        {
            user_id = p.user_id;
            username = p.username;
            name = p.name;
            email = p.email;
        }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
    }
}