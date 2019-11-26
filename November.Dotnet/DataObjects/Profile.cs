using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace November.Dotnet
{
    public class UserProfile
    {
        public ObjectId _id { get; set; }
        public ObjectId user_id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
        public Array friends { get; set; }
    }
}