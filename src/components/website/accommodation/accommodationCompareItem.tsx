import Link from "next/link";
import classes from "./accommodationCompareItem.module.css";
import AccommodationCompareSentence from "./accommodationCompareSentence";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

interface AccommodationAdvantage {
  id: string;
  category: string;
  description: string;
}

interface Props {
  accommodation: AccommodationAdvantage[];
  image: string;
}

const AccommodationCompareItem: React.FC<Props> = ({
  accommodation,
  image,
}) => {
  const [imageUrl, setImageUrl] = useState("");

  if (accommodation.length == 0) {
    return <p>Please try again later</p>;
  }

  const getCompareImageUrl = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "accommodation-advantage")
    );
    querySnapshot.forEach((doc) => {
      accommodation.forEach((accom) => {
        if (image == doc.id) {
          setImageUrl(doc.data().compareImageUrl);
        }
      });
    });
  };

  getCompareImageUrl();
  let url =
    "../../accommodation/what-is-a" + accommodation[0].category.toLowerCase();
  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{accommodation[0].category}</h3>
      <div>
        {accommodation.map((item) => (
          <AccommodationCompareSentence
            key={item.id}
            description={item.description}
          />
        ))}
      </div>
      <div className={classes.imageContainer}>
        <img
          src={imageUrl}
          className={classes.image}
          width={300}
          height={200}
          alt=""
        />
      </div>
      <Link href={url}>
        <button className={classes.viewButton}>View More</button>
      </Link>
    </div>
  );
};

export default AccommodationCompareItem;
