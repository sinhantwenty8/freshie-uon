import React from "react";
import classes from "./header.module.css";

interface HeaderProps {
  title: string;
  title2: string;
  imageUrl: string;
}

const Header: React.FC<HeaderProps> = ({ title, title2, imageUrl }) => {
  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className={classes.headerContent}>
        <h1 className={classes.headerTitle}>{title}</h1>
        <div className={classes.dialogueIcon}>
          <div className={classes.dialogueRectangle} />
          <div className={classes.dialogueTriangle} />
          <span className={classes.dialogueText}>{title2}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
