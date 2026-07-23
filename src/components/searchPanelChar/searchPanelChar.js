import "../searchPanelChar/searchPanelChar.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useMarvelService from "../../services/MarvelService";

const CharSearchForm = () => {
  const [char, setChar] = useState();
  const { loading, error, getCharByName, clearError } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError();
    getCharByName(name).then(onCharLoaded);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
            {...register("charName")}
          />
          {errors.charName && (
            <div className="char__search-error">{errors.charName.message}</div>
          )}
          <button
            type="submit"
            className="button button__main"
            disabled={loading}
          >
            <div className="inner">find</div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharSearchForm;
