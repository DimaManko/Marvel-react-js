import { Component } from "react";
import PropTypes from "prop-types";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";
import not_found from "../../resources/img/not-found.jpg";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 0,
    charEnded: false,
  };

  marvelService = new MarvelService();

  itemRefs = [];

  componentDidMount() {
    this.getCharList();
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharListLoading = () => {
    this.setState({
      loading: true,
      error: false,
      newItemLoading: false,
    });
  };

  getCharList = () => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onRequest = (offset) => {
    this.setState({
      newItemLoading: true,
    });
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  setRef = (ref, i) => {
    this.itemRefs[i] = ref;
  };

  focusOnItem = (id) => {
    this.itemRefs.forEach((item) => {
      item.classList.remove("char__item_selected");
    });
    this.itemRefs[id].classList.add("char__item_selected");
    this.itemRefs[id].focus();
  };

  render() {
    const { charList, loading, error, offset, newItemLoading, charEnded } =
      this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? (
      <View
        charList={charList}
        onCharSelected={this.props.onCharSelected}
        setRef={this.setRef}
        focusOnItem={this.focusOnItem}
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
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

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
