import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./compareSection.module.css";
import { Button, Input, Modal, TextField } from "@mui/material";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

interface AccommodationAdvantage {
  id: string;
  category: string;
  description: string;
}

export default function CompareSection() {
  const [newAdvantage, setNewAdvantage] = useState<AccommodationAdvantage>({
    id: "",
    category: "",
    description: "",
  });
  const [hdbAdvantages, setHdbAdvantages] = useState<AccommodationAdvantage[]>(
    []
  );
  const [condoAdvantages, setCondoAdvantages] = useState<
    AccommodationAdvantage[]
  >([]);
  const [editAdvantageId, setEditAdvantageId] = useState<string | null>(null);
  const [uploadedFirstImage, setUploadedFirstImage] = useState("");
  const [uploadedSecondImage, setUploadedSecondImage] = useState("");
  const [firstImageError, setFirstImageError] = useState("");
  const [secondImageError, setSecondImageError] = useState("");
  const [isFirstImageUploaded, setIsFirstImageUploaded] = useState(false);
  const [isSecondImageUploaded, setIsSecondImageUploaded] = useState(false);
  const firestore = getFirestore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [categories, setCategories] = useState<String[]>([]);
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");

  const getAccommodationAdvantages = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "accommodation-advantage")
    );
    const accommodationAdvantageList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AccommodationAdvantage[];

    setHdbAdvantages(
      accommodationAdvantageList.filter(
        (advantage) => advantage.category === category2
      )
    );
    setCondoAdvantages(
      accommodationAdvantageList.filter(
        (advantage) => advantage.category === category1
      )
    );
  };

  useEffect(() => {
    getAccommodationAdvantages();
  }, [categories]);

  const getCategories = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "accommodation-advantage")
    );
    const categories = querySnapshot.docs.map((doc) => doc.data().category);
    setCategories(categories);
    setCategory1(categories[0]);
    setCategory2(categories[1]);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const addAdvantage = async () => {
    try {
      const docRef = await addDoc(
        collection(firestore, "accommodation-advantage"),
        newAdvantage
      );
      const newAdvantageWithId = { ...newAdvantage, id: docRef.id };
      const docRefUpdate = await setDoc(docRef, { ...newAdvantageWithId });

      if (newAdvantageWithId.category === category2) {
        setHdbAdvantages((prevAdvantages) => [
          ...prevAdvantages,
          newAdvantageWithId,
        ]);
      } else if (newAdvantageWithId.category === category1) {
        setCondoAdvantages((prevAdvantages) => [
          ...prevAdvantages,
          newAdvantageWithId,
        ]);
      }

      // Clear the input fields
      setNewAdvantage({ id: "", category: "", description: "" });
    } catch (error) {
      // Handle the error
      console.error("Error adding advantage:", error);
    }
  };

  const deleteAdvantage = async (id: string) => {
    try {
      const docRef = doc(firestore, "accommodation-advantage", id);
      await deleteDoc(docRef);
      setHdbAdvantages((prevAdvantages) =>
        prevAdvantages.filter((advantage) => advantage.id !== id)
      );
      setCondoAdvantages((prevAdvantages) =>
        prevAdvantages.filter((advantage) => advantage.id !== id)
      );
    } catch (error) {
      // Handle the error
      console.error("Error deleting advantage:", error);
    }
  };

  const saveAdvantage = async (advantage: AccommodationAdvantage) => {
    try {
      const { id, ...advantageData } = advantage;
      await updateDoc(
        doc(firestore, "accommodation-advantage", id),
        advantageData
      );
      setEditAdvantageId(null);
    } catch (error) {
      // Handle the error
      console.error("Error updatingadvantage:", error);
    }
  };

  const cancelEditAdvantage = () => {
    setEditAdvantageId(null);
  };

  const getImageUrl = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "accommodation-advantage")
    );
    querySnapshot.forEach((doc) => {
      if ("Condo" == doc.id) {
        setUploadedFirstImage(doc.data().compareImageUrl);
      }

      if ("HDB" == doc.id) {
        setUploadedSecondImage(doc.data().compareImageUrl);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getImageUrl();
    }, 100);
  }, []);

  const handleFirstImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedFirstImage(imageUrl);
            setIsFirstImageUploaded(true);
            setFirstImageError("");
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFirstImageError("Invalid file type. Please upload an image.");
      }
    }
  };

  const handleSecondImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedSecondImage(imageUrl);
            setIsSecondImageUploaded(true);
            setSecondImageError("");
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFirstImageError("Invalid file type. Please upload an image.");
      }
    }
  };

  const saveFirstImage = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `accommodation/accommodation-compare-first-image`
    );

    try {
      if (isFirstImageUploaded) {
        await uploadString(storageRef, uploadedFirstImage, "data_url");
      }
      const imageUrl = isFirstImageUploaded
        ? await getDownloadURL(storageRef)
        : uploadedFirstImage;
      const docRef = doc(getFirestore(), "accommodation-advantage", "Condo");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { compareImageUrl: imageUrl });
        setModalMessage("Image successfully updated.");
      } else {
        await setDoc(docRef, { compareImageUrl: imageUrl });
        setModalMessage("Image successfully added.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the image.");
      setIsModalOpen(true);
    }
  };

  const saveSecondImage = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `accommodation/accommodation-compare-second-image`
    );

    try {
      if (isFirstImageUploaded) {
        await uploadString(storageRef, uploadedFirstImage, "data_url");
      }
      const imageUrl = isFirstImageUploaded
        ? await getDownloadURL(storageRef)
        : uploadedFirstImage;
      const docRef = doc(getFirestore(), "accommodation-advantage", "HDB");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { compareImageUrl: imageUrl });
        setModalMessage("Image successfully updated.");
      } else {
        await setDoc(docRef, { compareImageUrl: imageUrl });
        setModalMessage("Image successfully added.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the image.");
      setIsModalOpen(true);
    }
  };

  const onCategory2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = event.target.value;
    setCategory2(newCategory);

    // Update the category for all advantages in Section 2
    setHdbAdvantages((prevAdvantages) =>
      prevAdvantages.map((advantage) => ({
        ...advantage,
        category: newCategory,
      }))
    );
  };

  const onCategory1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = event.target.value;
    setCategory1(newCategory);

    // Update the category for all advantages in Section 1
    setCondoAdvantages((prevAdvantages) =>
      prevAdvantages.map((advantage) => ({
        ...advantage,
        category: newCategory,
      }))
    );
  };

  const saveCategory1 = async () => {
    try {
      const batch = writeBatch(firestore);

      // Update the category for each accommodation advantage in the condoAdvantages array
      condoAdvantages.forEach((advantage) => {
        const advantageRef = doc(
          firestore,
          "accommodation-advantage",
          advantage.id
        );
        batch.update(advantageRef, { category: category1 });
      });

      // Update the category in the categories collection
      const docRef = doc(getFirestore(), "accommodation-advantage", "category");
      const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { category1: category1 });

      // Commit the batch write
      await batch.commit().then(() => {
        setModalMessage("Category successfully updated.");
        setIsModalOpen(true);
      });

      setEditAdvantageId(null); // Clear the editAdvantageId state to exit edit mode
    } catch (error) {
      // Handle the error
      setModalMessage("Error updating category:" + error);
      setIsModalOpen(true);
    }
  };

  // Similarly, modify the saveCategory2 function for Section 2
  const saveCategory2 = async () => {
    try {
      const batch = writeBatch(firestore);

      // Update the category for each accommodation advantage in the hdbAdvantages array
      hdbAdvantages.forEach((advantage) => {
        const advantageRef = doc(
          firestore,
          "accommodation-advantage",
          advantage.id
        );
        batch.update(advantageRef, { category: category2 });
      });

      // Update the category in the categories collection
      const docRef = doc(getFirestore(), "accommodation-advantage", "category");
      const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { category2: category2 });

      // Commit the batch write
      await batch.commit().then(() => {
        setModalMessage("Category successfully updated.");
        setIsModalOpen(true);
      });

      console.log("Category updated successfully");
      setEditAdvantageId(null); // Clear the editAdvantageId state to exit edit mode
    } catch (error) {
      // Handle the error
      setModalMessage("Error updating category:" + error);
      setIsModalOpen(true);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.titleContainer}>
          <h3 className={classes.title}>Section 1</h3>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle}`}>Category</h4>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "310px" }}
              size="small"
              id="width"
              variant="outlined"
              onChange={onCategory1Change}
              value={category1}
            />
          </div>
          <button
            className={classes.saveCategoryButton}
            onClick={saveCategory1}
          >
            Save Category
          </button>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle}`}>Upload Image </h4>
            <Input type="file" id="image" onChange={handleFirstImageUpload} />
          </div>
          {firstImageError && (
            <p style={{ color: "red", textAlign: "end" }}>{firstImageError}</p>
          )}
          <div className={classes.textFieldContainer}>
            <img
              src={uploadedFirstImage}
              alt="Image"
              className={classes.image}
            />
          </div>
        </div>
        <button className={classes.saveImageButton} onClick={saveFirstImage}>
          Save Image
        </button>
        <div>
          {condoAdvantages.map((advantage) => (
            <Fragment key={advantage.id}>
              <div className={classes.advantage}>
                {editAdvantageId === advantage.id ? (
                  <div className={classes.sentenceContainer}>
                    <div>
                      <TextField
                        label="Description"
                        value={advantage.description}
                        size="small"
                        sx={{ width: "280px" }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAdvantage = {
                            ...advantage,
                            description: e.target.value,
                          };
                          setCondoAdvantages((prevAdvantages) =>
                            prevAdvantages.map((prevAdvantage) =>
                              prevAdvantage.id === advantage.id
                                ? updatedAdvantage
                                : prevAdvantage
                            )
                          );
                        }}
                      />
                    </div>
                    <div>
                      <button
                        className={classes.saveButton}
                        onClick={() => saveAdvantage(advantage)}
                      >
                        Save
                      </button>
                      <button
                        className={classes.cancelButton}
                        onClick={cancelEditAdvantage}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={classes.sentenceContainer}>
                    <div className={classes.sentence}>
                      {advantage.description}
                    </div>
                    <div>
                      <button
                        className={classes.editButton}
                        onClick={() => setEditAdvantageId(advantage.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={classes.deleteButton}
                        onClick={() => deleteAdvantage(advantage.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
        <h3 className={classes.title}>Section 2</h3>
        <div className={classes.textFieldContainer}>
          <h4 className={`${classes.subTitle}`}>Category</h4>
          <TextField
            InputProps={{ className: classes.input }}
            sx={{ width: "310px" }}
            size="small"
            id="width"
            variant="outlined"
            onChange={onCategory2Change}
            value={category2}
          />
        </div>
        <button className={classes.saveCategoryButton} onClick={saveCategory2}>
          Save Category
        </button>

        <div className={classes.textFieldContainer}>
          <h4 className={`${classes.subTitle}`}>Upload Image :</h4>
          <Input type="file" id="image" onChange={handleSecondImageUpload} />
        </div>
        {secondImageError && (
          <p style={{ color: "red", textAlign: "end" }}>{secondImageError}</p>
        )}
        <div className={classes.textFieldContainer}>
          <img
            src={uploadedSecondImage}
            alt="Image"
            className={classes.image}
          />
        </div>
        <button className={classes.saveImageButton} onClick={saveSecondImage}>
          Save Image
        </button>
        <div>
          {hdbAdvantages.map((advantage) => (
            <Fragment key={advantage.id}>
              <div className={classes.advantage}>
                {editAdvantageId === advantage.id ? (
                  <div className={classes.sentenceContainer}>
                    <div>
                      <TextField
                        size="small"
                        label="Description"
                        sx={{ width: "280px" }}
                        className={classes.descriptionInput}
                        value={advantage.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAdvantage = {
                            ...advantage,
                            description: e.target.value,
                          };
                          setHdbAdvantages((prevAdvantages) =>
                            prevAdvantages.map((prevAdvantage) =>
                              prevAdvantage.id === advantage.id
                                ? updatedAdvantage
                                : prevAdvantage
                            )
                          );
                        }}
                      />
                    </div>
                    <div>
                      <button
                        className={classes.saveButton}
                        onClick={() => saveAdvantage(advantage)}
                      >
                        Save
                      </button>
                      <button
                        className={classes.cancelButton}
                        onClick={cancelEditAdvantage}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={classes.sentenceContainer}>
                    <div className={classes.sentence}>
                      {advantage.description}
                    </div>
                    <div>
                      <button
                        className={classes.editButton}
                        onClick={() => setEditAdvantageId(advantage.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={classes.deleteButton}
                        onClick={() => deleteAdvantage(advantage.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
        {/* Add New Advantage Form */}
        <div className={classes.newAdvantageForm}>
          <h3 className={classes.title}>Add New Advantage</h3>
          <div className={classes.addSection}>
            <select
              className={classes.categorySelect}
              value={newAdvantage.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNewAdvantage((prevAdvantage) => ({
                  ...prevAdvantage,
                  category: e.target.value,
                }))
              }
            >
              <option value="">Select Category</option>
              <option value={category2}>
                {categories.length != 0 ? category2 : "Loading"}
              </option>
              <option value={category1}>
                {categories.length != 0 ? category1 : "Loading"}
              </option>
            </select>
            <div className={classes.addButtonContainer}>
              <TextField
                size="small"
                label="Description"
                sx={{ width: "280px" }}
                className={classes.descriptionInput}
                value={newAdvantage.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewAdvantage((prevAdvantage) => ({
                    ...prevAdvantage,
                    description: e.target.value,
                  }))
                }
              />
              <button className={classes.addButton} onClick={addAdvantage}>
                Add
              </button>
            </div>
          </div>
        </div>
        {/* Modal */}
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
