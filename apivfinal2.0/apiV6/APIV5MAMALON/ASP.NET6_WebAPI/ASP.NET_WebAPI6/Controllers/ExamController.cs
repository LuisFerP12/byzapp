using System;
using Microsoft.AspNetCore.Mvc;
using ASP.NET_WebAPI6.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using ASP.NET_WebAPI6.DTO;
using MySql.Data.MySqlClient;

namespace ASP.NET_WebAPI6.Controllers
{
    public class ExamController
    {
        [ApiController]
        [Route("api/Examenes")]
        public class ExamenController : ControllerBase
        {
            private readonly DBContext DBContext;


            public ExamenController(DBContext DBContext)
            {
                this.DBContext = DBContext;
            }

            public class CreateExamResponse
            {
                public Examen Examen { get; set; }
                public Pregunta Pregunta { get; set; }
                public List<Respuesta> Respuestas { get; set; }
            }

            [HttpPost]
            public async Task<IActionResult> CreateExam([FromBody] ExamenDTO examenDTO, PreguntaDTO preguntaDTO, List<RespuestaDTO> respuestasDTO)
            {
                try
                {
                    // Insertar el examen y obtener el idExamen
                    var examen = new Examen
                    {
                        Grupo_idGrupo = examenDTO.Grupo_idGrupo,
                        Dificultad_idDificultad = examenDTO.Dificultad_idDificultad
                    };

                    DBContext.Examen.Add(examen);
                    await DBContext.SaveChangesAsync();

                    int examId = examen.idExamen;

                    // Insertar la pregunta y obtener el idPregunta

                    var preguntas = new List<Pregunta>();

                        var pregunta = new Pregunta
                        {
                            Examen_idExamen = examId,
                            enunciado = preguntaDTO.enunciado
                        };

                    DBContext.Pregunta.Add(pregunta);
                    await DBContext.SaveChangesAsync();

                    int questionId = pregunta.idPregunta;

                    // Insertar las respuestas
                    var respuestas = new List<Respuesta>();

                    foreach (var respuestaDTO in respuestasDTO)
                    {
                        var respuesta = new Respuesta
                        {
                            Pregunta_idPregunta = questionId,
                            texto = respuestaDTO.texto,
                            es_correcta = respuestaDTO.es_correcta
                        };

                        respuestas.Add(respuesta);
                    }

                    DBContext.Respuesta.AddRange(respuestas);
                    await DBContext.SaveChangesAsync();

                    var response = new CreateExamResponse
                    {
                        Examen = examen,
                        Pregunta = pregunta,
                        Respuestas = respuestas
                    };

                    return Ok(response);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }


        }
    }

}

  