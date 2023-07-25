import React, { useState } from "react";
import { TextField, Input, Button } from "@mui/material";
import { deleteDoc, doc, updateDoc, getFirestore } from "firebase/firestore";
import classes from "./foodWheel.module.css";

type Food = {
  id: string;
  name: string;
  foodShopLogo: string;
};

type FoodItemProps = {
  food: Food;
  updateFood: (foodId: string, updatedFood: Food) => void;
  deleteFood: (foodId: string) => void;
};

export default function FoodItem({
  food,
  updateFood,
  deleteFood,
}: FoodItemProps) {
  const [newFoodName, setNewFoodName] = useState<string>(food?.name || "");
  const [imageError, setImageError] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(food.foodShopLogo || "");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFoodName(event.target.value);
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
            setImageError("");
            setIsImageUploaded(true);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageError("Invalid file type. Please upload an image.");
      }
    }
  };

  const handleSaveClick = () => {
    const updatedFood: Food = {
      id: food.id,
      name: newFoodName,
      foodShopLogo: uploadedImage,
    };
    updateFood(food.id, updatedFood);
  };

  const handleDeleteClick = () => {
    deleteFood(food.id);
  };

  return (
    <div>
      <div key={food.id}>
        <div className={classes.container}>
          <div className={classes.innerContainer}>
            <h3 className={classes.title}>Food Wheel Item </h3>
            <div className={classes.textFieldContainer}>
              <h4 className={`${classes.subTitle} `}>Name :</h4>
              <TextField
                InputProps={{ className: classes.input }}
                sx={{ width: "300px" }}
                size="small"
                id="title"
                variant="outlined"
                value={newFoodName}
                onChange={handleNameChange}
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
                  src={uploadedImage}
                  alt="Banner Image"
                  className={classes.image}
                />
              </div>
            </div>
            <Button className={classes.button} onClick={handleSaveClick}>
              Save
            </Button>
            <Button className={classes.button} onClick={handleDeleteClick}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
