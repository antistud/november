using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class GameRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string game_id { get; set; }
        public DateTime send_sent { get; set; }
        public DateTime send_recieved { get; set; }
        public DateTime return_sent { get; set; }
        public DateTime return_recieved { get; set; }
        public int requester_rating { get; set; }
        public int lender_rating { get; set; }
    }
    public class GameRequestPut
    {
        public string _id { get; set; }
        public string user_id { get; set; }
        public string game_id { get; set; }
        public bool send_sent { get; set; }
        public bool send_recieved { get; set; }
        public bool return_sent { get; set; }
        public bool return_recieved { get; set; }
        public int requester_rating { get; set; }
        public int lender_rating { get; set; }
    }
    public class GameRequestPost
    {
        public string _id { get; set; }
        public string step { get; set; }
        public int requester_rating { get; set; }
        public int lender_rating { get; set; }
    }
    public class GameRequestReturn
    {
        public Object others { get; set; }
        public Object mine { get; set; }

    }

}