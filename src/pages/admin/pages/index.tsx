import Header from "@/components/admin/header";
import { useRouter } from "next/router";
import classes from "./index.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";

interface Accommodation {
  id: string;
  category: string;
  compareImageUrl: string;
}

export default function DetailPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const { pageId } = router.query; // assuming your query parameter is named "id"
  const urlArray: string[] = currentUrl.split("/");
  const [accommodation, setAccommodation] = useState<Accommodation>({
    id: "",
    category: "",
    compareImageUrl: "",
  });

  const getAccommodationHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "accommodation")
    );
    querySnapshot.forEach((doc) => {
      let category = doc.data().category;
      console.log(urlArray);
      if (category.toLowerCase() == urlArray[3]) {
        setAccommodation({
          id: doc.id,
          category: doc.data().category,
          compareImageUrl: doc.data().compareImageUrl,
        });
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      getAccommodationHeader();
      console.log(accommodation);
      console.log(pageId);
    }, 100);
  }, []);

  if (accommodation.category == "") {
    return (
      <div className={classes.container}>
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Header id={accommodation.id} category={accommodation.category}></Header>
    </div>
  );
}
