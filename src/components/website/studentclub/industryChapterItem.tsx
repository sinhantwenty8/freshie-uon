import { useState } from "react";
import classes from "./industryChapterItem.module.css";
import Link from "next/link";

interface IndustryChapter {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

interface IndustryChapterItemProps {
  industrychapter: IndustryChapter;
}

//const IndustryChapterItem: React.FC<IndustryChapterItemProps> = ({
//  industrychapter,
//}) => {
//  return (
//    <div className={classes.industryChapterContainer}>
//      <img
//        className={classes.image}
//        src={industrychapter.imageURL}
//        alt=" Image"
//      ></img>
//      <div className={classes.contentContainer}>
//        <h2 className={classes.title}>{industrychapter.title}</h2>
//      </div>
//    </div>
//  );
//};

const IndustryChapterItem: React.FC<IndustryChapterItemProps> = ({
  industrychapter,
}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className={`${classes.industryChapterContainer} ${
        hovered ? classes.hovered : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className={classes.image}
        src={industrychapter.imageURL}
        alt="Image"
      />
      <div className={classes.contentContainer}>
        <h2 className={classes.title}>{industrychapter.title}</h2>
        <p className={classes.subtitle}>{industrychapter.subtitle}</p>
        <div
          className={`${classes.descriptionContainer} ${
            hovered ? classes.hovered : ""
          }`}
        >
          <p className={classes.description}>{industrychapter.description}</p>
        </div>
      </div>
    </div>
  );
};

export default IndustryChapterItem;
