using System;
namespace ASP.NET_WebAPI6.Entities
{
    public partial class Examen
    {
        public int idExamen { get; set; }
        public int Grupo_idGrupo { get; set; }
        public int Dificultad_idDificultad { get; set; }
        public string nombreExamen { get; set; }
        
    }

    public partial class Pregunta
    {
        public int idPregunta { get; set; }
        public int Examen_idExamen { get; set; }
        public string enunciado { get; set; }
    }

    public partial class Respuesta
    {
        public int idRespuesta { get; set; }
        public int Pregunta_idPregunta { get; set; }
        public string texto { get; set; }
        public int es_correcta { get; set; }
    }

    public partial class estudianteexamen
    {
        public int Estudiante_idEstudiante { get; set; }
        public int Examen_idExamen { get; set; }
        public int intentos { get; set;}
        public double calificación { get; set; }
    }

    public partial class preguntaexamenestudiante
    {
        public int idPreguntaExamenEstudiante { get; set; }
        public int Estudiante_idEstudiante { get; set; }
        public int Examen_idExamen { get; set; }
        public int Pregunta_idPregunta { get; set; }
        public int es_correcta { get; set; }
        public int respuesta_idRespuesta { get; set; }
    }
}

