import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";
import { Outlet } from "react-router-dom";

const ComicsPage = () => {
  return (
    <>
      <AppBanner />
      <ComicsList />
    </>
  );
};

export default ComicsPage;
