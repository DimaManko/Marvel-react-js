import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();

  const _apiBase = "https://marvel-server-zeta.vercel.app/";
  const _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
  const _baseOffset = 0;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`,
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacters = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`,
    );
    const transformedComics = res.data.results.map(_transformComics);
    return transformedComics;
  };

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const getCharByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);

    return res.data.results.length > 0
      ? _transformCharacter(res.data.results[0])
      : null;
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? char.description.length > 200
          ? `${char.description.slice(0, 200)}...`
          : char.description
        : "Описание персонажа пока отсутствует:(",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description,
      pageCount: comics.pageCount,
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      language: comics.textObjects.languages,
      prices: comics.prices[0].price,
    };
  };
  return {
    process,
    setProcess,
    getAllCharacters,
    getCharacters,
    clearError,
    getAllComics,
    getComics,
    getCharByName,
  };
};

export default useMarvelService;
