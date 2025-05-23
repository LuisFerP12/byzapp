namespace ASP.NET_WebAPI6.Entities
{
    public partial class Estudiante
    {
        public int idEstudiante { get; set; }
        public string nombre { get; set; }
        public string contraseña { get; set; }
        public string email { get; set; }
        public string username { get; set; }

    }
    public partial class Profesor
    {
        public int idProfesor { get; set; }
        public string nombre { get; set; }
        public string contraseña { get; set; }
        public string email { get; set; }
        public string username { get; set; }

    }
}
