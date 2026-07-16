import { useState, useEffect, useRef, createRef, useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";
import "./charList.scss";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";
import not_found from "../../resources/img/not-found.jpg";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const onRequest = (offset, inital) => {
    inital ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
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
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  const content = (
    <View
      charList={charList}
      onCharSelected={props.onCharSelected}
      setRef={setRef}
      focusOnItem={focusOnItem}
    />
  );
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
    const itemRef = createRef(null);
    return (
      <CSSTransition
        key={item.id}
        timeout={500}
        classNames={"char__item"}
        nodeRef={itemRef}
      >
        <li
          tabIndex="0"
          className="char__item"
          ref={(el) => {
            itemRef.current = el;
            setRef(el, i);
          }}
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
      </CSSTransition>
    );
  });
  return (
    <TransitionGroup className="char__grid" component="ul">
      {char}
    </TransitionGroup>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
