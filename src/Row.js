import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
// import movieTrailer from "movie-trailer";
const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // Options for react-youtube
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const nameForSearch =
        movie?.name ||
        movie?.title ||
        movie?.original_name ||
        movie?.original_title ||
        "";

      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const query = `${nameForSearch}officialTrailer`;

      fetch(
        `https://www.googleapis.com/youtube/v3/search?q=${query}&key=AIzaSyD4-9_bf-c-B4NHokC3uWQ08T4nS9W955s`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrailerUrl(result.items[0].id.videoId);
        })

        .catch((error) => console.log("error", error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map(
          (movie) =>
            movie.backdrop_path !== null && (
              <img
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${baseImgUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                key={movie.id}
                onClick={() => handleClick(movie)}
              />
            )
        )}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
