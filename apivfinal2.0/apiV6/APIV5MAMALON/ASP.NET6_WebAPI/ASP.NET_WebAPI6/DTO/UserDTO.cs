// EstudianteDTO.cs
namespace ASP.NET_WebAPI6.Entities
{
    public partial class EstudianteDTO
    {
        public int idEstudiante { get; set; }
        public string nombre { get; set; }
        public string contraseña { get; set; }
        public string email { get; set; }
        public string username { get; set; }
    }
}

// ProfesorDTO.cs
namespace ASP.NET_WebAPI6.Entities
{
    public partial class ProfesorDTO
    {
        public int idProfesor { get; set; }
        public string nombre { get; set; }
        public string contraseña { get; set; }
        public string email { get; set; }
        public string username { get; set; }
    }
}

public class UserData
{
    public string UserType { get; set; }
    public int id { get; set; }
    public string nombre { get; set; }
    public string email { get; set; }
    public string username { get; set; }
}

