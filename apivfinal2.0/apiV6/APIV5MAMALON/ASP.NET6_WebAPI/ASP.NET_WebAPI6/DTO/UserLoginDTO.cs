using System;
using ASP.NET_WebAPI6.Entities;

namespace ASP.NET_WebAPI6.DTO
{
    public class UserLoginDTO
    {
        public string email { get; set; }
        public string contraseña { get; set; }
    }
}
