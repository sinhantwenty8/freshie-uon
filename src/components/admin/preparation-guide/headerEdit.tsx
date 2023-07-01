import classes from "./headerEdit.module.css";
import Link from "next/link";
import { TextField, Input } from "@mui/material";
import { useState } from "react";

interface HeaderEditProps {
  headerTitle: string;
  headerTitle2: string;
  headerImageUrl: string;
  setBannerTitle: (title: string) => void;
  setBannerTitle2: (title2: string) => void;
  setBannerImageUrl: (imageUrl: string) => void;
  setIsImageUploaded: (isImageUploaded: boolean) => void;
}

export default function HeaderEdit({
  headerTitle,
  headerImageUrl,
  headerTitle2,
  setBannerTitle,
  setBannerImageUrl,
  setBannerTitle2,
  setIsImageUploaded,
}: HeaderEditProps) {
  const [title, setTitle] = useState(headerTitle);
  const [title2, setTitle2] = useState(headerTitle2);
  const [uploadedImage, setUploadedImage] = useState(headerImageUrl);
  const [imageError, setImageError] = useState("");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setBannerTitle(event.target.value);
  };

  const handleTitle2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle2(event.target.value);
    setBannerTitle2(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedImage(imageUrl);
            setBannerImageUrl(imageUrl);
            setIsImageUploaded(true);
            setImageError("");
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageError("Invalid file type. Please upload an image.");
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <h3 className={classes.title}>Banner</h3>
        <div className={classes.textFieldContainer}>
          <h4 className={`${classes.subTitle} `}>Title :</h4>
          <TextField
            InputProps={{ className: classes.input }}
            sx={{ width: "300px" }}
            size="small"
            id="title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange} // Add this line
          />
        </div>
        <div className={classes.textFieldContainer}>
          <h4 className={`${classes.subTitle} `}>Title 2:</h4>
          <TextField
            InputProps={{ className: classes.input }}
            sx={{ width: "300px" }}
            size="small"
            id="title"
            variant="outlined"
            value={title2}
            onChange={handleTitle2Change} // Add this line
          />
        </div>
        <div className={classes.imgContainer}>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle}`}>Upload Image :</h4>
            <Input type="file" id="image" onChange={handleImageUpload} />
          </div>
          {imageError && (
            <p style={{ color: "red", textAlign: "end" }}>{imageError}</p>
          )}
          <div className={classes.textFieldContainer}>
            <img
              src={headerImageUrl}
              alt="Banner Image"
              className={classes.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
