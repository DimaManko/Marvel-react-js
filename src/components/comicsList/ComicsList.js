import "./comicsList.scss";

import useMarvelService from "../../services/MarvelService";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const ComicsList = (props) => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }

    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 8);
    setComicsEnded((comicsEnded) => ended);
  };

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllComics(offset)
      .then(onComicsListLoaded)
      .then(() => setProcess("confirmed"));
  };

  const renderItems = (comicsArr) => {
    const items = comicsArr.map((comics) => {
      return (
        <li className="comics__item" key={comics.id}>
          <Link to={`/comics/${comics.id}`}>
            <img
              src={comics.thumbnail}
              alt="ultimate war"
              className="comics__item-img"
            />
            <div className="comics__item-name">{comics.title}</div>
            <div className="comics__item-price">{comics.prices}$</div>
          </Link>
        </li>
      );
    });

    return <ul className="comics__grid">{items}</ul>;
  };

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comicsList), newItemLoading)}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
