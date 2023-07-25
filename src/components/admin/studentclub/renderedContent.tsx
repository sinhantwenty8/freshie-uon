import { Fragment, useCallback, useEffect, useState } from "react";
import { TextField, Input, makeStyles, Button, Modal } from "@mui/material";
import classes from "./renderedContent.module.css";
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

interface RenderedContentProps {
  index: number;
  id: string;
  sectionTitle: string;
  sectionSubTitle: string;
  sectionDescription: string;
  sectionImageURL: string;
  onDeleteSection: (id: string) => void; // Add this prop
  fetchContentSections: (collectionName: string) => void;
  databaseUrl: string;
  pageTitle: string;
}

export default function RenderedContent({
  index,
  id,
  sectionTitle,
  sectionSubTitle,
  sectionDescription,
  sectionImageURL,
  onDeleteSection,
  fetchContentSections,
  databaseUrl,
  pageTitle,
}: RenderedContentProps) {
  const [title, setTitle] = useState(sectionTitle);
  const [subtitle, setSubTitle] = useState(sectionSubTitle);
  const [description, setDescription] = useState(sectionDescription);
  const [uploadedImage, setUploadedImage] = useState(sectionImageURL);
  const [imageError, setImageError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [idSec, setIdSec] = useState(id);
  const [sectionImageURL1, setSectionImageURL1] = useState(sectionImageURL);

  let slug = "";
  if (databaseUrl === "industry-chapters") {
    slug = "industrychapter-page";
  } else if (databaseUrl === "interest-groups") {
    slug = "interestgroup-page";
  } else if (databaseUrl === "international-communities") {
    slug = "internationalcommunities-page";
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleSubTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTitle(event.target.value);
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
            const imageURL = e.target.result.toString();
            setUploadedImage(imageURL);
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
      await onDeleteSection(idSec);
      if (pageTitle == "industry-chapters") {
        pageTitle = "industrychapter-page";
      }
      if (pageTitle == "interest-groups") {
        pageTitle = "interestgroup-page";
      }
      if (pageTitle == "international-communities") {
        pageTitle = "internationalcommunities-page";
      }
      fetchContentSections(pageTitle);

      setModalMessage("Section successfully deleted. Please reload the page");
    } catch (error) {
      setModalMessage("An error occurred while deleting the section.");
    }

    setIsModalOpen(true);
  };

  const saveSection = async () => {
    if (!id) {
      console.log('hi')
      id = title.split(" ").join("-")
      setIdSec(id);
    }

    console.log(id,idSec)
    const storage = getStorage();
    const storageRef = ref(storage, `studentclub/${slug}-${idSec}`);

    try {
      const docRef = doc(getFirestore(), slug, id);
      const docSnap = await getDoc(docRef);

      if (isImageUploaded) {
        await uploadString(storageRef, uploadedImage, "data_url");
      }

      const imageURL = isImageUploaded
        ? await getDownloadURL(storageRef)
        : sectionImageURL;

      setSectionImageURL1(imageURL);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          title: title,
          description: description,
          imageURL: imageURL,
          subtitle:subtitle,
        });

        setModalMessage("Section successfully updated.");
      } else {
        await setDoc(docRef, {
          title: title,
          subtitle: subtitle,
          description: description,
          id: id,
          imageURL: imageURL,
        });

        setModalMessage("Section successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      console.log(error)
      if(title == ""){
        setModalMessage("Title cannot be empty.");
      }else{
      setModalMessage("An error occurred while saving the page.");
      }
      setIsModalOpen(true);
    }
  };

  return (
    <div key={id + index}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <h3 className={classes.title}>Page Section {index}</h3>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle} `}>Title :</h4>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "300px" }}
              size="small"
              id="title"
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle} `}>Subtitle :</h4>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "300px" }}
              size="small"
              id="title"
              variant="outlined"
              value={subtitle}
              onChange={handleSubTitleChange}
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
