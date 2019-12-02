using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class UserSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string session_id { get; set; }
        public string username { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        public DateTime created { get; set; }



    }

}