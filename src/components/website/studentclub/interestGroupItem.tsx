import { useState } from "react";
import classes from "./interestGroupItem.module.css";
import Link from "next/link";

interface InterestGroup {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

interface InterestGroupItemProps {
  interestgroup: InterestGroup;
}

const InterestGroupItem: React.FC<InterestGroupItemProps> = ({
  interestgroup,
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
      className={`${classes.interestGroupContainer} ${
        hovered ? classes.hovered : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className={classes.image} src={interestgroup.imageURL} alt="Image" />
      <div className={classes.contentContainer}>
        <h2 className={classes.title}>{interestgroup.title}</h2>
        <p className={classes.subtitle}>{interestgroup.subtitle}</p>
        <div
          className={`${classes.descriptionContainer} ${
            hovered ? classes.hovered : ""
          }`}
        >
          <p className={classes.description}>{interestgroup.description}</p>
        </div>
      </div>
    </div>
  );
};

export default InterestGroupItem;
