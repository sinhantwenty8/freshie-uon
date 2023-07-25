import { useState } from "react";
import classes from "./index.module.css";
import { useRouter } from "next/router";

interface Headerprops {
  id: string;
  category: string;
  urlArray?: string[];
}

export default function Header({ id, category, urlArray }: Headerprops) {
  if (urlArray?.length == 0) {
    return (
      <div>
        <p>Page not found</p>
      </div>
    );
  }
  console.log(category, "category");

  const sentence = (
    <div>
      {urlArray?.map((par, index) => (
        <span key={id}>
          <span>
            {par === "" || par === "admin"
              ? ""
              : par[0].toUpperCase() + par.substring(1)}
          </span>
          <span>
            {index == urlArray.length - 1 || par === "" || par === "admin" ? (
              ""
            ) : (
              <span> &gt; </span>
            )}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        {urlArray
          ? urlArray[urlArray?.length - 1][0].toUpperCase() +
            urlArray[urlArray?.length - 1].substring(1)
          : category}
      </h1>
      {sentence}
    </div>
  );
}
