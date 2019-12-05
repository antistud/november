using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{
    public class AtlasGame
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string atlas_id { get; set; }
        public string cache { get; set; }
        public Object data { get; set; }

    }
    public class AtlasEndpoint
    {
        public List<Object> games { get; set; }

    }
}