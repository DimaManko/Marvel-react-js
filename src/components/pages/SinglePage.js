import { useParams } from "react-router-dom";
import SingleLayoutPage from "../SingleLayoutPage/SingleLayoutPage";
import { useEffect, useState } from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { loading, error, getComics, clearError, getCharacters } =
    useMarvelService();

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onDataLoaded = (data) => {
    setData(data);
  };

  const updateData = () => {
    clearError();
    switch (dataType) {
      case "comics":
        getComics(id).then(onDataLoaded);
        break;
      case "charName":
        getCharacters(id).then(onDataLoaded);
        break;
      default:
        break;
    }
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !data) ? (
    <SingleLayoutPage data={data} dataType={dataType} />
  ) : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SinglePage;
