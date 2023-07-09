import Header from "../../../components/website/studentclub/header";
import classes from "./index.module.css";
import InternationalCommunitiesList from "@/components/website/studentclub/internationalCommunitiesList";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface internationalCommunitiesHeader {
  title: string;
  description: string;
  imageURL: string;
}

export default function internationalCommunities() {
  const [InternationalCommunitiesHeader, setInternationalCommunitiesHeader] =
    useState<internationalCommunitiesHeader>({
      title: "",
      description: "",
      imageURL: "",
    });

  const getInternationalCommunitiesHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-header")
    );
    const InternationalCommunitiesHeader: internationalCommunitiesHeader = {
      title: querySnapshot.docs[2].data().title,
      description: querySnapshot.docs[2].data().description,
      imageURL: querySnapshot.docs[2].data().imageURL,
    };
    setInternationalCommunitiesHeader(InternationalCommunitiesHeader);
  };

  useEffect(() => {
    setTimeout(() => {
      getInternationalCommunitiesHeader();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header
        title={InternationalCommunitiesHeader.title}
        description={InternationalCommunitiesHeader.description}
        imageURL={InternationalCommunitiesHeader.imageURL}
      ></Header>
      <InternationalCommunitiesList></InternationalCommunitiesList>
    </div>
  );
}
