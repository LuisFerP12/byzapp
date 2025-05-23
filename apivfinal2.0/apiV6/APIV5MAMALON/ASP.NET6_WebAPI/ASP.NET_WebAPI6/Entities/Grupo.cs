using System;
namespace ASP.NET_WebAPI6.Entities
{
	public class Grupo
	{
      
          public int idGrupo { get; set; }
          public int Profesor_idProfesor { get; set; }
          public string nombre { get; set; }
          public string token { get; set; }
          public string descripcion { get; set; }
    }

    public class estudiantegrupo
    {
        public int Estudiante_idEstudiante { get; set; }
        public int Grupo_idGrupo { get; set; }

    }
}

