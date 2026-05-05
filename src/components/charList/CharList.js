import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";
import not_found from "../../resources/img/not-found.jpg";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    getCharList();
  }, []);

  const getCharList = () => {
    onCharListLoading();
    marvelService.getAllCharacters().then(onCharListLoaded).catch(onError);
  };

  const onCharListLoading = () => {
    setLoading(true);
    setError(false);
    setNewItemLoading(false);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setLoading((loading) => false);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const onRequest = (offset) => {
    setNewItemLoading(true);

    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const itemRefs = useRef([]);

  const setRef = (ref, i) => {
    itemRefs.current[i] = ref;
  };

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) => {
      item.classList.remove("char__item_selected");
    });
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? (
    <View
      charList={charList}
      onCharSelected={props.onCharSelected}
      setRef={setRef}
      focusOnItem={focusOnItem}
    />
  ) : null;
  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const View = ({ charList, onCharSelected, setRef, focusOnItem }) => {
  const onError = (e) => {
    e.target.src = not_found;
    e.target.onerror = null;
  };
  const char = charList.map((item, i) => {
    return (
      <li
        tabIndex="0"
        className="char__item"
        key={item.id}
        ref={(el) => setRef(el, i)}
        onClick={() => {
          onCharSelected(item.id);
          focusOnItem(i);
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            onCharSelected(item.id);
            focusOnItem(i);
          }
        }}
      >
        <img src={item.thumbnail} alt={item.name} onError={onError} />
        <div className="char__name">{item.name}</div>
      </li>
    );
  });
  return <ul className="char__grid">{char}</ul>;
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
