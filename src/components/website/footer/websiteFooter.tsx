import { useState, useEffect } from "react";
import classes from "./websiteFooter.module.css";
import { initializeApp } from "firebase/app";
import uonLogo from "@/images/uon-logo.png";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className={classes.footerContainer}>
      <div className={classes.logoContainer}>
        <h1 className={classes.title}>
          Freshie <sup>UON</sup>
        </h1>
      </div>
      <div className={classes.logoContainer}>
        <div className={classes.copyright}>
          © {new Date().getFullYear()} FreshieUON. All rights reserved.
        </div>
      </div>
      <div className={classes.logoContainerRight}>
        <div>
          {/* <img src="/images/uon-logo.png" alt="Logo" className={classes.logo} /> */}
          <div
            className={classes.imageContainer}
            style={{
              backgroundImage: `url(${uonLogo.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: 150,
              height: 55,
              marginRight: "auto",
            }}
          ></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
