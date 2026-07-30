import { useParams } from "react-router-dom";
import SingleLayoutPage from "../SingleLayoutPage/SingleLayoutPage";
import { useEffect, useState } from "react";
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { getComics, clearError, getCharacters, process, setProcess } =
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
        getComics(id)
          .then(onDataLoaded)
          .then(() => setProcess("confirmed"));
        break;
      case "charName":
        getCharacters(id)
          .then(onDataLoaded)
          .then(() => setProcess("confirmed"));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppBanner />
      {setContent(process, { data, dataType }, SingleLayoutPage)}
    </>
  );
};

export default SinglePage;
