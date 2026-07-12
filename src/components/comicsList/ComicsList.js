import "./comicsList.scss";

import useMarvelService from "../../services/MarvelService";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";

const ComicsList = (props) => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, loading, error } = useMarvelService();

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

    getAllComics(offset).then(onComicsListLoaded);
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
            <div className="comics__item-price">{comics.prices}</div>
          </Link>
        </li>
      );
    });

    return <ul className="comics__grid">{items}</ul>;
  };

  const items = renderItems(comicsList);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  return (
    <div className="comics__list">
      {items}
      {errorMessage}
      {spinner}
      <button className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
