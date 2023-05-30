import Header from "../../components/website/accommodation/header";
import classes from "./index.module.css";
import AccommodationList from "@/components/website/accommodation/accommodationList";
import "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

interface AccommodationHeader {
  title: string;
  description: string;
  imageUrl: string;
}

export default function Accommodation() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  const pageId = urlArray[1];
  const [isLoading, setIsLoading] = useState(true);
  const [accommodationHeader, setAccommodationHeader] = useState<AccommodationHeader>({
    title: "",
    description: "",
    imageUrl: "",
  });

  const getAccommodationHeader = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "accommodation-header"));
    querySnapshot.forEach((doc) => {
      if (doc.id === pageId) {
        const accommodationHeader: AccommodationHeader = {
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        setAccommodationHeader(accommodationHeader);
      }
    });
  }, [pageId]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      getAccommodationHeader().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [getAccommodationHeader]);

  return (
    <div className={classes.all}>
      {accommodationHeader.title ? (
        <>
          <Header
            title={accommodationHeader.title}
            description={accommodationHeader.description}
            imageUrl={accommodationHeader.imageUrl}
          />
          <AccommodationList preview={false} />
        </>
      ) : (
        <p>Page not found</p>
      )}
    </div>
  );
}
