import Header from "../../../components/website/accommodation/header"
import classes from "./index.module.css"
import AccommodationCompareList from "@/components/website/accommodation/accommodationCompareList"
import "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import YouTube from 'react-youtube';
import { Button } from "@mui/material";
import Link from "next/link";

interface Section {
  id:string
  detailedPageUrl : string,
  title:string,
  description:string,
  imageUrl:string,
}

interface Header {
  title: string;
  description: string;
  imageUrl: string;
}

export default function AboutSG() {
  const [header, setHeader] = useState<Header>({title:"",description:"",imageUrl:""});
  const blogTitle = "about-sg"
  const [sections,setSections] = useState<Section[]>([])

  const getAboutSgHeader = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "getting-around-header"));
    querySnapshot.forEach((doc) => {
      if (doc.id == blogTitle) {
        const accommodationHeader: Header = {
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        setHeader(accommodationHeader);
      }
    });
  }, [blogTitle]);

  const getAboutSGSection = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "getting-around"));
    const pageSections : Section[] =[];
    querySnapshot.forEach((doc)=>{
      let docSlug = doc.id;
      console.log(doc.id)
      if(docSlug.startsWith("getting-around-sg-"+blogTitle+'-section')){
        const section : Section = {id:doc.id,detailedPageUrl:doc.data().detailedPageUrl,title:doc.data().title,description:doc.data().description,imageUrl:doc.data().imageUrl}; 
        pageSections.push(section)
      }
      setSections(pageSections);
    })
  }, [sections]);

  useEffect(() => {
    setTimeout(()=>{
        getAboutSgHeader()
        getAboutSGSection()
    },100)
  }, []);

  return (
    <div className={classes.all}>
        <Header
            title={header.title}
            description={header.description}
            imageUrl={header.imageUrl}
          />
        <div className={classes.sectionsContainer}>
            <div className={classes.sectionContainer}>
              {sections.map((section, index) => {
  const isEven = index % 2 === 0;
  const containerOrder = isEven ? classes.evenContainerOrder : classes.oddContainerOrder;
  return (
    <div className={`${classes.section} ${containerOrder}`} key={section.id}>
      <div className={classes.leftContainer}>
        <p className={classes.sectionDescription}>{section.description}</p>
        <Link href={`/getting-around-sg/${section.detailedPageUrl}`}>
          <button className={classes.sectionButton}>Learn More</button>
        </Link>
      </div>
      <div className={classes.rightContainer}>
        <h3 className={classes.sectionTitle}>{section.title}</h3>
        <img src={section.imageUrl} className={classes.sectionImage} width={300} height={300} />
      </div>
    </div>
  );
})}

            </div>
        </div>
     </div>
  )
}