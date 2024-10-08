import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import Cards from "./Templates/Cards";
import Dropdown from "./Templates/Dropdown";
import Loading from "./Templates/Loading";
import Topnav from "./Templates/Topnav";
import gsap from "gsap";

const GenrePage = () => {
  const { pathname } = useLocation();
  const genreName = pathname.split("/")[2];

  const [genre, setGenre] = useState([]);
  const [category, setCategory] = useState("movie");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  document.title = "Filmpire | Genre";

  const genres = [
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 9648, name: "Mystery" },
    { id: 99, name: "Documentary" },
    { id: 35, name: "Comedy" },
    { id: 10759, name: "Action & Adventure" },
    { id: 10751, name: "Family" },
  ];

  const getGenre = async () => {
    const findGenre = genres.find((genre) =>
      genre.name.toLowerCase().includes(genreName.toLowerCase())
    );
    const findGenreId = findGenre ? findGenre.id : null;

    try {
      const numPagesToFetch = 4; // Number of pages to load in one go
      const requests = [];
      for (let i = 0; i < numPagesToFetch; i++) {
        requests.push(axios.get(`/discover/${category}?page=${page + i}`));
      }

      // Fetch all pages concurrently
      const responses = await Promise.all(requests);
      const allResults = responses.flatMap((response) => response.data.results);
      console.log(allResults);
      // Filter results based on genre
      const filteredResults = allResults.filter(
        (item) =>
          Array.isArray(item.genre_ids) &&
          item.genre_ids.find((genreId) => genreId === findGenreId)
      );

      // Update state
      setGenre((prevState) => [...prevState, ...filteredResults]);

      // Update page number for the next fetch
      setPage((prevPage) => prevPage + numPagesToFetch);
      setHasMore(allResults.length > 0); // Continue fetching if there's data
    } catch (error) {
      console.error("Failed to fetch genre data:", error);
    }
  };
  useEffect(() => {
    // Animate the <hr> element with a class of 'animated-hr'
    gsap.fromTo(
      ".animated-hr",
      { width: "0%" },
      { width: "100%", duration: 1 }
    );
  }, []);

  const refreshHandler = () => {
    setPage(1);
    setGenre([]);
    setHasMore(true);
    getGenre();
  };

  useEffect(() => {
    refreshHandler();
  }, [category]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-[100%] sm:w-[84%] sm:left-[16%] pt-[2%] relative">
      <div className="w-[100%] flex flex-col sm:flex-row items-center justify-between px-10 z-20">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {/* <Link to="/">
            <i className="ri-arrow-left-line hover:text-blue-400 text-2xl font-semibold text-white mr-2 sm:mr-5 hidden"></i>
          </Link> */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-400 sm:-mt-1 mr-[60vw] mt-[5vh] hidden sm:block">
            {genreName}
          </h1>
        </div>
        <div className="z-[10000]">
          <Topnav />
        </div>
        <div className="flex absolute sm:fixed z-[1000] right-[30%] sm:right-0 top-[6%] sm:top-[3.5%]">
          <Dropdown
            title="Filter"
            options={["movie", "tv"]}
            func={handleCategoryChange}
          />
        </div>
      </div>

      <hr className="animated-hr w-full h-[1px] border-none bg-blue-400 mt-[10vh] sm:mt-7" />


      <InfiniteScroll
        dataLength={genre.length}
        next={getGenre}
        hasMore={hasMore}
        loader={<Loading />}
      >
        <Cards data={genre} title={category} />
      </InfiniteScroll>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-7 bg-zinc-50 text-white p-2 rounded-full shadow-lg transition"
        >
          <i className="ri-arrow-up-s-line text-xl text-blue-600 font-semibold"></i>
        </button>
      )}
    </div>
  );
};

export default GenrePage;
