/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface RootObject {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}
interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function Home() {
  const [movies, setMovies] = useState<RootObject>();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [searchPage, setSearchPage] = useState<number>(1);

  useEffect(() => {
    if (search) {
      searchMovie();
    } else {
      fetchMovies();
    }
  }, [page, searchPage, search]);

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_TOKEN,
    },
  };

  const searchOptions = {
    method: "GET",
    url: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&page=${searchPage}&query=${search}`,
  };

  function nextPage() {
    if (search) {
      setSearchPage(searchPage + 1);
    } else {
      setPage(page + 1);
    }
  }

  function previousPage() {
    if (search) {
      if (searchPage > 1) setSearchPage(searchPage - 1);
    } else {
      if (page > 1) setPage(page - 1);
    }
  }

  function goHome() {
    setPage(1);
    setSearchPage(1);
    setSearch("");
    fetchMovies();
  }

  async function fetchMovies() {
    axios
      .request(options)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function searchMovie() {
    axios
      .request(searchOptions)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      setPage(1);
      setSearchPage(1);
    }
  }

  return (
    <main className="bg-blue-800">
      <div className="flex items-center justify-center w-full bg-orange-400 p-8">
        <div>
          <input
            className="border-spacing-2 border-black bg-white h-10 w-full mx-auto"
            type="text"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="items-center justify-between p-24 text-white grid grid-cols-4 gap-4">
        {movies?.results.map((movie) => (
          <div
            key={movie.id}
            className="bg-slate-400 flex flex-col items-center justify-center h-60 w-30"
          >
            <h1>{movie.title}</h1>
            <img
              className="w-24"
              src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
              alt=""
            />
          </div>
        ))}
      </div>

      <p className="text-white text-center">
        Página Atual {search ? searchPage : page}
      </p>
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-red-600 rounded-md w-40 my-20"
          onClick={previousPage}
        >
          Página anterior
        </button>
        <button className="bg-red-600 rounded-md w-40 my-20" onClick={nextPage}>
          Próxima página
        </button>
        <button className="bg-red-600 rounded-md w-40 my-20" onClick={goHome}>
          Home
        </button>
      </div>
    </main>
  );
}
