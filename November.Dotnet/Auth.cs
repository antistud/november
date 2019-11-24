using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace November.Dotnet
{

    public class UserAuth
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string hash { get; set; }
    }

    public class UserSession
    {
        public static Db db { get; set; }
        public UserSession()
        {
            var db = new Db();
        }
        public ObjectId _id { get; set; }
        public string session_id { get; set; }
        public string username { get; set; }
        public ObjectId user_id { get; set; }
        public DateTime created { get; set; }

        public static string CreateSessionId()
        {

            Guid guid = Guid.NewGuid();
            string str = guid.ToString();
            return str;
        }

        public static bool CheckSessionId(string session_id)
        {

            var docs = db.c_sessions.Find(x => x.session_id == session_id).ToList();
            List<UserSession> results = new List<UserSession>();
            var found = false;
            foreach (var d in docs)
            {
                if (d.session_id == session_id)
                {
                    found = true;
                }
            }
            if (found == false)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    public class UserProfile
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }
        public ObjectId user_id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
    }
    public class UserPassword
    {
        public static string HashPassword(string password)
        {
            HashAlgorithm hashAlg = new SHA256CryptoServiceProvider();
            byte[] bytValue = System.Text.Encoding.UTF8.GetBytes(password + ConfigDb.salt);
            byte[] bytHash = hashAlg.ComputeHash(bytValue);
            string base64 = Convert.ToBase64String(bytHash);
            return base64;
        }
    }

}