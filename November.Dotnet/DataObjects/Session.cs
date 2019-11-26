using System;
using System.Collections.Generic;
using MongoDB.Bson;


namespace November.Dotnet
{
    public class UserSession
    {
        public ObjectId _id { get; set; }
        public string session_id { get; set; }
        public string username { get; set; }
        public ObjectId user_id { get; set; }
        public DateTime created { get; set; }



    }

}