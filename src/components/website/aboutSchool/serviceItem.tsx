import { useState } from "react";
import Link from "next/link";
import classes from "./serviceItem.module.css";

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  pageUrl: string;
}

interface ServiceItemProps {
  service: Service;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  if(!service.pageUrl){
    service.pageUrl = ""
  }
  return (
    <Link href={service.pageUrl} passHref>
      <div
        className={`${classes.serviceContainer} ${
          hovered ? classes.hovered : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={classes.contentContainer}>
          <img className={classes.image} src={service.iconUrl} alt="Image" />
          <h2 className={classes.title}>{service.title}</h2>
          <div
            className={`${classes.descriptionContainer} ${
              hovered ? classes.hovered : ""
            }`}
          >
            <p className={classes.description}>{service.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceItem;
