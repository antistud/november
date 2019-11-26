using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace November.Dotnet
{
    public class GamePlay
    {
        public ObjectId _id { get; set; }
        public ObjectId user_id { get; set; }
        public ObjectId game_id { get; set; }
        public int rating { get; set; }
        public int length { get; set; }
        public string story { get; set; }

        public DateTime date { get; set; }

    }
}