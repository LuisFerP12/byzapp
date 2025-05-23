using System;
using ASP.NET_WebAPI6.Entities;

namespace ASP.NET_WebAPI6.DTO
{
	public class GrupoDTO
	{

          public int idGrupo { get; set; }
          public int Profesor_idProfesor{ get; set; }
          public string nombre { get; set; }
          public string token { get; set; }
          public string descripcion { get; set; }

    }

    public class estudiantegrupoDTO
    {
        public int Estudiante_idEstudiante { get; set; }
        public int Grupo_idGrupo { get; set; }

    }

    public class RegisterToGroupDTO
    {
        public int EstudianteId { get; set; }
        public string Token { get; set; }
    }
    
    public class GrupoProfesorDTO
    {
        public GrupoDTO Grupo { get; set; }
        public ProfesorDTO Profesor { get; set; }
    }
    

}

