import React from "react";
import { Link } from "react-router-dom";

const MainPage: React.FC = () => {
  return (
    <div>
      <p>MainPage</p>
      <Link to={"/movie/:id"}>Go to movie</Link>
    </div>
  );
};

export default MainPage;
