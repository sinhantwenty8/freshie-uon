import classes from "./studentClubList.module.css";
import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import studentClub from "@/pages/studentclub";
import StudentClubItem from "./studentClubItem";

interface studentClub {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  detailedPageURL: string;
  // add any other relevant properties here
}

export default function studentClubList() {
  const [studentClubs, setStudentClubs] = useState<studentClub[]>([]);

  const getStudentClubs = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "studentclub-page")
      );
      const studentClubs = [] as studentClub[];
      querySnapshot.forEach((doc) => {
        studentClubs.push({
          id: doc.id,
          ...doc.data(),
          title: doc.data().title,
        } as studentClub);
      });

      setStudentClubs(studentClubs);
    } catch (error) {
      console.error("Error fetching student clubs:", error);
      // Handle the error (e.g., display an error message or retry the fetching process)
    }
  };
  // Call getStudentClubs in useEffect or any other appropriate place to fetch the data

  useEffect(() => {
    getStudentClubs();
  }, []);

  if (studentClubs.length === 0) {
    return (
      <div className={classes.noStudentClubs}>
        No student club data available. Try again later.
      </div>
    );
  }

  return (
    <div className={classes.studentClubListContainer}>
      {studentClubs.map((studentClub, index) => (
        <StudentClubItem
          key={studentClub.id}
          studentclub={studentClub}
        ></StudentClubItem>
      ))}
    </div>
  );
}
