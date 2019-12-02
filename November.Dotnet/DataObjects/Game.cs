using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class UserGame
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        public string atlas_id { get; set; }
        public string bgg_id { get; set; }
        public bool favorite { get; set; }
        public Object atlas { get; set; }
        public GamePlay play { get; set; }
        public GameRequest request { get; set; }

    }
    public class UserGamePost
    {
        public string _id { get; set; }
        public string user_id { get; set; }
        public string atlas_id { get; set; }
        public string bgg_id { get; set; }
        public bool favorite { get; set; }

    }
}