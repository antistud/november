using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;
using MongoDB.Bson.Serialization.Attributes;

namespace November.Dotnet
{

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string hash { get; set; }
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

    public class UserPut
    {
        public string email { get; set; }
        public string url { get; set; }
    }

     public class UserPutReset
    {
        public string password { get; set; }
        public string newpassword {get; set;}
    }

}