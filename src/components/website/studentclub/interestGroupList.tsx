import React, { useState, useEffect } from "react";
import classes from "./interestGroupList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import interestGroup from "@/pages/studentclub";
import InterestGroupItem from "./interestGroupItem";

interface InterestGroup {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

export default function InterestGroupList() {
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);

  const getInterestGroups = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "interestgroup-page")
      );
      const interestGroups = [] as InterestGroup[];
      querySnapshot.forEach((doc) => {
        interestGroups.push({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title,
        } as InterestGroup);
      });

      setInterestGroups(interestGroups);
    } catch (error) {
      console.error("Error fetching industry chapters:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };

  useEffect(() => {
    getInterestGroups();
  }, []);

  if (interestGroups.length === 0) {
    return (
      <div className={classes.noInterestGroups}>
        No interest groups data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.interestGroupListContainer}>
      {interestGroups.map((interestGroup) => (
        <InterestGroupItem
          key={interestGroup.id}
          interestgroup={interestGroup}
        />
      ))}
    </div>
  );
}
