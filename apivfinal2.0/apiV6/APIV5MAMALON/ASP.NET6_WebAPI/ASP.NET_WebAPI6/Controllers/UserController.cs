
using ASP.NET_WebAPI6.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using ASP.NET_WebAPI6.DTO;
using MySql.Data.MySqlClient;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
namespace ASP.NET_WebAPI6.Controllers
{
 
    [ApiController]
    [Route("api/[controller]")]
    public class EstudianteController : ControllerBase
    {
        private readonly DBContext DBContext;
        private readonly IConfiguration _config;
        private readonly ILogger<EstudianteController> _logger;


        public EstudianteController(DBContext DBContext, IConfiguration config, ILogger<EstudianteController> logger)
        {
            this.DBContext = DBContext;
            _config = config;
            _logger = logger;
            string jwtKey = config["JwtKey"];

        }

        private string GenerateToken()
        {
            const int tokenLength = 8; // Longitud del token
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            byte[] randomBytes = new byte[tokenLength];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            StringBuilder token = new StringBuilder(tokenLength);
            foreach (byte b in randomBytes)
            {
                token.Append(chars[b % chars.Length]);
            }

            return token.ToString();
        }

        private string GenerateJwtToken(string userId, string email, string nombre, string username, string userRole)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(JwtRegisteredClaimNames.Name, nombre),
                new Claim("user_role", userRole),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtKey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.Now.AddDays(Convert.ToDouble(_config["JwtExpireDays"]));

                var token = new JwtSecurityToken(
                    _config["JwtIssuer"],
                    _config["JwtIssuer"],
                    claims,
                    expires: expires,
                    signingCredentials: creds

        );

            _logger.LogInformation("JwtKey: " + _config["JwtKey"]);
            _logger.LogInformation("JwtIssuer: " + _config["JwtIssuer"]);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        //Método para traer a todos los usuarios
        [Authorize]
        [HttpGet("GetUsers")]
        public async Task<ActionResult<List<EstudianteDTO>>> Get()
        {
            var sqlQuery = "SELECT * from Estudiante";
            var users = await DBContext.Estudiante.FromSqlRaw(sqlQuery).ToListAsync();

            if (users.Count < 0)
            {
                return NotFound();
            }
            else
            {
                return users.Select(s => new EstudianteDTO
                {
                    idEstudiante = s.idEstudiante,
                    nombre = s.nombre,
                    email = s.email,
                    contraseña = s.contraseña,
                    username = s.username,

                }).ToList();
            }
        }


       
        [HttpGet("GetStudentExamAnswers/{examenId}/{estudianteId}")]
        public async Task<ActionResult> GetStudentExamAnswers(int examenId, int estudianteId)
        {

            var studentAnswers = await DBContext.preguntaexamenestudiante
                .Where(pe => pe.Examen_idExamen == examenId && pe.Estudiante_idEstudiante == estudianteId)
                .ToListAsync();


            if (studentAnswers == null || studentAnswers.Count == 0)
            {
                return NotFound("No answers found for the specified student and exam.");
            }

            var examAnswers = new List<object>();
            foreach (var studentAnswer in studentAnswers)
            {
                var pregunta = await DBContext.Pregunta.FirstOrDefaultAsync(r => r.idPregunta == studentAnswer.Pregunta_idPregunta);
                var respuesta = await DBContext.Respuesta.FirstOrDefaultAsync(r => r.idRespuesta == studentAnswer.respuesta_idRespuesta);

                if (respuesta != null)
                {
                    var examAnswer = new
                    {
                        preguntaId = studentAnswer.Pregunta_idPregunta,
                        preguntaEnunciado = pregunta.enunciado,
                        respuestaId = respuesta.idRespuesta,
                        respuestaText = respuesta.texto,
                        esCorrecta = respuesta.es_correcta == 1 ? true : false,
                        studentAnswer = studentAnswer.es_correcta == 1 ? true : false
                    };
                    examAnswers.Add(examAnswer);
                }
            }

            return Ok(examAnswers);
        }

       


