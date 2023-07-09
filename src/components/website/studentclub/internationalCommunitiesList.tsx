import React, { useState, useEffect } from "react";
import classes from "./internationalCommunitiesList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import internationalCommunities from "@/pages/studentclub";
import InternationalCommunityItem from "./internationalCommunitiesItem";

interface internationalCommunity {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  subtitle: string;
}

export default function InternationalCommunitiesList() {
  const [internationalCommunities, setInternationalCommunities] = useState<
    internationalCommunity[]
  >([]);

  const getInternationalCommunities = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "internationalcommunities-page")
      );
      const internationalCommunities = [] as internationalCommunity[];
      querySnapshot.forEach((doc) => {
        internationalCommunities.push({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title,
        } as internationalCommunity);
      });

      setInternationalCommunities(internationalCommunities);
    } catch (error) {
      console.error("Error fetching industry chapters:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };

  useEffect(() => {
    getInternationalCommunities();
  }, []);

  if (internationalCommunities.length === 0) {
    return (
      <div className={classes.noInternationalCommunities}>
        No international communities data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.internationalCommunitiesListContainer}>
      {internationalCommunities.map((internationalCommunity) => (
        <InternationalCommunityItem
          key={internationalCommunity.id}
          internationalcommunity={internationalCommunity}
        />
      ))}
    </div>
  );
}
