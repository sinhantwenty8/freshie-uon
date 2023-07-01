import Header from "@/components/admin/header";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { CircularProgress, TextField } from "@mui/material";
import SideBar from "@/components/admin/sideBar/sideBar";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import HeaderEdit from "@/components/admin/pagesContent/hearderEdit";
import { Modal } from "@mui/material";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import FoodWheel from "@/components/admin/getting-around-sg/foodWheel";
import FoodItem from "@/components/admin/getting-around-sg/foodWheel";

type Food = {
  id: string;
  name: string;
  foodShopLogo: string;
};

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Blog {
  id: string;
  blogTitle: string;
  compareImageUrl: string;
}

export default function DetailPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  const [blog, setBlog] = useState<Blog>({
    id: "",
    blogTitle: "",
    compareImageUrl: "",
  });
  let blogTitle = urlArray[5];
  urlArray[urlArray.length - 1] = blogTitle;
  const [isLoading, setIsLoading] = useState(true);
  const [text, settext] = useState(" ");
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [isPublishedGlobally, setisPublishedGlobally] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState("");
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-sg-blog")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      setslug((slug) => blogTitle);
      if (docSlug == blogTitle) {
        settitle((title) => doc.data().title);
        settext((text) => doc.data().text);
        setBlog({
          id: doc.id,
          blogTitle: doc.data().title,
          compareImageUrl: doc.data().compareImageUrl,
        });
        setisPublishedGlobally(doc.data().isPublishedGlobally);
        setPostedBy(doc.data().postedBy);
        setCreatedAt(doc.data().createdAt);
      }
    });
    const docs = await getDocs(
      collection(getFirestore(), "getting-around-header")
    );
    docs.forEach((doc) => {
      if (doc.id == blogTitle) {
        setBannerTitle(doc.data().title);
        setBannerDescription(doc.data().description);
        setBannerImageUrl(doc.data().imageUrl);
      }
    });
  }, [blogTitle]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchPage]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [blogTitle]);

  const postPage = async () => {
    if (text === "") {
      seterrorstates({ ...errorstates, emptytext: true });
    } else {
      const docRef = doc(getFirestore(), "getting-around-sg-blog", slug);
      const docCurRef = doc(
        getFirestore(),
        "getting-around-sg-blog",
        blogTitle
      );
      const docSnap = await getDoc(docRef);
      const docCurSnap = await getDoc(docCurRef);
      try {
        if (docCurSnap.exists()) {
          if (slug != blogTitle) {
            await deleteDoc(docCurRef).then(() =>
              setModalMessage("Page successfully deleted.")
            );
            await setDoc(docCurRef, {
              slug: slug,
              title: title,
              text: text,
              createdAt: timestamp,
              postedBy: "Admin",
              isPublishedGlobally: isPublishedGlobally,
            }).then(() => {
              router.replace(`/admin/pages/accommodation/blogTitle?=${slug}`);
            });
            setModalMessage("Page successfully updated.");
          } else {
            console.log(docCurRef, title, text, isPublishedGlobally);
            await updateDoc(docCurRef, {
              title: title,
              text: text,
              isPublishedGlobally: isPublishedGlobally,
            });
            setModalMessage("Page successfully updated.");
          }
        } else {
          await setDoc(docCurRef, {
            title: title,
            text: text,
            createdAt: timestamp,
            postedBy: "Admin",
            isPublishedGlobally: true,
          });
          setModalMessage("Page successfully added.");
        }
        setIsModalOpen(true);
      } catch (error) {
        setModalMessage("An error occurred while saving the page.");
        setIsModalOpen(true);
        console.log(error);
      }
    }
  };

  const postPagePreview = async () => {};

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `getting-around/getting-around-sg-blog-${slug}-header-banner/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), "getting-around-header", slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(getFirestore(), "getting-around-header", blogTitle);
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        await updateDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageUrl,
        });
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageUrl,
          slug: slug,
        });
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postHeaderPreview = async () => {};

  const onTitleChange = (title: string) => {
    settitle(title);
  };

  const fetchFoods = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "food-wheel")
    );
    const fetchedFoods: Food[] = [];
    querySnapshot.forEach((doc) => {
      const foodData = doc.data() as Food;
      foodData.id = doc.id;
      fetchedFoods.push(foodData);
    });
    console.log(fetchFoods);
    setFoods(fetchedFoods);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchFoods();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchFoods]);

  const addFood = async () => {
    if (newFoodName) {
      try {
        const docRef = await addDoc(collection(getFirestore(), "food-wheel"), {
          name: newFoodName,
          foodShopLogo: "",
        });
        const newFood: Food = {
          id: docRef.id,
          name: newFoodName,
          foodShopLogo: "",
        };
        setFoods((prevFoods) => [...prevFoods, newFood]);
        setNewFoodName("");
        setIsFoodModalOpen(false);
        setModalMessage("Food successfully added.");
        setIsModalOpen(true);
      } catch (error) {
        setModalMessage("Error adding food.");
        setIsModalOpen(true);
      }
    }
  };

  const deleteFood = async (foodId: string) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `food-wheel/${foodId}-foodShopLogo`);

      // Delete the image from Firebase Storage
      await deleteObject(storageRef);

      // Delete the food document from Firestore
      await deleteDoc(doc(getFirestore(), "food-wheel", foodId));

      setFoods((prevFoods) => prevFoods.filter((food) => food.id !== foodId));
      setModalMessage("Food successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("Error deleting food.");
      setIsModalOpen(true);
    }
  };

  const updateFood = async (foodId: string, updatedFood: Food) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `food-wheel/${foodId}-foodShopLogo`);

      if (
        updatedFood.foodShopLogo &&
        typeof updatedFood.foodShopLogo === "string"
      ) {
        // If a new image is provided, upload it to Firebase Storage
        await uploadString(storageRef, updatedFood.foodShopLogo, "data_url");
        const imageUrl = await getDownloadURL(storageRef);
        updatedFood.foodShopLogo = imageUrl;
      }

      await updateDoc(doc(getFirestore(), "food-wheel", foodId), updatedFood);
      setFoods((prevFoods) =>
        prevFoods.map((food) => (food.id === foodId ? updatedFood : food))
      );

      setModalMessage("Food successfully updated.");
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      setModalMessage("Error updating food.");
      setIsModalOpen(true);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFoodName(event.target.value);
  };

  const closeFoodModal = () => {
    setIsFoodModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress /> {/* Display the spinner */}
          <p>Loading...</p>
        </div>
      ) : blog.blogTitle === "" ? (
        <p>Page not found</p>
      ) : (
        <div className={classes.container}>
          <Header id={blog.id} blogTitle={blog.blogTitle} urlArray={urlArray} />
          <div className={classes.flexContainer}>
            <div className={classes.bodyContainer}>
              <div className={classes.upperSecContainer}>
                <h3 className={classes.sectionTitle}>Title</h3>
                <TextField
                  InputProps={{ className: classes.input }}
                  sx={{ width: "600px" }}
                  size="small"
                  id="title"
                  variant="outlined"
                  onChange={(e) => onTitleChange(e.target.value)}
                  value={title}
                />
                <h3 className={classes.sectionTitle}>Slug</h3>
                <TextField
                  disabled
                  InputProps={{ className: classes.input }}
                  sx={{ width: "600px" }}
                  size="small"
                  id="slug"
                  variant="outlined"
                  value={slug}
                  onChange={(e) => {
                    setslug(e.target.value);
                    seterrorstates({ ...errorstates, sameslug: false });
                  }}
                  helperText={errorstates.sameslug ? "Slug already exists" : ""}
                />
                <h3 className={classes.sectionTitle}>Header</h3>
              </div>
              <HeaderEdit
                headerTitle={bannerTitle}
                headerDescription={bannerDescription}
                headerImageUrl={bannerImageUrl}
                setBannerTitle={setBannerTitle}
                setBannerImageUrl={setBannerImageUrl}
                setBannerDescription={setBannerDescription}
                setIsImageUploaded={setIsImageUploaded}
              />
              <SimpleMDE
                className={classes.simpleMde}
                value={text}
                onChange={(e: string) => {
                  settext(e);
                  seterrorstates({ ...errorstates, emptytext: false });
                }}
              />
              <div style={{ color: "red" }}>
                {errorstates.emptytext ? "Please enter text" : ""}
              </div>
              <div>
                {foods.map((food) => (
                  <FoodItem
                    key={food.id}
                    food={food}
                    updateFood={updateFood}
                    deleteFood={deleteFood}
                  />
                ))}
                <div>
                  <Button
                    onClick={() => setIsFoodModalOpen(true)}
                    className={classes.button}
                  >
                    Add Food
                  </Button>
                </div>
                <Modal
                  open={isFoodModalOpen}
                  onClose={closeModal}
                  className={classes.modal}
                >
                  <div className={classes.modalContainer}>
                    <h2>Add Food</h2>
                    <input
                      type="text"
                      placeholder="Food Name"
                      value={newFoodName}
                      onChange={handleNameChange}
                      className={classes.modalInput}
                    />
                    <div className={classes.modalButtons}>
                      <Button className={classes.modalButton} onClick={addFood}>
                        Add
                      </Button>
                      <Button
                        className={classes.modalButton}
                        onClick={closeFoodModal}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Modal>
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
              {/* <Grid item xs={12} xl={6}>
                <ReactMarkdown className={classes.markdown}>{'# ' + title + '  \n' + text}</ReactMarkdown>
            </Grid> */}
            </div>
            <div className={classes.sideBar}>
              <SideBar
                postPage={postPage}
                postPagePreview={postPagePreview}
                postHeader={postHeader}
                postHeaderPreview={postHeaderPreview}
                isPublished={isPublishedGlobally}
                postedBy={postedBy}
                postedDate={createdAt}
                setIsPublished={setisPublishedGlobally}
              ></SideBar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
