using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace November.Dotnet
{
    public class AppHost
    {
        public IMongoClient client;
        public IMongoDatabase db;
        public IMongoCollection<User> c_auth;
        public IMongoCollection<UserSession> c_sessions;
        public IMongoCollection<UserProfile> c_profile;
        public IMongoCollection<UserGame> c_game;
        public IMongoCollection<UserFriend> c_friend;
        public IMongoCollection<GamePlay> c_play;
        public IMongoCollection<GameRequest> c_request;
        public IMongoCollection<AtlasGame> c_atlas;
        public string sg_apiKey;
        public SendGridClient sg_client;
        public EmailAddress sg_from;

        public AppHost()
        {
            var dbUser = ConfigDb.username;
            var password = ConfigDb.password;
            var host = ConfigDb.host;
            client = new MongoClient($"mongodb+srv://{dbUser}:{password}@{host}/november?retryWrites=true&w=majority");
            db = client.GetDatabase("november");
            c_auth = db.GetCollection<User>("user");
            c_sessions = db.GetCollection<UserSession>("session");
            c_profile = db.GetCollection<UserProfile>("profile");
            c_game = db.GetCollection<UserGame>("game");
            c_friend = db.GetCollection<UserFriend>("friend");
            c_play = db.GetCollection<GamePlay>("play");
            c_request = db.GetCollection<GameRequest>("request");
            c_atlas = db.GetCollection<AtlasGame>("atlas");

            //Send Grid 
            sg_apiKey = ConfigSendGrid.sendGridApi;
            sg_client = new SendGridClient(sg_apiKey);
            sg_from = new EmailAddress("noreply@garishgames.com", "Garish Games");
        }

    }

}