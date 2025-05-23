using System;
using ASP.NET_WebAPI6.Entities;

namespace ASP.NET_WebAPI6.DTO;

public class ExamenDTO
{
    public int idExamen { get; set; }
    public int Grupo_idGrupo { get; set; }
    public int Dificultad_idDificultad { get; set; }
    public string nombreExamen { get; set; }
    

}

public class ExamAnswerDTO
{
    public int ExamenId { get; set; }
    public int PreguntaId { get; set; }
    public int RespuestaId { get; set; }
    public int Estudiante_idEstudiante { get; set; }
}


public class PreguntaDTO
{
    public int idPregunta { get; set; }
    public int Examen_idExamen { get; set; }
    public string enunciado { get; set; }
}

public class RespuestaDTO
{
    public int idRespuesta { get; set; }
    public int Pregunta_idPregunta { get; set; }
    public string texto { get; set; }
    public int es_correcta { get; set; }
}

public class PreguntaYrespuestaDTO
{
    public PreguntaDTO Pregunta { get; set; }
    public List<RespuestaDTO> Respuestas { get; set; }
}

public class CreateExamDTO
{
    public ExamenDTO Examen { get; set; }
    public List<PreguntaYrespuestaDTO> PreguntasYrespuestas { get; set; }
}


public class GruposEstudianteDTO
{
    public int Estudiante_idEstudiante { get; set; }
    public int Grupo_idGrupo { get; set; }
    public int idExamen { get; set; }
    public int Dificultad_idDificultad { get; set; }
    public string nombreExamen { get; set; }

}
public partial class estudianteexamenDTO
{
    public int Estudiante_idEstudiante { get; set; }
    public int Examen_idExamen { get; set; }
    public int intentos { get; set; }
    public double calificacion { get; set; }
}

public partial class preguntaexamenestudianteDTO
{
    public int idPreguntaExamenEstudiante { get; set; }
    public int Estudiante_idEstudiante { get; set; }
    public int Examen_idExamen { get; set; }
    public int Pregunta_idPregunta { get; set; }
    public int es_correcta { get; set; }
    public int respuesta_idRespuesta { get; set; } 
}
