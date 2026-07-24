import "../searchPanelChar/searchPanelChar.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const schema = z.object({
  charName: z.string().trim().min(1, "This field is required"),
});

const CharSearchForm = () => {
  const [char, setChar] = useState(null);
  const { loading, error, getCharByName, clearError } = useMarvelService();
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
    clearError();
    getCharByName(name).then(onCharLoaded);
  };

  const errorMessage = error ? (
    <div className="char__search-critical-error">
      <ErrorMessage />
    </div>
  ) : null;

  const content = !char ? null : Object.keys(char).length === 0 ? (
    <div className="char__search-error">
      The character was not found. Check the name and try again
    </div>
  ) : (
    <div className="char__search-success">
      {`There is! Visit ${char.name} page?`}
      <Link to={`/character/${char.id}`} className="button button__secondary">
        <div className="inner">To page</div>
      </Link>
    </div>
  );

  const onSubmit = (data) => updateChar(data.charName); // Тут будет функция которая делает запрос за персонажем к АПИ
  return (
    <div className="char__search-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="char__search-label" htmlFor="charName">
          Or find a character by name:
        </label>
        <div className="char__search-wrapper">
          <input
            id="charName"
            name="charName"
            type="text"
            placeholder="Enter name"
            {...register("charName", {
              onChange: () => {
                setChar(null);
              },
            })}
          />

          <button
            type="submit"
            className="button button__main"
            disabled={loading}
          >
            <div className="inner">find</div>
          </button>
        </div>
      </form>
      {errors.charName && (
        <div className="char__search-error">{errors.charName.message}</div>
      )}
      {content}
      {errorMessage}
    </div>
  );
};

export default CharSearchForm;
