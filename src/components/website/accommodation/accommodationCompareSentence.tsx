import classes from "./accommodationCompareSentence.module.css";
import GppGoodIcon from "@mui/icons-material/GppGood";

interface CompareSentenceProps {
  description: string;
}

const AccommodationCompareSentence: React.FC<CompareSentenceProps> = ({
  description,
}) => {
  return (
    <div className={classes.container}>
      <GppGoodIcon className={classes.icon}></GppGoodIcon>
      <p className={classes.description}>{description}</p>
    </div>
  );
};

export default AccommodationCompareSentence;
