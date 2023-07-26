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
import Grid from "@mui/material/Grid";
import ReactMarkdown from "react-markdown";
import Button from "@mui/material/Button";
import { Send } from "@mui/icons-material";
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
} from "firebase/storage";
import DetailedPageSection from "@/components/admin/tips/detailedPageSection";

interface Blog {
  id: string;
  blogTitle: string;
  compareImageUrl: string;
}

export default function AccommodationPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  const [blog, setBlog] = useState<Blog>({
    id: "",
    blogTitle: "",
    compareImageUrl: "",
  });
  let blogTitle = urlArray[3];
  urlArray[urlArray.length - 1] = blogTitle;
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [isPublishedGlobally, setisPublishedGlobally] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [pageSectionTitle, setPageSectionTitle] = useState("");
  const [pageSectionDescription, setPageSectionDescription] = useState("");
  const [pageSectionImageUrl, setPageSectionImageUrl] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips")
    );
    querySnapshot.forEach((doc) => {
      console.log(blogTitle, doc.id);
      let docSlug = doc.id;
      setslug((slug) => blogTitle);
      if (docSlug == blogTitle) {
        settitle((title) => doc.data().title);
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
      collection(getFirestore(), `tips-header`)
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

  const postPage = async () => {
    const docRef = doc(getFirestore(), "tips", slug);
    const docCurRef = doc(getFirestore(), "tips", blogTitle);
    const docSnap = await getDoc(docRef);
    const docCurSnap = await getDoc(docCurRef);
    console.log(slug, blogTitle);
    try {
      if (docCurSnap.exists()) {
        if (slug != blogTitle) {
          await deleteDoc(docCurRef).then(() =>
            setModalMessage("Page successfully deleted.")
          );
          await setDoc(docRef, {
            title: title,
            createdAt: timestamp,
            postedBy: "Admin",
            isPublishedGlobally: isPublishedGlobally,
          }).then(() => {
            router.replace(`/admin/pages/${slug}`);
          });
          setModalMessage("Page successfully updated.");
        } else {
          console.log("hi");
          await updateDoc(docRef, {
            title: title,
            isPublishedGlobally: isPublishedGlobally,
          });
          setModalMessage("Page successfully updated.");
        }
      } else {
        await setDoc(docRef, {
          title: title,
          createdAt: timestamp,
          postedBy: "Admin",
        });
        setModalMessage("Page successfully added.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postPagePreview = async () => {
    const docRef = doc(getFirestore(), `${blogTitle}-preview`, slug);
    const docCurRef = doc(getFirestore(), `${blogTitle}-preview`, blogTitle);
    const docSnap = await getDoc(docRef);
    const docCurSnap = await getDoc(docCurRef);
    console.log(slug == blogTitle);
    try {
      if (docCurSnap.exists()) {
        if (slug != blogTitle) {
          await deleteDoc(docCurRef).then(() =>
            setModalMessage("Page successfully deleted.")
          );
          await setDoc(docRef, {
            title: title,
            createdAt: timestamp,
            postedBy: "Admin",
            isPublishedGlobally: isPublishedGlobally,
          }).then(() => {
            router.replace(`/${slug}/preview`);
          });
        } else {
          console.log("hi");
          await updateDoc(docRef, {
            title: title,
            isPublishedGlobally: isPublishedGlobally,
          }).then(() => {
            router.replace(`/${slug}/preview`);
          });
        }
      } else {
        await setDoc(docRef, {
          title: title,
          createdAt: timestamp,
          postedBy: "Admin",
        }).then(() => {
          router.replace(`/${slug}/preview`);
        });
      }
    } catch (error) {
      setModalMessage("An error occurred.");
      setIsModalOpen(true);
    }
  };

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `tips/${blogTitle}-header-banner/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), `tips-header`, slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(getFirestore(), `tips-header`, blogTitle);
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        // Delete the existing document if the slug is not the same
        if (slug != blogTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageUrl,
            slug: slug,
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageUrl,
            slug: slug,
          });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageUrl,
        });
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postHeaderPreview = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `tips/${blogTitle}-header-banner-preview/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), `tips-header-preview`, slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(
        getFirestore(),
        `tips-header-preview`,
        blogTitle
      );
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        if (slug != blogTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageUrl,
            slug: slug,
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageUrl,
            slug: slug,
          });
        }
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageUrl,
        });
      }
    } catch (error) {
      setModalMessage("An error occurred.");
      setIsModalOpen(true);
    }
  };

  const onTitleChange = (title: string) => {
    settitle(title);
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
              <div className={classes.upperSecContainer}>
                <h3 className={classes.sectionTitle}>Articles</h3>
                <DetailedPageSection></DetailedPageSection>
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
      )}
    </div>
  );
}
