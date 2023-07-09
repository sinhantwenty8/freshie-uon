import classes from "./studentClubItem.module.css";
import Link from "next/link";

interface StudentClub {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  detailedPageURL: string;
}

interface StudentClubItemProps {
  studentclub: StudentClub;
}

const StudentClubItem: React.FC<StudentClubItemProps> = ({ studentclub }) => {
  return (
    <div className={classes.studentClubContainer}>
      <img
        className={classes.image}
        src={studentclub.imageURL}
        alt=" Image"
      ></img>
      <div className={classes.contentContainer}>
        <h2 className={classes.title}>{studentclub.title}</h2>
        <p className={classes.description}>{studentclub.description}</p>
      </div>
      <Link href={studentclub.detailedPageURL}>
        <button className={classes.viewButton}>View More</button>
      </Link>
    </div>
  );
};

export default StudentClubItem;
