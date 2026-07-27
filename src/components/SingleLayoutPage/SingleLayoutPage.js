import "./SingleLayoutPage.scss";

import { Link } from "react-router-dom";

const SingleLayoutPage = ({ data, dataType }) => {
  const { title, name, description, pageCount, thumbnail, language, prices } =
    data;

  const displayName = title || name;

  const backPath = dataType === "comics" ? "/comics" : "/";
  const imgStyleClass =
    dataType === "comics"
      ? "single-layout-page__img single-layout-page__img_comic"
      : "single-layout-page__img single-layout-page__img_char";
  return (
    <div className="single-layout-page">
      <img src={thumbnail} alt={displayName} className={imgStyleClass} />
      <div className="single-layout-page__info">
        <h2 className="single-layout-page__name">{displayName}</h2>
        <p className="single-layout-page__descr">{description}</p>
        {dataType !== "comics" ? null : (
          <>
            <p className="single-layout-page__descr">{pageCount} pages</p>
            <p className="single-layout-page__descr">Language: {language}</p>
            <div className="single-layout-page__price">{prices}$</div>
          </>
        )}
      </div>
      <Link to={backPath} className="single-layout-page__back">
        Back to all
      </Link>
    </div>
  );
};

export default SingleLayoutPage;
