import classes from "./header.module.css";

interface HeaderProps {
  title: string;
  description: string;
  imageURL: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, imageURL }) => {
  console.log(imageURL);
  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${imageURL})` }}
    >
      <h1 className={classes.headerTitle}>{title}</h1>
      <p className={classes.headerDescription}>{description}</p>
    </div>
  );
};

export default Header;
