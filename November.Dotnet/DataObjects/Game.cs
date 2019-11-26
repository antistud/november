using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace November.Dotnet
{
    public class UserGame
    {
        public ObjectId _id { get; set; }
        public ObjectId user_id { get; set; }
    }
}