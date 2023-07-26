import Header from "@/components/admin/header";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
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
import { Modal } from "@mui/material";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import DetailedPageSection from "@/components/admin/getting-around-campus/detailedPageSection";
import HeaderEdit from "@/components/admin/getting-around-campus/headerEdit";
import { CircularProgress } from "@mui/material";

interface Blog {
  id: string;
  blogTitle: string;
  compareImageUrl: string;
}

interface Header {
  description1: string;
  description2: string;
  drawingUrl: string;
  image1Url: string;
  image2Url: string;
  image3Url: string;
  image4Url: string;
  image5Url: string;
  title: string;
}

export default function GettingAroundCampusPage() {
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
  const [videoUrl, setVideoUrl] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "gettingaround-campus")
    );
    querySnapshot.forEach((doc) => {
      console.log(blogTitle, doc.id);
      let docSlug = doc.id;
      setslug((slug) => blogTitle);
      if (docSlug == blogTitle) {
        settitle((title) => doc.data().cmsTitle);
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
      collection(getFirestore(), `getting-around-campus-header`)
    );
    docs.forEach((doc) => {
      if (doc.id == blogTitle) {
        setBannerTitle(doc.data().title);
        setBannerDescription(doc.data().description);
        setBannerImageUrl(doc.data().image1Url);
      }
    });

    const docs2 = await getDocs(
      collection(getFirestore(), `getting-around-campus`)
    );
    docs2.forEach((doc) => {
      if (doc.id == blogTitle) {
        setPageSectionTitle(doc.data().title);
        setVideoUrl(doc.data().videoUrl);
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
    const docRef = doc(getFirestore(), "gettingaround-campus", slug);
    const docCurRef = doc(getFirestore(), "getting-around-campus", blogTitle);
    const docCurSnap = await getDoc(docCurRef);
    const docRef2 = doc(getFirestore(), "getting-around-campus", blogTitle);
    const docCur2Snap = await getDoc(docRef2);
    try {
      if (docCurSnap.exists()) {
        await updateDoc(docRef, {
          cmsTitle: title,
          isPublishedGlobally: isPublishedGlobally,
        });
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: title,
          createdAt: timestamp,
          postedBy: "Admin",
        });
        setModalMessage("Page successfully added.");
      }
      console.log(docCur2Snap);

      if (docCur2Snap.exists()) {
        await updateDoc(docRef2, {
          title: pageSectionTitle,
          videoUrl: videoUrl,
        });
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef2, {
          title: pageSectionTitle,
          videoUrl: videoUrl,
        });
        console.log(pageSectionTitle);
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `getting-around-campus/${blogTitle}-header-banner/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), `getting-around-campus-header`, slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(
        getFirestore(),
        `getting-around-campus-header`,
        blogTitle
      );
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
            image1url: imageUrl,
            slug: slug,
          });
        } else {
          if (blogTitle == "getting-around-campus") {
            await updateDoc(docRef, {
              title: bannerTitle,
              description: bannerDescription,
              image1url: imageUrl,
              slug: slug,
            });
          } else {
            await updateDoc(docRef, {
              title: bannerTitle,
              description: bannerDescription,
              image1url: imageUrl,
              slug: slug,
            });
          }
        }
        setModalMessage("Page successfully updated.");
      } else {
        if (blogTitle == "getting-around-campus") {
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            image1url: imageUrl,
          });
        } else {
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            image1url: imageUrl,
          });
        }
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postPagePreview = async () => {};

  const postHeaderPreview = async () => {};

  const onTitleChange = (title: string) => {
    settitle(title);
  };

  const onPageSectionTitleChange = (title: string) => {
    setPageSectionTitle(title);
  };

  const onVideoUrlChange = (url: string) => {
    setVideoUrl(url);
  };

  const returnSection = (
    <div className={classes.upperSecContainer}>
      <h3 className={classes.sectionTitle}>Page Section Title</h3>
      <TextField
        InputProps={{ className: classes.input }}
        sx={{ width: "600px" }}
        size="small"
        id="title"
        variant="outlined"
        onChange={(e) => onPageSectionTitleChange(e.target.value)}
        value={pageSectionTitle}
      />
      <h3 className={classes.sectionTitle}>Video Url</h3>
      <TextField
        InputProps={{ className: classes.input }}
        style={{ marginBottom: "30px" }}
        sx={{ width: "600px" }}
        size="small"
        id="videoUrl"
        variant="outlined"
        value={videoUrl}
        onChange={(e) => onVideoUrlChange(e.target.value)}
      />
      <h3 className={classes.sectionTitle}>Sub Pages</h3>
      <DetailedPageSection></DetailedPageSection>
    </div>
  );

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
          <Header id={blog.id} category={blog.blogTitle} urlArray={urlArray} />
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
              {returnSection}
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
