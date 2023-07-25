import Header from "@/components/website/studentclub/header";
import classes from "./index.module.css";
import StudentClubList from "@/components/website/studentclub/studentClubList";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface studentClubHeader {
  title: string;
  description: string;
  imageURL: string;
}

export default function studentClub() {
  const [StudentClubHeader, setStudentClubHeader] = useState<studentClubHeader>(
    { title: "", description: "", imageURL: "" }
  );

  const getStudentClubHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-header")
    );
    const StudentClubHeader: studentClubHeader = {
      title: querySnapshot.docs[3].data().title,
      description: querySnapshot.docs[3].data().description,
      imageURL: querySnapshot.docs[3].data().imageURL,
    };
    setStudentClubHeader(StudentClubHeader);
  };

  useEffect(() => {
    setTimeout(() => {
      getStudentClubHeader();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header
        title={StudentClubHeader.title}
        description={StudentClubHeader.description}
        imageURL={StudentClubHeader.imageURL}
      ></Header>
      <StudentClubList></StudentClubList>
    </div>
  );
}
