import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";
import Cover from "../components/Cover";
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario
import bot from "../images/boton.png";
import bot1 from "../images/quitar.png";
import "../styles/Examen.css";

const schema = yup.object().shape({
  examen: yup.object().shape({
    dificultad_idDificultad: yup
      .string()
      .required("Se necesita una dificultad"),
    nombreExamen: yup.string().required("Se necesita un nombre de examen"),
  }),
  preguntasYrespuestas: yup.array().of(
    yup.object().shape({
      pregunta: yup.object().shape({
        enunciado: yup.string(),
      }),
      respuestas: yup.array().of(
        yup.object().shape({
          texto: yup.string(),
          es_correcta: yup.boolean(),
        })
      ),
    })
  ),
});

const defaultValues = {
  examen: {
    grupo_idGrupo: "",
    dificultad_idDificultad: "1",
    nombreExamen: "",
  },
  preguntasYrespuestas: [
    {
      pregunta: {
        enunciado: "",
      },
      respuestas: [
        {
          texto: "",
          es_correcta: false,
        },
      ],
    },
  ],
};

const ExamForm = ({
  register,
  control,
  handleSubmit,
  errors,
  fields,
  append,
  remove,
  onSubmit,
}) => (
  <form
    className="examen-form"
    onSubmit={handleSubmit(onSubmit, (errors) => {
      console.log(errors);
      swal("Error", "Completa todos los campos", "error", {
        button: false,
      });
    })}
  >
    <h2 className="form-title">Crear examen</h2>

    <div className="form-group-dificultades">
      <li className="taco">
        <label className="difficulty-label">
          <input
            type="radio"
            value="1"
            {...register("examen.dificultad_idDificultad")}
            className="form-radio"
          />{" "}
          Fácil
        </label>
      </li>
      {/* lista para centrar los valores */}
      <li className="taco">
        {/* Valores para la clases intermedias */}
        <label className="difficulty-label">
          <input
            type="radio"
            value="2"
            {...register("examen.dificultad_idDificultad")}
            className="form-radio"
          />{" "}
          Moderado
        </label>
      </li>
      {/* Lista para centrar los valores */}
      <li className="taco">
        {/* Modo dialo mi gente  */}
        <label className="difficulty-label">
          <input
            type="radio"
            value="3"
            {...register("examen.dificultad_idDificultad")}
            className="form-radio"
          />{" "}
          Difícil
        </label>
      </li>
    </div>

    <div className="form-group">
      <input
        {...register("examen.nombreExamen")}
        placeholder="Nombre del examen"
        className="form-input-name"
      />
    </div>
    <hr />

    {fields.map((item, index) => (
      <QuestionField
        key={item.id}
        register={register}
        control={control}
        errors={errors}
        field={item}
        index={index}
        remove={remove}
      />
    ))}

    {/* boton para agregar preguntas */}

    <ul className="listas">
      {/* Boton subir pregunta */}
      <li className="but-sub derecha">
        <button type="submit" className="submit-btn">
          Crear examen
        </button>
      </li>

      <li className="but-sub izquierda">
        <button
          type="button"
          onClick={() =>
            append({
              pregunta: {
                enunciado: "",
              },
              respuestas: [
                {
                  texto: "",
                  es_correcta: false,
                },
              ],
            })
          }
          className="add-question-btn"
        >
          Agregar pregunta
        </button>
      </li>
    </ul>
  </form>
);

const QuestionField = ({ register, control, errors, field, index, remove }) => (
  <div className="question-block">
    <div className="form-group">
      <input
        {...register(`preguntasYrespuestas.${index}.pregunta.enunciado`)}
        placeholder="Inserta la pregunta"
        className="form-input"
      />
      {errors.preguntasYrespuestas?.[index]?.pregunta?.enunciado && (
        <p>{errors.preguntasYrespuestas[index].pregunta.enunciado.message}</p>
      )}

      <button
        type="button"
        onClick={() => remove(index)}
        className="delete-answer-btn"
      >
        Eliminar
      </button>
    </div>

    <Controller
      control={control}
      name={`preguntasYrespuestas.${index}.respuestas`}
      render={({ field: { onChange, value } }) => (
        <div className="answers-block">
          {value.map((r, i) => (
            <div key={i} className="answer">
              <div className="contenedor">
                <input
                  {...register(
                    `preguntasYrespuestas.${index}.respuestas.${i}.texto`
                  )}
                  placeholder="Inserta la respuesta"
                  className="form-input-answer"
                  defaultValue={r.texto}
                  onChange={(e) => {
                    const updatedAnswers = [...value];
                    updatedAnswers[i].texto = e.target.value;
                    onChange(updatedAnswers);
                  }}
                />

                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  className="delete-answer-btn"
                >
                  Eliminar
                </button>
              </div>
              <li>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register(
                      `preguntasYrespuestas.${index}.respuestas.${i}.es_correcta`
                    )}
                    className="form-checkbox"
                    defaultChecked={r.es_correcta}
                    onChange={(e) => {
                      const updatedAnswers = [...value];
                      updatedAnswers[i].es_correcta = e.target.checked;
                      onChange(updatedAnswers);
                    }}
                  />{" "}
                  ¿Es correcta?
                </label>
              </li>
              <ul className="boton-centrado"></ul>
            </div>
          ))}

          <li className="boton-izquierda">
            <button
              type="button"
              onClick={() => {
                const lastAnswer = value[value.length - 1];

                if (value.length >= 4) {
                  return swal(
                    "Error",
                    "Solo puedes añadir un máximo de 4 respuestas por pregunta",
                    "error",
                    {
                      button: false,
                    }
                  );
                }
                if (value.length === 0) {
                  onChange([
                    ...value,
                    {
                      texto: "",
                      es_correcta: false,
                    },
                  ]);
                } else if (lastAnswer.texto.trim() !== "") {
                  onChange([
                    ...value,
                    {
                      texto: "",
                      es_correcta: false,
                    },
                  ]);
                } else {
                  return swal(
                    "Error",
                    "Para agregar más respuestas necesitas tener texto",
                    "error",
                    {
                      button: false,
                    }
                  );
                }
              }}
              className="add-answer-btn"
            >
              Agregar respuesta
            </button>
          </li>
        </div>
      )}
    />
    <hr />
  </div>
);

