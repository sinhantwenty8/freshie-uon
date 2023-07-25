import { Fragment, useCallback, useEffect, useState } from "react";
import { TextField, Input, makeStyles, Button, Modal } from "@mui/material";
import classes from "./renderedSection.module.css";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

interface RenderedSectionProps {
  index: number;
  id: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionImageUrl: string;
  onDeleteSection: (id: string) => void; // Add this prop
  fetchPageSections: () => void;
  num: string;
}

export default function RenderedSection({
  index,
  id,
  sectionTitle,
  sectionDescription,
  sectionImageUrl,
  onDeleteSection,
  fetchPageSections,
  num,
}: RenderedSectionProps) {
  const [title, setTitle] = useState(sectionTitle);
  const [description, setDescription] = useState(sectionDescription);
  const [uploadedImage, setUploadedImage] = useState(sectionImageUrl);
  const [imageError, setImageError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [idSec, setIdSec] = useState(id);
  const [sectionImageUrl1, setSectionImageUrl1] = useState(sectionImageUrl);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
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

  const deleteSection = async () => {
    try {
      onDeleteSection(idSec);
      fetchPageSections();

      setModalMessage("Section successfully deleted.Please reload the page");
    } catch (error) {
      setModalMessage("An error occurred while deleting the section.");
    }

    setIsModalOpen(true);
  };
  console.log('re 1')

  const saveSection = async () => {
    if (!id) {
      id = "what-we-do-" + num;
      setIdSec(id);
    }
    const storage = getStorage();
    const storageRef = ref(storage, `aboutus-page/` + id + "-icon");
    console.log(id);
    try {
      const docRef = doc(getFirestore(), "aboutus-page", id);
      const docSnap = await getDoc(docRef);

      if (isImageUploaded) {
        await uploadString(storageRef, uploadedImage, "data_url");
      }

      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : sectionImageUrl;
      setSectionImageUrl1(imageUrl);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          title: title,
          description: description,
          iconUrl: imageUrl,
        });
        setModalMessage("Section successfully updated.");
      } else {
        await setDoc(docRef, {
          title: title,
          description: description,
          id: id,
          iconUrl: imageUrl,
        });
        setModalMessage("Section successfully added.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  return (
    <div key={id + index}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <h3 className={classes.title}>Section {index}</h3>
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
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle}`}>Description :</h4>
            <TextField
              InputProps={{ className: classes.inputMultiline }}
              sx={{ width: "300px" }}
              id="title"
              multiline={true}
              variant="outlined"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <Button className={classes.button} onClick={saveSection}>
            Save
          </Button>
          <Button className={classes.button} onClick={deleteSection}>
            Delete
          </Button>
        </div>
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          className={classes.modal}
        >
          <div className={classes.modalContainer}>
            <h2>{modalMessage}</h2>
            <Button variant="contained" onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
