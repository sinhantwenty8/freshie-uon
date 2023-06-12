import { Inter } from "next/font/google";
import classes from "./topNavBar.module.css";
import PersonIcon from "@mui/icons-material/Person";

interface TopNavBarProps {
  children: React.ReactNode;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ children }) => {
  return (
    <main className={classes.container}>
      <div className={classes.navbarcontainer}>
        <h3 className={classes.title}>
          Freshie <sup>UON</sup>
        </h3>
        <div className={classes.navbar}>
          <a className={classes.link} href="about">
            About
          </a>
          <a className={classes.link}>Community</a>
          <a className={classes.link}>Services</a>
          <a className={classes.link}>FAQ</a>
          <a className={classes.link}>Support</a>
          <a className={classes.link}>Testimonial</a>
        </div>
        <PersonIcon className={classes.loginIcon}></PersonIcon>
      </div>
      {children}
    </main>
  );
};

export default TopNavBar;
