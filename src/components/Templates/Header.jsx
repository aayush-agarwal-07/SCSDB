import React from "react";
import { Link } from "react-router-dom";
import useWindowSize from "../../customHooks/useIsSmallScreen";

const Header = ({ data }) => {
  const size = useWindowSize();
  const imageUrl = `url(https://image.tmdb.org/t/p/original/${
    data.backdrop_path || data.profile_path
  })`;
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), ${imageUrl}`,
        backgroundPosition: "top",
        backgroundSize: "cover",
      }}
      className="h-[550px] w-full rounded flex flex-col justify-end p-[3%]"
    >
      <h1 className="text-3xl text-white font-bold">
        {data.name || data.title || data.original_name || data.original_title}
      </h1>
      <p className="w-[95%] sm:w-[50%] font-normal text-white">
        {size.width >= 640
          ? data.overview.slice(0, 400)
          : data.overview.slice(0, 200)}{" "}
        <span className="hover:text-blue-500 cursor-pointer">
          <Link to={`/${data.media_type}/details/${data.id}}`}>...more</Link>
        </span>
      </p>
      <div className="flex gap-5 mt-1">
        <h5 className="text-white">
          <i className="ri-megaphone-fill text-[#1277D3] mr-1"></i>
          {data.release_date || "No Information"}
        </h5>
        <h5 className="text-white">
          <i className="ri-disc-fill text-[#1277D3] mr-1"></i>
          {data.media_type.toUpperCase()}
        </h5>
      </div>
      <Link
        to={`/${data.media_type}/details/${data.id}/trailer`}
        className="bg-[#1277D3] text-white w-[140px] h-[35px] flex items-center justify-center rounded-3xl 
      mt-2"
      >
        Watch Trailer
      </Link>
    </div>
  );
};

export default Header;
