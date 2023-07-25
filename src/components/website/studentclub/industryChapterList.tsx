import React, { useState, useEffect } from "react";

import classes from "./industryChapterList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import industryChapter from "@/pages/studentclub";
import IndustryChapterItem from "./industryChapterItem";

interface industryChapter {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

export default function IndustryChapterList() {
  const [industryChapters, setIndustryChapters] = useState<industryChapter[]>(
    []
  );

  const getIndustryChapters = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "industrychapter-page")
      );
      const industryChapters = [] as industryChapter[];
      querySnapshot.forEach((doc) => {
        industryChapters.push({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title,
        } as industryChapter);
      });

      setIndustryChapters(industryChapters);
    } catch (error) {
      console.error("Error fetching industry chapters:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };

  useEffect(() => {
    getIndustryChapters();
  }, []);

  if (industryChapters.length === 0) {
    return (
      <div className={classes.noIndustryChapters}>
        No industry chapter data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.industryChapterListContainer}>
      {industryChapters.map((industryChapter) => (
        <IndustryChapterItem
          key={industryChapter.id}
          industrychapter={industryChapter}
        />
      ))}
    </div>
  );
}
