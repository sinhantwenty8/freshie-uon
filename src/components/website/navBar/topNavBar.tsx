import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import classes from "./topNavBar.module.css";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";

interface TopNavBarProps {
  children: React.ReactNode;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ children }) => {
  const [activeLink, setActiveLink] = useState("");
  const router = useRouter();
  const link = router.asPath;
  console.log(link, "hi");

  const handleMouseEnter = (link: string) => {
    // Check if the provided link starts with the activeLink value
    // If it does, set the activeLink to the main link
    if (link.startsWith("about")) {
      setActiveLink("about");
    } else if (link.startsWith("academic")) {
      setActiveLink("academic");
    } else if (link.startsWith("getting-around")) {
      setActiveLink("getting-around");
    } else if (link.startsWith("studentlife")) {
      setActiveLink("studentlife");
    } else if (link.startsWith("support")) {
      setActiveLink("support");
    } else if (link.startsWith("testimonials")) {
      setActiveLink("testimonials");
    } else {
      setActiveLink("home");
    }
  };

  const handleMouseLeave = () => {
    setActiveLink("");
  };

  return (
    <main className={classes.container}>
      <div className={classes.navbarcontainer}>
        <h3 className={classes.title}>
          Freshie <sup className={classes.titleSup}>UON</sup>
        </h3>
        <div className={classes.navbar}>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "home" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("home")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="home">
              Home
            </a>
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "about" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("about")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="about">
              About
            </a>
            {activeLink === "about" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="./aboutus">
                  About Us
                </a>
                <a className={classes.subLink} href="./aboutschool">
                  About School
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "academic" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("academic")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="./courses">
              Academic
            </a>
            {activeLink === "academic" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="./courses">
                  Courses
                </a>
                <a className={classes.subLink} href="./tips">
                  Tips & Tricks
                </a>
                <a className={classes.subLink} href="./preparation-guide">
                  Preparation Guide
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "getting-around" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("getting-around")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="getting-around">
              Getting Around
            </a>
            {activeLink === "getting-around" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="getting-around-sg">
                  Getting Around SG
                </a>
                <a className={classes.subLink} href="getting-around-campus">
                  Getting Around Campus
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "studentlife" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("studentlife")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="studentclub">
              Student Life
            </a>
            {activeLink === "studentlife" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="./accommodation">
                  Accommodation
                </a>
                <a className={classes.subLink} href="./studentclub">
                  Student Club
                </a>
                <a className={classes.subLink} href="./student-stories">
                  Student Stories
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "support" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("support")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="support">
              Support
            </a>
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "testimonials" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("testimonials")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="testimonials">
              Testimonials
            </a>
          </div>
        </div>
        <div></div>
      </div>
      <div style={{ width: "100%" }}>{children}</div>
    </main>
  );
};

export default TopNavBar;
