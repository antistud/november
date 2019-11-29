using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace November.Dotnet
{
    public class UserGame
    {
        public ObjectId _id { get; set; }
        public ObjectId user_id { get; set; }
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