        //Método para agregar usuario
        [HttpPost("AddEstudiante")]
        public async Task<IActionResult> Post([FromBody] EstudianteDTO estudianteDTO)
        {
            try
            {
                // Verificar si el email ya está en uso
                var existingUserWithEmail = await DBContext.Estudiante
                    .FirstOrDefaultAsync(e => e.email == estudianteDTO.email);

                // Verificar si el username ya está en uso
                var existingUserWithUsername = await DBContext.Estudiante
                    .FirstOrDefaultAsync(e => e.username == estudianteDTO.username);

                if (existingUserWithEmail != null && existingUserWithUsername != null)
                {
                    return BadRequest("El correo y el nombre de usuario ya están en uso.");
                }
                else if (existingUserWithEmail != null)
                {
                    return BadRequest("El correo ya está en uso.");
                }
                else if (existingUserWithUsername != null)
                {
                    return BadRequest("El nombre de usuario ya está en uso.");
                }

                var estudiante = new Estudiante
                {
                    idEstudiante = estudianteDTO.idEstudiante,
                    nombre = estudianteDTO.nombre,
                    email = estudianteDTO.email,
                    contraseña = estudianteDTO.contraseña,
                    username = estudianteDTO.username
                };

                DBContext.Estudiante.Add(estudiante);
                await DBContext.SaveChangesAsync();

                // Crear un objeto para devolver los datos del estudiante siesq no usamos el jwt, tal vez sirva para videojuego
                var estudianteData = new
                {
                    idEstudiante = estudiante.idEstudiante,
                    nombre = estudiante.nombre,
                    email = estudiante.email,
                    username = estudiante.username,
                    userType = "Estudiante"
                };

                // Devuelve el objeto con los datos del estudiante x
                string jwtToken = GenerateJwtToken(estudianteData.idEstudiante.ToString(), estudianteData.email, estudianteData.nombre, estudianteData.username, estudianteData.userType);
                return Ok(new { token = jwtToken });
                
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("AddProfesor")]
        public async Task<IActionResult> Post([FromBody] ProfesorDTO profesorDTO)
        {
            try
            {
                // Verificar si el correo ya está en uso o ne
                var existingUserWithEmail = await DBContext.Profesor
                    .FirstOrDefaultAsync(e => e.email == profesorDTO.email);

                // Verificar si el Username ya está en uso
                var existingUserWithUsername = await DBContext.Profesor
                    .FirstOrDefaultAsync(e => e.username == profesorDTO.username);

                if (existingUserWithEmail != null && existingUserWithUsername != null)
                {
                    return BadRequest("El correo y el nombre de usuario ya están en uso.");
                }
                else if (existingUserWithEmail != null)
                {
                    return BadRequest("El correo ya está en uso.");
                }
                else if (existingUserWithUsername != null)
                {
                    return BadRequest("El nombre de usuario ya está en uso.");
                }

                var profesor = new Profesor
                {
                    idProfesor = profesorDTO.idProfesor,
                    nombre = profesorDTO.nombre,
                    email = profesorDTO.email,
                    contraseña = profesorDTO.contraseña,
                    username = profesorDTO.username
                };

                DBContext.Profesor.Add(profesor);
                await DBContext.SaveChangesAsync();

                // Crear un objeto para devolver los datos del estudiante
                var estudianteData = new
                {
                    idEstudiante = profesor.idProfesor,
                    nombre = profesor.nombre,
                    email = profesor.email,
                    username = profesor.username,
                    userType = "Profesor"
                };

                // Devuelve el objeto con los datos del estudiante
                string jwtToken = GenerateJwtToken(estudianteData.idEstudiante.ToString(), estudianteData.email, estudianteData.nombre, estudianteData.username, estudianteData.userType);
                return Ok(new { token = jwtToken });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        


        public class CreateExamResponse
        {
            public Examen examen { get; set; }
            public List<PreguntaYrespuestaDTO> PreguntasYrespuestas { get; set; }
        }


        [Authorize]
        [HttpPost("CreateExam")]
        public async Task<IActionResult> CreateExam([FromBody] CreateExamDTO createExamDTO)
        {
            try
            {
                var examen = new Examen
                {
                    Grupo_idGrupo = createExamDTO.Examen.Grupo_idGrupo,
                    Dificultad_idDificultad = createExamDTO.Examen.Dificultad_idDificultad,
                    nombreExamen = createExamDTO.Examen.nombreExamen 
                };

                DBContext.Examen.Add(examen);
                await DBContext.SaveChangesAsync();

                int examId = examen.idExamen;

                var preguntasyrespuestas = new List<PreguntaYrespuestaDTO>();

                foreach (var preguntaYrespuestaDTO in createExamDTO.PreguntasYrespuestas)
                {
                    var pregunta = new Pregunta
                    {
                        Examen_idExamen = examId,
                        enunciado = preguntaYrespuestaDTO.Pregunta.enunciado,
                    };

                    DBContext.Pregunta.Add(pregunta);
                    await DBContext.SaveChangesAsync();

                    int questionId = pregunta.idPregunta;

                    var respuestas = new List<Respuesta>();
                    foreach (var respuestaDTO in preguntaYrespuestaDTO.Respuestas)
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

                    var preguntaYrespuesta = new PreguntaYrespuestaDTO
                    {
                        Pregunta = new PreguntaDTO
                        {
                            idPregunta = pregunta.idPregunta,
                            Examen_idExamen = pregunta.Examen_idExamen,
                            enunciado = pregunta.enunciado
                        },
                        Respuestas = respuestas.Select(r => new RespuestaDTO
                        {
                            idRespuesta = r.idRespuesta,
                            Pregunta_idPregunta = r.Pregunta_idPregunta,
                            texto = r.texto,
                            es_correcta = r.es_correcta
                        }).ToList()
                    };

                    preguntasyrespuestas.Add(preguntaYrespuesta);
                }

                var response = new CreateExamResponse
                {
                    examen = examen,
                    PreguntasYrespuestas = preguntasyrespuestas
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [Authorize]
        [HttpPut("EditExam/{id}")]
        public async Task<ActionResult<Examen>> UpdateExam(int id, [FromBody] CreateExamDTO createExamDTO)
        {
            // traer el examen con ese id
            var examen = await DBContext.Examen
                .FirstOrDefaultAsync(e => e.idExamen == id);

            if (examen == null)
            {
                return NotFound();
            }

            // act campos
            examen.Grupo_idGrupo = createExamDTO.Examen.Grupo_idGrupo;
            examen.Dificultad_idDificultad = createExamDTO.Examen.Dificultad_idDificultad;

            // Get related Preguntas
            var preguntas = await DBContext.Pregunta
                .Where(p => p.Examen_idExamen == id)
                .ToListAsync();

            // Uact Preguntas and Respuestass
            foreach (var preguntaYrespuestaDTO in createExamDTO.PreguntasYrespuestas)
            {
                var pregunta = preguntas.FirstOrDefault(p => p.idPregunta == preguntaYrespuestaDTO.Pregunta.idPregunta);

                if (pregunta != null) // Update existing pregunta
                {
                    pregunta.enunciado = preguntaYrespuestaDTO.Pregunta.enunciado;

                    // Get related Respuestas
                    var respuestas = await DBContext.Respuesta
                        .Where(r => r.Pregunta_idPregunta == pregunta.idPregunta)
                        .ToListAsync();

                    // Update respuestas
                    foreach (var respuestaDTO in preguntaYrespuestaDTO.Respuestas)
                    {
                        var respuesta = respuestas.FirstOrDefault(r => r.idRespuesta == respuestaDTO.idRespuesta);

                        if (respuesta != null) // nueva resp
                        {
                            respuesta.texto = respuestaDTO.texto;
                            respuesta.es_correcta = respuestaDTO.es_correcta;
                        }
                        else // nueva respo
                        {
                            DBContext.Respuesta.Add(new Respuesta
                            {
                                Pregunta_idPregunta = pregunta.idPregunta,
                                texto = respuestaDTO.texto,
                                es_correcta = respuestaDTO.es_correcta
                            });
                        }
                    }

                    // borrar respuestas
                    var respuestasToDelete = respuestas.Where(r => !preguntaYrespuestaDTO.Respuestas.Any(rdto => rdto.idRespuesta == r.idRespuesta));
                    DBContext.Respuesta.RemoveRange(respuestasToDelete);
                }
                else // Añade nueva preguntasuu
                {
                    var newPregunta = new Pregunta
                    {
                        Examen_idExamen = examen.idExamen,
                        enunciado = preguntaYrespuestaDTO.Pregunta.enunciado
                    };

                    DBContext.Pregunta.Add(newPregunta);
                    await DBContext.SaveChangesAsync(); //

                    var newRespuestas = preguntaYrespuestaDTO.Respuestas.Select(r => new Respuesta
                    {
                        Pregunta_idPregunta = newPregunta.idPregunta,
                        texto = r.texto,
                        es_correcta = r.es_correcta
                    });

                    DBContext.Respuesta.AddRange(newRespuestas);
                }
            }

            // Delete preguntas that were removed in the update
            var preguntasToDelete = preguntas.Where(p => !createExamDTO.PreguntasYrespuestas.Any(pydto => pydto.Pregunta.idPregunta == p.idPregunta));

            foreach (var pregunta in preguntasToDelete)
            {
                // Fetch associated Respuestas
                var respuestas = await DBContext.Respuesta
                    .Where(r => r.Pregunta_idPregunta == pregunta.idPregunta)
                    .ToListAsync();

                // Delete Respuestas
                DBContext.Respuesta.RemoveRange(respuestas);

               
                await DBContext.SaveChangesAsync();
            }

            
            DBContext.Pregunta.RemoveRange(preguntasToDelete);

            try
            {
                await DBContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception";
                return StatusCode(500, $"DbUpdateConcurrencyException: {ex.Message}, Inner exception: {innerExceptionMessage}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            return Ok(examen);
        }

        [HttpGet("GetExamVideogame/{examId}")]
        public async Task<IActionResult> GetExamByIdVideogame(int examId)
        {
            try
            {
                var examen = await DBContext.Examen.FindAsync(examId);

                if (examen == null)
                {
                    return NotFound();
                }

                var preguntas = await DBContext.Pregunta
                    .Where(p => p.Examen_idExamen == examId)
                    .ToListAsync();

                var preguntasyrespuestas = new List<PreguntaYrespuestaDTO>();

                foreach (var pregunta in preguntas)
                {
                    var respuestas = await DBContext.Respuesta
                        .Where(r => r.Pregunta_idPregunta == pregunta.idPregunta)
                        .ToListAsync();

                    var preguntaYrespuesta = new PreguntaYrespuestaDTO
                    {
                        Pregunta = new PreguntaDTO
                        {
                            idPregunta = pregunta.idPregunta,
                            Examen_idExamen = pregunta.Examen_idExamen,
                            enunciado = pregunta.enunciado
                        },
                        Respuestas = respuestas.Select(r => new RespuestaDTO
                        {
                            idRespuesta = r.idRespuesta,
                            Pregunta_idPregunta = r.Pregunta_idPregunta,
                            texto = r.texto,
                            es_correcta = r.es_correcta
                        }).ToList()
                    };

                    preguntasyrespuestas.Add(preguntaYrespuesta);
                }

                var response = new CreateExamResponse
                {
                    examen = examen,
                    PreguntasYrespuestas = preguntasyrespuestas,
                    // Agregar el nombre del examen a la respuesta
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpGet("GetExam/{examId}")]
        public async Task<IActionResult> GetExamById(int examId)
        {
            try
            {
                var examen = await DBContext.Examen.FindAsync(examId);

                if (examen == null)
                {
                    return NotFound();
                }

                var preguntas = await DBContext.Pregunta
                    .Where(p => p.Examen_idExamen == examId)
                    .ToListAsync();

                var preguntasyrespuestas = new List<PreguntaYrespuestaDTO>();

                foreach (var pregunta in preguntas)
                {
                    var respuestas = await DBContext.Respuesta
                        .Where(r => r.Pregunta_idPregunta == pregunta.idPregunta)
                        .ToListAsync();

                    var preguntaYrespuesta = new PreguntaYrespuestaDTO
                    {
                        Pregunta = new PreguntaDTO
                        {
                            idPregunta = pregunta.idPregunta,
                            Examen_idExamen = pregunta.Examen_idExamen,
                            enunciado = pregunta.enunciado
                        },
                        Respuestas = respuestas.Select(r => new RespuestaDTO
                        {
                            idRespuesta = r.idRespuesta,
                            Pregunta_idPregunta = r.Pregunta_idPregunta,
                            texto = r.texto,
                            es_correcta = r.es_correcta
                        }).ToList()
                    };

                    preguntasyrespuestas.Add(preguntaYrespuesta);
                }

                var response = new CreateExamResponse
                {
                    examen = examen,
                    PreguntasYrespuestas = preguntasyrespuestas,
                                              // Agregar el nombre del examen a la respuesta
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("SubmitExamAnswer")]
        public async Task<ActionResult> SubmitExamAnswer([FromBody] ExamAnswerDTO examAnswerDTO)
        {
            var estudianteId = examAnswerDTO.Estudiante_idEstudiante;

            // Fetch the exam
            var exam = await DBContext.Examen.FirstOrDefaultAsync(e => e.idExamen == examAnswerDTO.ExamenId);
            if (exam == null)
            {
                return NotFound("Exam not found");
            }

            // Fetch the pregunta
            var pregunta = await DBContext.Pregunta.FirstOrDefaultAsync(p => p.idPregunta == examAnswerDTO.PreguntaId);
            if (pregunta == null)
            {
                return NotFound("Pregunta not found");
            }

            // Fetch the submitted respuesta
            var respuesta = await DBContext.Respuesta.FirstOrDefaultAsync(r => r.idRespuesta == examAnswerDTO.RespuestaId);
            if (respuesta == null)
            {
                return NotFound("Respuesta not found");
            }

            // Check if the submitted answer is correct
            int esCorrecta = respuesta.es_correcta;




            // Create a new PreguntaExamenEstudiante record
            var newRecord = new preguntaexamenestudiante
            {
                Estudiante_idEstudiante = estudianteId,
                Examen_idExamen = exam.idExamen,
                Pregunta_idPregunta = pregunta.idPregunta,
                es_correcta = esCorrecta,
                respuesta_idRespuesta = examAnswerDTO.RespuestaId
            };


            // Add to the DBContext
            DBContext.preguntaexamenestudiante.Add(newRecord);

            try
            {
                await DBContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception";
                return StatusCode(500, $"DbUpdateException: {ex.Message}, Inner exception: {innerExceptionMessage}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            // Return the result of the submission (right or wrong)
            return Ok(new { esCorrecta });
        }



        [Authorize]
        [HttpGet("{studentId}")]
        public async Task<ActionResult<List<Examen>>> GetExamsForStudent(int studentId)
        {
            var examenes = await DBContext.Examen
                .FromSqlRaw("SELECT Examen.* FROM Examen " +
                            "INNER JOIN EstudianteGrupo ON Examen.Grupo_idGrupo = EstudianteGrupo.Grupo_idGrupo " +
                            "WHERE EstudianteGrupo.Estudiante_idEstudiante = {0}", studentId)
                .ToListAsync();

            if (examenes == null || examenes.Count == 0)
            {
                return NotFound();
            }

            return examenes;
        }


        [Authorize]
        [HttpGet("exams/{professorId}")]
        public async Task<ActionResult<List<ExamenDTO>>> GetExamsForProfessor(int professorId)
        {
            var exams = await DBContext.Examen.FromSqlRaw("SELECT Examen.idExamen, Examen.Grupo_idGrupo, Examen.Dificultad_idDificultad, IFNULL(Examen.nombreExamen, '') as nombreExamen " +
            "FROM Examen " +
            "JOIN Grupo ON Examen.Grupo_idGrupo = Grupo.idGrupo " +
            "JOIN Profesor ON Grupo.Profesor_idProfesor = Profesor.idProfesor " +
            "WHERE Profesor.idProfesor = {0}", professorId).ToListAsync();

            if (exams == null || exams.Count == 0)
            {
                return NotFound();
            }

            var examsDTO = exams.Select(e => new ExamenDTO
            {
                idExamen = e.idExamen,
                Grupo_idGrupo = e.Grupo_idGrupo,
                Dificultad_idDificultad= e.Dificultad_idDificultad,
                nombreExamen = e.nombreExamen != null ? e.nombreExamen : string.Empty
            }).ToList();

            return examsDTO;
        }


        [Authorize]
        [HttpGet("groups/{professorId}")]
        public async Task<ActionResult<List<GrupoDTO>>> GetGroupsForProfessor(int professorId)
        {
            // Geet s grupos del profesor
            var groups = await DBContext.Grupo
                .Where(g => g.Profesor_idProfesor == professorId)
                .Select(g => new GrupoDTO
                {
                    idGrupo = g.idGrupo,
                    Profesor_idProfesor = g.Profesor_idProfesor,
                    nombre = g.nombre,
                    token = g.token,
                    descripcion = g.descripcion
                    
                })
                .ToListAsync();

            // sino hay
            if (!groups.Any())
            {
                return NotFound();
            }

            return groups;
        }


        [Authorize]
        [HttpGet("exams/group/{groupId}")]
        public async Task<ActionResult<List<ExamenDTO>>> GetExamsForGroup(int groupId)
        {
            // Get all exams for this group.
            var exams = await DBContext.Examen
                .Where(e => e.Grupo_idGrupo == groupId)
                .Select(e => new ExamenDTO
                {
                    idExamen = e.idExamen,
                    Grupo_idGrupo = e.Grupo_idGrupo,
                    Dificultad_idDificultad= e.Dificultad_idDificultad,
                    nombreExamen = e.nombreExamen ?? string.Empty 
                })
                .ToListAsync();

            
            if (!exams.Any())
            {
                return NotFound();
            }

            return exams;
        }

        [Authorize]
        [HttpPost("groups/create")]
        public async Task<ActionResult<GrupoDTO>> CreateGroup([FromBody] GrupoDTO grupoDTO)
        {
            // generareltoken de una
            string token = GenerateToken();

            // Crear el dto 
            var grupo = new Grupo
            {
                Profesor_idProfesor = grupoDTO.Profesor_idProfesor,
                nombre = grupoDTO.nombre,
                token = token,
                descripcion = grupoDTO.descripcion,

            };

            // Add the grupo to the database siuuuuuuuuuu
            DBContext.Grupo.Add(grupo);
            await DBContext.SaveChangesAsync();

            
            var createdGrupoDTO = new GrupoDTO
            {
                idGrupo = grupo.idGrupo,
                Profesor_idProfesor = grupo.Profesor_idProfesor,
                nombre = grupo.nombre,
                token = grupo.token,
                descripcion = grupo.descripcion
                
            };

            return createdGrupoDTO;
        }

        [Authorize]
        [HttpPost("groups/register")]
        public async Task<ActionResult> RegisterToGroup([FromBody] RegisterToGroupDTO registrationDTO)
        {
            // Obtener el grupo con el tokensiuu
            var grupo = await DBContext.Grupo.FirstOrDefaultAsync(g => g.token == registrationDTO.Token);

            if (grupo == null)
            {
                return NotFound("El grupo no existe.");
            }

            // Obtener el estudiante que realiza el registrosiuu
            var estudiante = await DBContext.Estudiante.FindAsync(registrationDTO.EstudianteId);

            if (estudiante == null)
            {
                return NotFound("El estudiante no existe.");
            }

            
            var estudianteGrupoExistente = await DBContext.estudiantegrupo
                .FirstOrDefaultAsync(eg => eg.Estudiante_idEstudiante == estudiante.idEstudiante && eg.Grupo_idGrupo == grupo.idGrupo);

            if (estudianteGrupoExistente != null)
            {
                return BadRequest("El estudiante ya está registrado en este grupo.");
            }

            
            var estudianteGrupo = new estudiantegrupo
            {
                Estudiante_idEstudiante = estudiante.idEstudiante,
                Grupo_idGrupo = grupo.idGrupo
            };

            
            DBContext.estudiantegrupo.Add(estudianteGrupo);
            await DBContext.SaveChangesAsync();

            return Ok("El estudiante se ha registrado correctamente en el grupo.");
        }



        [Authorize]
        [HttpGet("studentgroups/{studentId}")]
        public async Task<ActionResult<List<GrupoProfesorDTO>>> GetGroupsForStudent(int studentId)
        {
            var groups = await DBContext.Grupo
                .Join(
                    DBContext.estudiantegrupo,
                    g => g.idGrupo,
                    eg => eg.Grupo_idGrupo,
                    (g, eg) => new { Grupo = g, EstudianteGrupo = eg }
                )
                .Join(
                    DBContext.Profesor,
                    j => j.Grupo.Profesor_idProfesor,
                    p => p.idProfesor,
                    (j, p) => new { Grupo = j.Grupo, Profesor = p, EstudianteGrupo = j.EstudianteGrupo }
                )
                .Where(j => j.EstudianteGrupo.Estudiante_idEstudiante == studentId)
                .Select(j => new GrupoProfesorDTO
                {
                    Grupo = new GrupoDTO
                    {
                        idGrupo = j.Grupo.idGrupo,
                        Profesor_idProfesor = j.Grupo.Profesor_idProfesor,
                        nombre = j.Grupo.nombre,
                        token = j.Grupo.token,
                        descripcion = j.Grupo.descripcion
                    },
                    Profesor = new ProfesorDTO
                    {
                        idProfesor = j.Profesor.idProfesor,
                        nombre = j.Profesor.nombre,
                        email = j.Profesor.email,
                        username = j.Profesor.username
                    }
                })
                .ToListAsync();

            if (!groups.Any())
            {
                return NotFound();
            }

            return groups;
        }



        [HttpGet("studentExams/{studentId}")]
        public async Task<ActionResult<List<GruposEstudianteDTO>>> GetExamsByStudentID(int studentId)
        {
            // Get all exams for this group.
            var exams = await DBContext.estudiantegrupo
                .Where(estudiantegrupo => estudiantegrupo.Estudiante_idEstudiante == studentId)
                .Join(DBContext.Examen,
                estudiantegrupo => estudiantegrupo.Grupo_idGrupo,
                examen => examen.Grupo_idGrupo,
                (estudiantegrupo, examen) => new GruposEstudianteDTO
                {
                    Estudiante_idEstudiante = estudiantegrupo.Estudiante_idEstudiante,
                    Grupo_idGrupo = examen.Grupo_idGrupo,
                    idExamen = examen.idExamen,
                    Dificultad_idDificultad = examen.Dificultad_idDificultad,
                    nombreExamen = examen.nombreExamen
                })
                .ToListAsync();
            if (!exams.Any())
            {
                return NotFound();
            }
            return exams;

        }

        [Authorize]
        [HttpGet("CalculateStudentGrade/{studentId}/{examId}")]
        public async Task<ActionResult> CalculateStudentGrade(int studentId, int examId)
        {
            try
            {
                var totalPreguntas = DBContext.Pregunta.Count(p => p.Examen_idExamen == examId);

                var calificacion = DBContext.preguntaexamenestudiante
                    .Count(pe => pe.Estudiante_idEstudiante == studentId && pe.Examen_idExamen == examId && pe.es_correcta == 1);

                var porcentajeCalificacion = (calificacion / (double)totalPreguntas) * 100;



                return Ok(porcentajeCalificacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
        }

        [HttpPost("CalculateStudentGradeVideoGame/{studentId}/{examId}")]
        public async Task<ActionResult> CalculateStudentGradeVideogame(int studentId, int examId)
        {
            try
            {
                var totalPreguntas = DBContext.Pregunta.Count(p => p.Examen_idExamen == examId);

                var calificacion = DBContext.preguntaexamenestudiante
                    .Count(pe => pe.Estudiante_idEstudiante == studentId && pe.Examen_idExamen == examId && pe.es_correcta == 1);

                var porcentajeCalificacion = (calificacion / (double)totalPreguntas) * 100;

                var estudianteexamen = new estudianteexamen
                {
                    Estudiante_idEstudiante = studentId,
                    Examen_idExamen = examId,
                    intentos = 1,
                    calificación = porcentajeCalificacion
                };

                DBContext.estudianteexamen.Add(estudianteexamen);
                await DBContext.SaveChangesAsync();

                return Ok(porcentajeCalificacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
        }

        [HttpGet("GetStudentinGroups/{grupoId}")]
        public async Task<ActionResult> GetStudnetinGroupsLol(int grupoId)
        {
            try
            {
                var students = await DBContext.estudiantegrupo
                .Where(pe => pe.Grupo_idGrupo == grupoId)
                .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
           
            
        }

        //Método para ver las calificaciones de un estudiante en un detemrinado examen
        [HttpGet("ExamenesEstudiante/{studentId}/{examId}")]
        public async Task<ActionResult> ExamenesDeEstudiante(int studentId, int examId)
        {
            try
            {
                var examenesEstudiante = await DBContext.estudianteexamen
                .Where(ee => ee.Estudiante_idEstudiante == studentId && ee.Examen_idExamen == examId)
                .ToListAsync();

                return Ok(examenesEstudiante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
        }

        [HttpGet("ExamenesEstudiantePorGrupo/{studentId}/{groupId}")]
        public async Task<ActionResult> ExamenesDeEstudiantePorGrupo(int studentId, int groupId)
        {
            try
            {
                var examenesEstudiante = await DBContext.estudianteexamen
                    .Where(ee => ee.Estudiante_idEstudiante == studentId)
                    .Join(DBContext.Examen,
                        ee => ee.Examen_idExamen,
                        examen => examen.idExamen,
                        (ee, examen) => new { EstudianteExamen = ee, Examen = examen })
                    .Where(joinResult => joinResult.Examen.Grupo_idGrupo == groupId)
                    .Select(joinResult => new {
                        EstudianteExamen = joinResult.EstudianteExamen,
                        NombreExamen = joinResult.Examen.nombreExamen
                    })
                    .ToListAsync();

                return Ok(examenesEstudiante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
        }



        //Método para ver las calificaciones de un estudiante en sus examenes
        [HttpGet("ExamenesEstudiante/{studentId}")]
        public async Task<ActionResult> ExamenesDeEstudiante(int studentId)
        {
            try
            {
                var examenesEstudiante = await DBContext.estudianteexamen
                .Where(ee => ee.Estudiante_idEstudiante == studentId)
                .ToListAsync();

                return Ok(examenesEstudiante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException.Message);
            }
        }

        //ver todos lo s estudiantes de un gpo
        [HttpGet("VerlosEstudiantesDeunGrupo/{grupoId}/Estudiantes")]
        public async Task<IActionResult> GetEstudiantesGrupo(int grupoId)
        {
            try
            {
                var estudiantes = await DBContext.estudiantegrupo
                    .Where(eg => eg.Grupo_idGrupo == grupoId)
                    .Join(DBContext.Estudiante,
                        eg => eg.Estudiante_idEstudiante,
                        e => e.idEstudiante,
                        (eg, e) => new { EstudianteGrupo = eg, Estudiante = e })
                    .Select(eg => new
                    {
                        EstudianteId = eg.Estudiante.idEstudiante,
                        NombreEstudiante = eg.Estudiante.nombre,
                        EmailEstudiante = eg.Estudiante.email
                    })
                    .ToListAsync();

                return Ok(estudiantes);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al obtener los estudiantes del grupo. Excepción: {ex.Message}");
            }
        }

        [HttpGet("ValidarIntentoExamenVideouego/{estudianteId}/{examenId}")]
        public async Task<IActionResult> ValidarIntentoExamen(int estudianteId, int examenId)
        {
            try
            {
                var examenEstudiante = await DBContext.estudianteexamen
                    .FirstOrDefaultAsync(ee => ee.Estudiante_idEstudiante == estudianteId && ee.Examen_idExamen == examenId);

                if (examenEstudiante != null)
                {
                    // El estudiante ya presento elexamen
                    return Ok(1);
                }
                else
                {
                    // El estudianteno lo presento lolazo
                    return Ok(0);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al validar el intento del examen excepción: {ex.Message}");
            }
        }


        [HttpGet("Grupo/{grupoId}/Examen/{examenId}/MejoresCalificaciones")]
        public async Task<IActionResult> GetMejoresCalificaciones(int examenId)
        {
            try
            {
                var mejoresCalificaciones = await DBContext.estudianteexamen
                .Where(ee => ee.Examen_idExamen == examenId)
                .Join(DBContext.Estudiante,
                    ee => ee.Estudiante_idEstudiante,
                    e => e.idEstudiante,
                    (ee, e) => new { EstudianteExamen = ee, Estudiante = e })
                .Join(DBContext.Examen,
                    ee => ee.EstudianteExamen.Examen_idExamen,
                    ex => ex.idExamen,
                    (ee, ex) => new { ee.EstudianteExamen, ee.Estudiante, Examen = ex })
                .OrderByDescending(egex => egex.EstudianteExamen.calificación)
                .Select(egex => new
                {
                    NombreEstudiante = egex.Estudiante.nombre,
                    Calificacion = egex.EstudianteExamen.calificación,
                    idEstudiante = egex.Estudiante.idEstudiante
                })
                .ToListAsync();



                return Ok(mejoresCalificaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al obtener las calificaciones. Excepción: {ex.Message}");
            }
        }


        //delete estudiante de grupo

        [HttpDelete("RemoveAlumnoFromGrupo/{alumnoId}/{grupoId}")]
        public IActionResult RemoveAlumnoFromGrupo(int alumnoId, int grupoId)
        {
            try
            {
                var estudianteGrupo = DBContext.estudiantegrupo
                    .FirstOrDefault(eg => eg.Estudiante_idEstudiante == alumnoId && eg.Grupo_idGrupo == grupoId);

                if (estudianteGrupo == null)
                {
                    return NotFound("No se encontró la relación entre el alumno y el grupo.");
                }

                DBContext.estudiantegrupo.Remove(estudianteGrupo);
                DBContext.SaveChangesAsync();

                return Ok("El alumno fue dado de baja exitosamente del grupo.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("RemoveGrupo/{grupoId}")]
        public async Task<IActionResult> RemoveGrupo(int grupoId)
        {
            try
            {
                await DBContext.Database.ExecuteSqlRawAsync("CALL DeleteGroupAndRelations({0})", grupoId);

                return Ok("El grupo ha sido eliminado exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al actualizar los registros. Excepción interna: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
        //MÉTODO DEL LOGIN


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDTO)
        {
            try
            {
                string sql = @"
SELECT 'Estudiante' as user_type, idEstudiante as id, nombre, email, username
FROM Estudiante
WHERE ((email = @EmailOrUsername) OR (username = @EmailOrUsername)) AND contraseña = @Password
UNION ALL
SELECT 'Profesor' as user_type, idProfesor as id, nombre, email, username
FROM Profesor
WHERE ((email = @EmailOrUsername) OR (username = @EmailOrUsername)) AND contraseña = @Password
";

                var emailOrUsernameParam = new MySqlParameter("@EmailOrUsername", loginDTO.email);
                var passwordParam = new MySqlParameter("@Password", loginDTO.contraseña);

                List<dynamic> results = new List<dynamic>();

                using (var command = DBContext.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = sql;
                    command.Parameters.AddRange(new[] { emailOrUsernameParam, passwordParam });
                    await DBContext.Database.OpenConnectionAsync();

                    using (var dataReader = await command.ExecuteReaderAsync())
                    {
                        while (await dataReader.ReadAsync())
                        {
                            dynamic record = new
                            {
                                id = dataReader.GetInt32(1),
                                nombre = dataReader.GetString(2),
                                email = dataReader.GetString(3),
                                username = dataReader.GetString(4),
                                userType = dataReader.GetString(0)
                            };
                            results.Add(record);
                        }
                    }
                }

                if (results.Count > 0)
                {
                    var userData = results.FirstOrDefault();
                    string jwtToken = GenerateJwtToken(userData.id.ToString(), userData.email, userData.nombre, userData.username, userData.userType);
                    return Ok(new { token = jwtToken });
                }
                else
                {
                    return Unauthorized(new { message = "Correo electrónico/Nombre de usuario o contraseña incorrectos" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPost("LoginVideojuego")]
        public async Task<IActionResult> LoginVideojuego([FromBody] UserLoginDTO loginDTO)
        {
            try
            {
                string sql = @"
SELECT 'Estudiante' as user_type, idEstudiante as id, nombre, email, username
FROM Estudiante
WHERE ((email = @EmailOrUsername) OR (username = @EmailOrUsername)) AND contraseña = @Password
";

                var emailOrUsernameParam = new MySqlParameter("@EmailOrUsername", loginDTO.email);
                var passwordParam = new MySqlParameter("@Password", loginDTO.contraseña);

                List<dynamic> results = new List<dynamic>();

                using (var command = DBContext.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = sql;
                    command.Parameters.AddRange(new[] { emailOrUsernameParam, passwordParam });
                    await DBContext.Database.OpenConnectionAsync();

                    using (var dataReader = await command.ExecuteReaderAsync())
                    {
                        while (await dataReader.ReadAsync())
                        {
                            dynamic record = new
                            {
                                id = dataReader.GetInt32(1),
                                nombre = dataReader.GetString(2),
                                email = dataReader.GetString(3),
                                username = dataReader.GetString(4),
                                userType = dataReader.GetString(0)
                            };
                            results.Add(record);
                        }
                    }
                }

                if (results.Count > 0)
                {
                    var userData = results.FirstOrDefault();
                    string jwtToken = GenerateJwtToken(userData.id.ToString(), userData.email, userData.nombre, userData.username, userData.userType);
                    return Ok(new {jwtToken, userData.id, userData.email, userData.nombre, userData.username, userData.userType });
                }
                else
                {
                    return Unauthorized(new { message = "Correo electrónico/Nombre de usuario o contraseña incorrectos" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}




 

