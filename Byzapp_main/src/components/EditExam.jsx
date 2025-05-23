import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarLoader } from "react-spinners";
import swal from "sweetalert";
import "../styles/ExamenEdit.css";

const EditExam = ({ exam }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [examData, setExamData] = useState(null);
  console.log(exam);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get("examId");
  const idExamen = exam.idExamen;

  const [selectedDifficulty, setSelectedDifficulty] = useState({
    id: exam.dificultad_idDificultad,
    editable: false,
  });

  const [answerCounter, setAnswerCounter] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    console.log("id examen encontrado alv", idExamen);
    const token = Cookies.get("token");
    axios
      .get(`https://localhost:7095/api/Estudiante/GetExam/${idExamen}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setExamData(response.data);
        setIsLoading(false);
        console.log("Examen obtenido siuuu:", response.data);
      })
      .catch((error) => {
        console.error("Error putamadre", error);
      });
  }, [examId]);

  const handleAddQuestion = () => {
    console.log("examData al agregar pregunta siuxd", examData);

    const currentMaxId = Math.max(
      ...examData.preguntasYrespuestas.map((question) =>
        question.pregunta.idPregunta ? question.pregunta.idPregunta : 0
      )
    );
    const newQuestionId = currentMaxId + 1;

    const newQuestion = {
      pregunta: {
        idPregunta: 0,
        examen_idExamen: examData.examen.idExamen,
        enunciado: "",
      },
      respuestas: [],
    };
    setExamData((prevExamData) => ({
      ...prevExamData,
      preguntasYrespuestas: [...prevExamData.preguntasYrespuestas, newQuestion],
    }));
  };

  const handleDeleteQuestion = (questionIndex) => {
    setExamData((prevExamData) => {
      const updatedQuestions = prevExamData.preguntasYrespuestas.filter(
        (_, index) => index !== questionIndex
      );
      return {
        ...prevExamData,
        preguntasYrespuestas: updatedQuestions,
      };
    });
  };

  const handleAddAnswer = (questionIndex) => {
    const currentQuestion = examData.preguntasYrespuestas[questionIndex];
    const newAnswerId = currentQuestion.respuestas.length + 1;

    const newAnswer = {
      idRespuesta: newAnswerId,
      pregunta_idPregunta:
        examData.preguntasYrespuestas[questionIndex].pregunta.idPregunta,
      texto: "",
      es_correcta: 0,
    };

    setExamData((prevExamData) => {
      const updatedQuestions = JSON.parse(
        JSON.stringify(prevExamData.preguntasYrespuestas)
      );
      updatedQuestions[questionIndex].respuestas.push(newAnswer);
      return {
        ...prevExamData,
        preguntasYrespuestas: updatedQuestions,
      };
    });
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    setExamData((prevExamData) => {
      const updatedQuestions = JSON.parse(
        JSON.stringify(prevExamData.preguntasYrespuestas)
      );
      updatedQuestions[questionIndex].respuestas.splice(answerIndex, 1);
      return {
        ...prevExamData,
        preguntasYrespuestas: updatedQuestions,
      };
    });
  };

  const handleInputChange = (event, questionIndex, answerIndex = null) => {
    const { name, value, type, checked } = event.target;
    setExamData((prevExamData) => {
      const updatedQuestions = [...prevExamData.preguntasYrespuestas];
      if (answerIndex !== null) {
        updatedQuestions[questionIndex].respuestas[answerIndex][name] =
          type === "checkbox" ? (checked ? 1 : 0) : value;
      } else {
        updatedQuestions[questionIndex].pregunta[name] = value;
      }
      return {
        ...prevExamData,
        preguntasYrespuestas: updatedQuestions,
      };
    });
  };

  const handleDifficultyChange = (event) => {
    const newDifficultyId = parseInt(
      event.target.checked ? event.target.value : ""
    );
    setSelectedDifficulty({ id: newDifficultyId, editable: true });

    setExamData((prevExamData) => ({
      ...prevExamData,
      examen: {
        ...prevExamData.examen,
        dificultad_idDificultad: newDifficultyId,
      },
    }));
  };

  const handleUpdateExam = () => {
    console.log("examData.preguntasYrespuestas: suuu", examData);

    const token = Cookies.get("token");
    const errors = {};

    if (examData.preguntasYrespuestas.length === 0) {
      errors.questions = "Debe agregar al menos una pregunta";
      swal("Error", "Debe agregar al menos una pregunta", "error", {
        button: false,
      });
    }

    examData.preguntasYrespuestas.forEach((question, index) => {
      if (!question.pregunta.enunciado) {
        errors[`questionText${index}`] = "El texto de la pregunta es requerido";
        swal("Error", "El texto de la pregunta es requerido", "error", {
          button: false,
        });
      }

      if (question.respuestas.length === 0) {
        errors[`questionOptions${index}`] =
          "Debe agregar al menos una opción a la pregunta";
        swal(
          "Error",
          "Debe agregar al menos una opción a la pregunta",
          "error",
          {
            button: false,
          }
        );
      }

      if (!question.respuestas.some((answer) => answer.es_correcta === 1)) {
        errors[`questionCorrectOption${index}`] =
          "Debe seleccionar una opción correcta para la pregunta";
        swal(
          "Error",
          "Debe seleccionar una opción correcta para la pregunta",
          "error",
          {
            button: false,
          }
        );
      }
      question.respuestas.forEach((answer, answerIndex) => {
        if (!answer.texto) {
          errors[`answerText${index}${answerIndex}`] =
            "El texto de la respuesta es requerido";
          swal("Error", "El texto de la respuesta es requerido", "error", {
            button: false,
          });
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      // If there are any errors, log them and stop the function
      console.error(errors);
      /*swal("Error", errors[0], "error", {
        button: false,
      });*/

      return;
    }

    setIsLoading(true);
    axios
      .put(
        `https://localhost:7095/api/Estudiante/EditExam/${idExamen}`,
        examData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Exam updated siuuuuuu alaverga:", response.data);
        swal(
          "Examen actualizado",
          "El examen se ha actualizado correctamente.",
          "success",
          { button: false }
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error putamadre:", error);
        swal(
          "Error",
          "El examen no se pudo modificar. El examen ya ha sido contestado por un alumno",
          "error",
          { button: false }
        );
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="loader">
        <BarLoader color="#5A7C96" loading={isLoading} width={300} height={5} />
      </div>
    );
  }

  if (isLoading2) {
    return (
      <div className="loader">
        <BarLoader color="#5A7C96" loading={isLoading} width={300} height={5} />
      </div>
    );
  }

  if (!examData) {
    return <div>No exam data available.</div>;
  }

  return (
    <div className="edit-exam-edit">
      <h2> Dificultad: </h2>
      <div className="dificultades-edit">
        <label className="checkbox-label-edit">
          <input
            type="checkbox"
            className="form-checkbox-edit"
            name="dificultad"
            value="1"
            checked={examData.examen.dificultad_idDificultad === 1}
            onChange={handleDifficultyChange}
          />
          Fácil
        </label>

        <label className="checkbox-label-edit">
          <input
            type="checkbox"
            className="form-checkbox-edit"
            name="dificultad"
            value="2"
            checked={examData.examen.dificultad_idDificultad === 2}
            onChange={handleDifficultyChange}
          />
          Intermedio
        </label>

        <label className="checkbox-label-edit">
          <input
            type="checkbox"
            className="form-checkbox-edit"
            name="dificultad"
            value="3"
            checked={examData.examen.dificultad_idDificultad === 3}
            onChange={handleDifficultyChange}
          />
          Difícil
        </label>
      </div>

      {examData.preguntasYrespuestas.map((question, questionIndex) => (
        <div>
          <h3>Pregunta {questionIndex + 1}</h3>
          <div className="question-edit">
            <div className="contenedor-edit">
              <input
                className="form-input-edit"
                type="text"
                name="enunciado"
                value={question.pregunta.enunciado}
                onChange={(event) => handleInputChange(event, questionIndex)}
              />
              <button
                className="delete-answer-btn-edit"
                onClick={() => handleDeleteQuestion(questionIndex)}
              >
                Eliminar
              </button>
            </div>
          </div>
          <h4>Respuestas</h4>
          {question.respuestas.map((answer, answerIndex) => (
            <div className="answer-edit">
              <div className="contenedor-edit">
                {" "}
                {/* Updated this line */}
                <input
                  className="form-input-edit"
                  type="text"
                  name="texto"
                  value={answer.texto}
                  onChange={(event) =>
                    handleInputChange(event, questionIndex, answerIndex)
                  }
                />
                <button
                  onClick={() => handleDeleteAnswer(questionIndex, answerIndex)}
                  className="delete-answer-btn-edit"
                >
                  Eliminar
                </button>
              </div>
              <label className="checkbox-label-edit">
                ¿Es correcta?:
                <input
                  type="checkbox"
                  className="form-checkbox-edit"
                  name="es_correcta"
                  checked={answer.es_correcta === 1}
                  onChange={(event) =>
                    handleInputChange(event, questionIndex, answerIndex)
                  }
                />
              </label>
            </div>
          ))}
          <div className="div3">
            <button
              className="add-answer-btn-edit"
              onClick={() => {
                const currentQuestion =
                  examData.preguntasYrespuestas[questionIndex];
                if (currentQuestion.respuestas.length >= 4) {
                  return swal(
                    "Error",
                    "Solo puedes añadir un máximo de 4 respuestas por pregunta",
                    "error",
                    {
                      button: false,
                    }
                  );
                } else {
                  handleAddAnswer(questionIndex);
                }
              }}
            >
              Añadir respuesta
            </button>
          </div>
          <hr />
        </div>
      ))}
      <div className="div5-edit">
        <button className="add-question-btn-edit" onClick={handleAddQuestion}>
          Añadir pregunta
        </button>
        <button className="submit-btn-edit" onClick={handleUpdateExam}>
          Actualizar examen
        </button>
      </div>
    </div>
  );
};

export default EditExam;
