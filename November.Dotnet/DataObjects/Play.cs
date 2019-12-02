using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class GamePlay
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string game_id { get; set; }
        public int rating { get; set; }
        public int length { get; set; }
        public string story { get; set; }
        public DateTime date { get; set; }

    }
    public class GamePlayPut
    {
        public string _id { get; set; }
        public string user_id { get; set; }
        public string game_id { get; set; }
        public int rating { get; set; }
        public int length { get; set; }
        public string story { get; set; }
        public DateTime date { get; set; }

    }
}