import classes from "./accommodationItem.module.css";
import Link from "next/link";

interface Accommodation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  detailedPageUrl: string;
  // add any other relevant properties here
}

interface AccommodationItemProps {
  accommodation: Accommodation;
}

const AccommodationItem: React.FC<AccommodationItemProps> = ({
  accommodation,
}) => {
  return (
    <div className={classes.accommodationContainer}>
      <div className={classes.titleDiv}>
        <h2 className={classes.title}>{accommodation.title}</h2>
        <Link href="../accommodation-compare" className={classes.compareButton}>
          <p>Compare</p>
        </Link>
      </div>
      <div className={classes.imageContainer}>
        <p className={classes.description}>{accommodation.description}</p>
        <img
          className={classes.image}
          src={accommodation.imageUrl}
          alt="HDB Image"
          width={200}
          height={200}
        ></img>
      </div>
      <Link href={accommodation.detailedPageUrl}>
        <button className={classes.viewButton}>View More</button>
      </Link>
    </div>
  );
};

export default AccommodationItem;
