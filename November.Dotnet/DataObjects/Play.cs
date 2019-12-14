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
     public class GamePlayDetail
    {
        public GamePlayDetail(GamePlay g){
                _id = g._id;
                user_id = g.user_id;
                game_id = g.game_id;
                rating = g.rating;
                length = g.length;
                story = g.story;
                date = g.date;
        }
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string game_id { get; set; }
        public string user_username {get; set;}
        public string user_name {get; set;}
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