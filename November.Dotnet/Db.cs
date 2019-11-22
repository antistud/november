using System;
using MongoDB.Driver;

namespace November.Dotnet
{
    public class Db
    {

        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<UserAuth> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public Db()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            var host = ConfigDb.host;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/test?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<UserAuth>("auth");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");

        }
    }
}