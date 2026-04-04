import { Component } from "react";
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
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.getCharList();
  }

  onCharListLoaded = (charList) => {
    this.setState({ charList, loading: false });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharListLoading = () => {
    this.setState({
      loading: true,
      error: false,
    });
  };

  getCharList = () => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  render() {
    const { charList, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? (
      <View charList={charList} onCharSelected={this.props.onCharSelected} />
    ) : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charList, onCharSelected }) => {
  const onError = (e) => {
    e.target.src = not_found;
    e.target.onerror = null;
  };
  const char = charList.map((item) => {
    return (
      <li
        className="char__item"
        key={item.id}
        onClick={() => onCharSelected(item.id)}
      >
        <img src={item.thumbnail} alt={item.name} onError={onError} />
        <div className="char__name">{item.name}</div>
      </li>
    );
  });
  return <ul className="char__grid">{char}</ul>;
};

export default CharList;
