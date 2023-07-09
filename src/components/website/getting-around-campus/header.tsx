import classes from "./header.module.css";

interface HeaderProps {
  title: string;
  description1: string;
  description2: string;
  drawingUrl: string;
  image1Url: string;
  image2Url: string;
  image3Url: string;
  image4Url: string;
  image5Url: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description1,
  description2,
  drawingUrl,
  image1Url,
  image2Url,
  image3Url,
  image4Url,
  image5Url,
}) => {
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.firstContainer}>
          <div className={classes.titleContainer}>
            <h1 className={classes.headerTitle}>{title}</h1>
            <img className={classes.headerImage} src={drawingUrl}></img>
          </div>
          <p className={classes.headerDescription}>
            {description1}
            <br></br>
          </p>
          <div className={classes.imageContainer1}>
            <img className={classes.headerImage1} src={image1Url}></img>
          </div>
        </div>
        <div className={classes.imageContainer2}>
          <img className={classes.headerImage2} src={image2Url}></img>
          <img className={classes.headerImage3} src={image3Url}></img>
        </div>
        <div className={classes.imageContainer3}>
          <img className={classes.headerImage4} src={image4Url}></img>
          <img className={classes.headerImage5} src={image5Url}></img>
        </div>
      </div>
      <div className={classes.circle}></div>
    </div>
  );
};

export default Header;
