// import AccommodationItem from "./accommodationItem"
// import classes from "./accommodationList.module.css"
// import firebase from "firebase/app";
// import "firebase/firestore";

// interface Accommodation {
//   title: string;
//   description: string;
//   imageUrl: string;
//   detailedPageUrl : string;
//   // add any other relevant properties here
// }

// const accommodations: Accommodation[] = [
//   {
//     title: "What is a HDB Flat",
//     description: "We'll provide you with all the essential information you need to know about these affordable public housing units, including their features, restrictions, and regulations. Whether you're a Singaporean citizen, a permanent resident, or a foreigner looking to rent or purchase an HDB flat, we've got you covered.",
//     imageUrl: "/images/hdb.jpg",
//     detailedPageUrl:"",
//   },
//   {
//     title: "What is a HDB Flat",
//     description: "We'll provide you with all the essential information you need to know about these affordable public housing units, including their features, restrictions, and regulations. Whether you're a Singaporean citizen, a permanent resident, or a foreigner looking to rent or purchase an HDB flat, we've got you covered.",
//     imageUrl: "/images/hdb.jpg",
//     detailedPageUrl:"",
//   },
// ];

// export default function AccommodationList() {
//   if (accommodations.length == 0) {
//     return <div className={classes.noAccommodation}>No accommodation data available. Try again later.</div>;
//   }

//   return (
//     <div className={classes.accommodationListContainer}>
//         {accommodations.map((accommodation,index) =>(
//          <AccommodationItem key={index} accommodation={accommodation}></AccommodationItem>
//         ))}
//     </div>
//   )
// }
import AccommodationItem from "./accommodationItem";
import classes from "./accommodationList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface Accommodation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  detailedPageUrl: string;
  // add any other relevant properties here
}

interface AccommodationListProps {
  preview: Boolean;
}

const AccommodationList: React.FC<AccommodationListProps> = ({ preview }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  let url =
    preview == true ? "accommodation-page-preview" : "accommodation-page";

  const getAccommodations = async () => {
    try {
      const querySnapshot = await getDocs(collection(getFirestore(), url));
      const accommodations = [] as Accommodation[];
      querySnapshot.forEach((doc) => {
        console.log(accommodations, preview);
        accommodations.push({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title,
        } as Accommodation);
      });
      setAccommodations(accommodations);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getAccommodations();
    }, 100);
  }, []);

  if (accommodations.length === 0) {
    return (
      <div className={classes.noAccommodation}>
        No accommodation data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.accommodationListContainer}>
      {accommodations.map((accommodation, index) => (
        <AccommodationItem
          key={accommodation.id}
          accommodation={accommodation}
        ></AccommodationItem>
      ))}
    </div>
  );
};

export default AccommodationList;
