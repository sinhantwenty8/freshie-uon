import { useEffect, useState, useCallback } from "react";
import AccommodationCompareItem from "./accommodationCompareItem";
import classes from "./accommodationCompareList.module.css";
import { collection, getDocs, getFirestore } from "firebase/firestore";

interface AccommodationAdvantage {
  id: string;
  category: string;
  description: string;
}

export default function AccommodationCompareList() {
  const [accommodationAdvantages, setAccommodationAdvantages] = useState<
    AccommodationAdvantage[]
  >([]);
  const [category, setCategory] = useState<string[]>([]);
  const [hdbAdvantages, setHdbAdvantages] = useState<AccommodationAdvantage[]>(
    []
  );
  const [condoAdvantages, setCondoAdvantages] = useState<
    AccommodationAdvantage[]
  >([]);

  const getAccommodationAdvantages = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "accommodation-advantage")
    );
    const accommodationAdvantageList = [] as AccommodationAdvantage[];
    querySnapshot.forEach((doc) => {
      accommodationAdvantageList.push({
        id: doc.id,
        ...doc.data(),
      } as AccommodationAdvantage);
      let newCategory = doc.data().category;
      if (!(newCategory in category)) {
        setCategory((category) => [newCategory, ...category]);
      }
    });
    setAccommodationAdvantages(accommodationAdvantageList);
  };

  const filterAccommodation = useCallback(() => {
    accommodationAdvantages.forEach((accommodation) => {
      if (accommodation.category == category[1]) {
        setHdbAdvantages((hdbList) => [...hdbList, accommodation]);
      } else if (accommodation.category == category[0]) {
        setCondoAdvantages((condoList) => [...condoList, accommodation]);
      }
    });
  }, [accommodationAdvantages]);

  useEffect(() => {
    setTimeout(() => {
      getAccommodationAdvantages();
    }, 100);
  }, []);

  useEffect(() => {
    filterAccommodation();
  }, [filterAccommodation]);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Advantages</h2>
      <div className={classes.compareItemContainer}>
        <AccommodationCompareItem
          image={`HDB`}
          accommodation={hdbAdvantages}
        ></AccommodationCompareItem>
        <AccommodationCompareItem
          image={`Condo`}
          accommodation={condoAdvantages}
        ></AccommodationCompareItem>
      </div>
    </div>
  );
}
