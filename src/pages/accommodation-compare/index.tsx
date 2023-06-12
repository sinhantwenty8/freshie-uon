import Header from "../../components/website/accommodation/header"
import classes from "./index.module.css"
import AccommodationCompareList from "@/components/website/accommodation/accommodationCompareList"
import "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface AccommodationCompareHeader{
    title : string,
    description : string,
    imageUrl : string,
}

export default function AccommodationCompare() {
  const [accommodationCompareHeader, setAccommodationCompareHeader] = useState<AccommodationCompareHeader>({title:"",description:"",imageUrl:""});
  const blogTitle = "accommodation-compare"

  const getAccommodationHeader = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "accommodation-header"));
    querySnapshot.forEach((doc)=>{
      console.log(blogTitle ==doc.id)
      let docSlug = doc.id;
      if(docSlug == blogTitle){
        const accommodationHeader : AccommodationCompareHeader = {title:querySnapshot.docs[0].data().title,description:querySnapshot.docs[0].data().description,imageUrl:querySnapshot.docs[0].data().imageUrl}; 
        setAccommodationCompareHeader(accommodationHeader)
      }
    })
  }, [blogTitle]);

  useEffect(() => {
    setTimeout(()=>{
        getAccommodationHeader()
    },100)
  }, []);

  return (
    <div className={classes.all}>
        <Header title={accommodationCompareHeader.title} description={accommodationCompareHeader.description} imageUrl={accommodationCompareHeader.imageUrl}></Header>
        <AccommodationCompareList></AccommodationCompareList>
    </div>
  )
}