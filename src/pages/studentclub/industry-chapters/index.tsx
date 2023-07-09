import Header from "../../../components/website/studentclub/header";
import classes from "./index.module.css";
import IndustryChapterList from "@/components/website/studentclub/industryChapterList";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface industryChaptersHeader {
  title: string;
  description: string;
  imageURL: string;
}

export default function industryChapters() {
  const [IndustryChaptersHeader, setIndustryChaptersHeader] =
    useState<industryChaptersHeader>({
      title: "",
      description: "",
      imageURL: "",
    });

  const getIndustryChaptersHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-header")
    );
    const IndustryChaptersHeader: industryChaptersHeader = {
      title: querySnapshot.docs[0].data().title,
      description: querySnapshot.docs[0].data().description,
      imageURL: querySnapshot.docs[0].data().imageURL,
    };
    setIndustryChaptersHeader(IndustryChaptersHeader);
  };

  useEffect(() => {
    setTimeout(() => {
      getIndustryChaptersHeader();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header
        title={IndustryChaptersHeader.title}
        description={IndustryChaptersHeader.description}
        imageURL={IndustryChaptersHeader.imageURL}
      ></Header>
      <IndustryChapterList></IndustryChapterList>
    </div>
  );
}
