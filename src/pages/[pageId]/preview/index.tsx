import classes from "./index.module.css"
import AccommodationList from "@/components/website/accommodation/accommodationList"
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Header from "@/components/website/accommodation/header";


interface AccommodationHeader{
    title : string,
    description : string,
    imageUrl : string,
}

export default function AccommodationPreview() {
  const [accommodationHeader, setAccommodationHeader] = useState<AccommodationHeader>({title:"",description:"",imageUrl:""});
   
  const getAccommodationHeader = async() =>{
  const querySnapshot = await getDocs(collection(getFirestore(), "accommodation-header-preview"));
  querySnapshot.forEach((doc)=>{
    if(doc.id=="accommodation"){
        const accommodationHeader : AccommodationHeader = {title:doc.data().title,description:doc.data().description,imageUrl:doc.data().imageUrl}; 
        setAccommodationHeader(accommodationHeader)
    }
  })
  }

  useEffect(() => {
    setTimeout(()=>{
        getAccommodationHeader().then(()=>console.log(accommodationHeader))
    },100)
  }, []);

  return (
    <div className={classes.all}>
        <Header title={accommodationHeader.title} description={accommodationHeader.description} imageUrl={accommodationHeader.imageUrl}></Header>
        <AccommodationList preview={true}></AccommodationList>
    </div>
  )
}