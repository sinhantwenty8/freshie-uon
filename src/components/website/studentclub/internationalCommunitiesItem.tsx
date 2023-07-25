import { useState } from "react";
import classes from "./internationalCommunitiesItem.module.css";
import Link from "next/link";

interface InternationalCommunity {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

interface InternationalCommunityItemProps {
  internationalcommunity: InternationalCommunity;
}

const InternationalCommunityItem: React.FC<InternationalCommunityItemProps> = ({
  internationalcommunity,
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
      className={`${classes.internationalCommunityContainer} ${
        hovered ? classes.hovered : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className={classes.image}
        src={internationalcommunity.imageURL}
        alt="Image"
      />
      <div className={classes.contentContainer}>
        <h2 className={classes.title}>{internationalcommunity.title}</h2>
        <p className={classes.subtitle}>{internationalcommunity.subtitle}</p>
        <div
          className={`${classes.descriptionContainer} ${
            hovered ? classes.hovered : ""
          }`}
        >
          <p className={classes.description}>
            {internationalcommunity.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InternationalCommunityItem;
