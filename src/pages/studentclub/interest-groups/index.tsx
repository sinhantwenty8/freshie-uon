import Header from "../../../components/website/studentclub/header";
import classes from "./index.module.css";
import InterestGroupList from "@/components/website/studentclub/interestGroupList";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface interestGroupsHeader {
  title: string;
  description: string;
  imageURL: string;
}

export default function interestGroups() {
  const [InterestGroupsHeader, setInterestGroupsHeader] =
    useState<interestGroupsHeader>({
      title: "",
      description: "",
      imageURL: "",
    });

  const getInterestGroupsHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-header")
    );
    const InterestGroupsHeader: interestGroupsHeader = {
      title: querySnapshot.docs[1].data().title,
      description: querySnapshot.docs[1].data().description,
      imageURL: querySnapshot.docs[1].data().imageURL,
    };
    setInterestGroupsHeader(InterestGroupsHeader);
  };

  useEffect(() => {
    setTimeout(() => {
      getInterestGroupsHeader();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header
        title={InterestGroupsHeader.title}
        description={InterestGroupsHeader.description}
        imageURL={InterestGroupsHeader.imageURL}
      ></Header>
      <InterestGroupList></InterestGroupList>
    </div>
  );
}
