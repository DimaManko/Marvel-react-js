import "../searchPanelChar/searchPanelChar.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";
import { Link } from "react-router-dom";

const setContent = (process, char) => {
  switch (process) {
    case "waiting":
      return null;
    case "loading":
      return <Spinner />;
    case "notFound":
      return (
        <div className="char__search-error">
          The character was not found. Check the name and try again
        </div>
      );
    case "confirmed":
      return (
        <div className="char__search-success">
          {`There is! Visit ${char.name} page?`}
          <Link
            to={`/character/${char.id}`}
            className="button button__secondary"
          >
            <div className="inner">To page</div>
          </Link>
        </div>
      );
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const schema = z.object({
  charName: z.string().trim().min(1, "This field is required"),
});

const CharSearchForm = () => {
  const [char, setChar] = useState(null);
  const { getCharByName, clearError, process, setProcess } = useMarvelService();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError?.();
    setProcess("loading");

    getCharByName(name)
      .then((res) => {
        onCharLoaded(res);

        setProcess(!res ? "notFound" : "confirmed");
      })
      .catch(() => {
        setProcess("error");
      });
  };

  const onSubmit = (data) => updateChar(data.charName);

  return (
    <div className="char__search-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="char__search-label" htmlFor="charName">
          Or find a character by name:
        </label>
        <div className="char__search-wrapper">
          <input
            id="charName"
            type="text"
            placeholder="Enter name"
            {...register("charName", {
              onChange: () => {
                setChar(null);
                setProcess("waiting");
              },
            })}
          />

          <button
            type="submit"
            className="button button__main"
            disabled={process === "loading"}
          >
            <div className="inner">find</div>
          </button>
        </div>
      </form>
      {errors.charName && (
        <div className="char__search-error">{errors.charName.message}</div>
      )}
      {setContent(process, char)}
    </div>
  );
};

export default CharSearchForm;
