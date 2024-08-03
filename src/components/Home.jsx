import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import Dropdown from "./Templates/Dropdown";
import Header from "./Templates/Header";
import HorizontalCards from "./Templates/HorizontalCards";
import Loading from "./Templates/Loading";
import Sidenav from "./Templates/Sidenav";
import Topnav from "./Templates/Topnav";

const Home = () => {
  document.title = "FILMPIRE | Homepage";
  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [category, setCategory] = useState("tv");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to delay hiding the loading component
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900); // 1500ms = 1.5 seconds
    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const getWallpaper = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      let randomWallpaper =
        data.results[Math.floor(Math.random() * data.results.length)];
      setWallpaper(randomWallpaper);
    } catch (error) {
      console.log("Error fetching wallpaper: ", error);
    }
  };

  const getTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/${category}/day`);
      setTrending(data.results);
    } catch (error) {
      console.log("Error fetching trending data: ", error);
    }
  };

  useEffect(() => {
    if (!wallpaper) {
      getWallpaper();
    }
  }, [wallpaper]);

  useEffect(() => {
    getTrending();
  }, [category]);

  const handleCategoryChange = (value) => {
    setCategory(value); // Update category state
  };
  console.log("trending", trending);

  return isLoading ? (
    <Loading />
  ) : wallpaper && trending ? (
    <>
        <Sidenav />
      <div className="w-[84%] h-full overflow-x-auto">
        <Topnav />
        <Header data={wallpaper} />
        <div className="w-full h-[10vh] flex justify-between items-center py-7 z-10">
          <h1 className="text-2xl font-medium text-white pl-[1%] ">Trending</h1>
          <Dropdown
            title="Filter"
            options={["movie", "tv", "all"]}
            func={handleCategoryChange} // Pass handler function
          />
        </div>
        <HorizontalCards data={trending} />
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Home;
