import React, { useState, useEffect } from "react";

import classes from "./serviceList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import serviceItem from "@/pages/aboutus";
import ServiceItem from "./serviceItem";

interface serviceList {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  pageURL: string;
}

export default function ServiceList() {
  const [serviceItems, setServiceItems] = useState<serviceList[]>([]);

  const getServiceItems = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "tips-aboutus-page")
      );
      const serviceItems = [] as serviceList[];
      querySnapshot.forEach((doc) => {
        let docSlug = doc.id;
        if (docSlug.startsWith("picture-and-text")) {
          serviceItems.push({
            id: doc.id,
            ...doc.data(),
            title: doc.data().title,
          } as serviceList);
        }
      });

      setServiceItems(serviceItems);
    } catch (error) {
      console.error("Error fetching service items:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };

  useEffect(() => {
    setTimeout(() => {
        getServiceItems();
    }, 100);  
  }, []);

  if (serviceItems.length === 0) {
    return (
      <div className={classes.noServiceItems}>
        No service items data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.serviceListContainer}>
      {serviceItems.map((serviceList) => (
        <ServiceItem key={serviceList.id} service={serviceList} />
      ))}
    </div>
  );
}
