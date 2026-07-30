import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./charInfo.scss";
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import not_found from "../../resources/img/not-found.jpg";

const CharInfo = (props) => {
  const { charId } = props;
  const [char, setChar] = useState(null);

  const { getCharacters, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }
    clearError();
    getCharacters(charId)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  return <div className="char__info">{setContent(process, char, View)}</div>;
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;
  const onError = (e) => {
    e.target.src = not_found;
    e.target.onerror = null;
  };
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt="abyss" onError={onError} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics this this character"}
        {comics.map((item, i) => {
          // eslint-disable-next-line
          if (i > 9) return;
          return (
            <li className="char__comics-item" key={i}>
              {item}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