const Examen = () => {
  const location = useLocation();
  const { groupId } = location.state;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};
  const formatData = (data) => {
    let examen = {
      grupo_idGrupo: groupId,
      dificultad_idDificultad: parseInt(data.examen.dificultad_idDificultad),
      nombreExamen: data.examen.nombreExamen,
    };

    let preguntasYrespuestas = data.preguntasYrespuestas.map((item) => {
      let pregunta = {
        enunciado: item.pregunta.enunciado,
      };

      let respuestas = item.respuestas.map((answer) => {
        return {
          texto: answer.texto,
          es_correcta: answer.es_correcta ? 1 : 0, // assuming it's a boolean and 0 = false, 1 = true
        };
      });

      return {
        pregunta: pregunta,
        respuestas: respuestas,
      };
    });

    return {
      examen: examen,
      preguntasYrespuestas: preguntasYrespuestas,
    };
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "preguntasYrespuestas",
  });

  const checkFormValidity = (data) => {
    if (!data.preguntasYrespuestas || data.preguntasYrespuestas.length === 0) {
      return {
        isValid: false,
        message: "Por favor añade mínimo una pregunta",
      };
    }

    const hasEmptyQuestion = data.preguntasYrespuestas.some(
      (question) => question.pregunta.enunciado.trim() === ""
    );
    if (hasEmptyQuestion) {
      return {
        isValid: false,
        message:
          "Todas las respuestas deben tener texto. Por favor complete las respuestas vacías",
      };
    }

    const hasEmptyAnswer = data.preguntasYrespuestas.some((question) =>
      question.respuestas.some((answer) => {
        const isAnswerEmpty = answer.texto.trim() === "";
        if (isAnswerEmpty) {
          console.log("Found an empty answer:", answer);
        }
        return isAnswerEmpty;
      })
    );
    if (hasEmptyAnswer) {
      return {
        isValid: false,
        message:
          "Todas las respuestas deben tener texto. Por favor complete las respuestas vacías",
      };
    }

    const hasNoRightAnswer = data.preguntasYrespuestas.some((question) =>
      question.respuestas.every((answer) => !answer.es_correcta)
    );
    if (hasNoRightAnswer) {
      return {
        isValid: false,
        message: "Cada pregunta debe tener al menos una respuesta correcta",
      };
    }

    const hasNoWrongAnswer = data.preguntasYrespuestas.some((question) =>
      question.respuestas.every((answer) => answer.es_correcta)
    );
    if (hasNoWrongAnswer) {
      return {
        isValid: false,
        message: "Cada pregunta debe tener al menos una respuesta correcta",
      };
    }

    return { isValid: true };
  };

  const onSubmit = async (data) => {
    console.log(data); // Esta línea muestra los datos del formulario en la consola.

    const formValidity = checkFormValidity(data);

    // Verificar los resultados de validación
    if (!formValidity.isValid) {
      swal("Error", formValidity.message, "error", {
        button: false,
      });
      return;
    }

    const formattedData = formatData(data);
    try {
      const token = Cookies.get("token"); // Obtener el token de la cookie

      const response = await axios.post(
        "https://localhost:7095/api/Estudiante/CreateExam",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Incluir el token de autorización en los headers
          },
        }
      );

      const responseData = response.data;
      console.log(responseData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateAnother = () => {
    reset(defaultValues);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    swal("Completado", "El examen ha sido creado con éxito", "success", {
      button: false,
    });
    return handleCreateAnother();
  }

  return (
    <div>
      <Cover user={user} onLogout={onLogout}>
        {" "}
      </Cover>
      <br />
      <br />
      <br />
      <ExamForm
        register={register}
        handleSubmit={handleSubmit}
        control={control}
        onSubmit={onSubmit}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
      />
    </div>
  );
};

export default Examen;
