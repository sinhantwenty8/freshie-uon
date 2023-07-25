import classes from "./toDoHeader.module.css";

interface HeaderProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, imageUrl }) => {
  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <p className={classes.headerDescription}>{description}</p>
      <h1 className={classes.headerTitle}>{title}</h1>
    </div>
  );
};

export default Header;
