import Header from "@/components/admin/header";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { CircularProgress, TextField } from "@mui/material";
import SideBar from "@/components/admin/sideBar/sideBar";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import Grid from "@mui/material/Grid";
import ReactMarkdown from "react-markdown";
import Button from "@mui/material/Button";
import { Send } from "@mui/icons-material";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import HeaderEdit from "@/components/admin/pagesContent/hearderEdit";
import DetailedPageSection from "@/components/admin/aboutSchool/detailedPageSection";
import { Modal } from "@mui/material";

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

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import DetailedPageSecondSection from "@/components/admin/aboutSchool/detailedPageSecondSection";
import DetailedPageThirdSection from "@/components/admin/aboutSchool/detailedPageThirdSection";

interface Page {
  id: string;
  pageTitle: string;
  imageURL: string;
}

export default function AboutUsPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  const [page, setPage] = useState<Page>({
    id: "",
    pageTitle: "",
    imageURL: "",
  });
  let pageTitle = urlArray[3];
  urlArray[urlArray.length - 1] = pageTitle;
  console.log(pageTitle)
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageURL, setBannerImageURL] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [isPublishedGlobally, setisPublishedGlobally] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [url, setUrl] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const getTitleAndUrl = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-page")
    );
    querySnapshot.forEach((doc) => {
      const videoUrl = doc.data().videoUrl;
      if (doc.id == "aboutus-welcome" && videoUrl) {
        const id = videoUrl.split("/")[3];
        setUrl(doc.data().videoUrl);
      }
    });
  }, []);

  const updateUrl = useCallback(async () => {
    const docRef = doc(getFirestore(), "tips-aboutus-page", "aboutus-welcome");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        videoUrl: url,
      });
    }
  }, [getTitleAndUrl, url]);

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "tips-aboutus"));
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      setslug((slug) => pageTitle);
      if (docSlug == pageTitle) {
        settitle((title) => doc.data().title);
        setPage({
          id: doc.id,
          pageTitle: doc.data().title,
          imageURL: doc.data().imageURL,
        });
        setisPublishedGlobally(doc.data().isPublishedGlobally);
        setPostedBy(doc.data().postedBy);
        setCreatedAt(doc.data().createdAt);
      }
    });
    const docs = await getDocs(collection(getFirestore(), "tips-aboutus-header"));
    docs.forEach((doc) => {
      if (doc.id == pageTitle) {
        setBannerTitle(doc.data().title);
        setBannerDescription(doc.data().description);
        setBannerImageURL(doc.data().imageURL);
      }
    });
  }, [pageTitle]);

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
      getTitleAndUrl();
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [pageTitle]);

  const postPage = async () => {
    const docRef = doc(getFirestore(), "tips-aboutus", slug);
    const docCurRef = doc(getFirestore(), "tips-aboutus", pageTitle);
    const docSnap = await getDoc(docRef);
    const docCurSnap = await getDoc(docCurRef);
    console.log(slug == pageTitle);
    try {
      if (docCurSnap.exists()) {
        if (slug != pageTitle) {
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
      await updateUrl();
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `tips-aboutus-header-banner/`);

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageURL, "data_url");
      }
      const imageURL = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageURL;
      const docRef = doc(getFirestore(), "tips-aboutus-header", slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(getFirestore(), "tips-aboutus-header", pageTitle);
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        // Delete the existing document if the slug is not the same
        if (slug != pageTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageURL,
            slug: { slug },
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageURL,
            slug: { slug },
          });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageURL,
        });
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const onTitleChange = (title: string) => {
    settitle(title);
    setslug(title.replaceAll(" ", "-").toLowerCase());
    seterrorstates({ ...errorstates, sameslug: false });
  };

 

  

  const onUrlChange = (url: string) => {
    setUrl((prevUrl) => url);
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress /> {/* Display the spinner */}
          <p>Loading...</p>
        </div>
      ) : page.pageTitle === "" ? (
        <p>Page not found</p>
      ) : (
        <div className={classes.container}>
          <Header id={page.id} category={page.pageTitle} urlArray={urlArray} />
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
                <h3 className={classes.sectionTitle}>Youtube Url</h3>
                <TextField
                  InputProps={{ className: classes.input }}
                  sx={{ width: "600px" }}
                  size="small"
                  id="youtubeUrl"
                  variant="outlined"
                  onChange={(e) => onUrlChange(e.target.value)}
                  value={url}
                />
                <h3 className={classes.sectionTitle}>Header</h3>
              </div>
              <HeaderEdit
                headerTitle={bannerTitle}
                headerDescription={bannerDescription}
                headerImageUrl={bannerImageURL}
                setBannerTitle={setBannerTitle}
                setBannerImageUrl={setBannerImageURL}
                setBannerDescription={setBannerDescription}
                setIsImageUploaded={setIsImageUploaded}
              />
              <div className={classes.upperSecContainer}>
                <h3 className={classes.sectionTitle}>
                  picture and text
                </h3>
                <DetailedPageSection></DetailedPageSection>
                <h3
                  className={classes.sectionTitle}
                  style={{ marginTop: "50px" }}
                >
                  Welcome to UON
                </h3>
                <DetailedPageSecondSection></DetailedPageSecondSection>
                <h3
                  className={classes.sectionTitle}
                  style={{ marginTop: "50px" }}
                >
                  Mentions
                </h3>
                <DetailedPageThirdSection></DetailedPageThirdSection>
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
            <SideBar
              postPage={postPage}
              postHeader={postHeader}
              isPublished={isPublishedGlobally}
              postedBy={postedBy}
              postedDate={createdAt}
              setIsPublished={setisPublishedGlobally}
              postPagePreview={function (): void {
                throw new Error("Function not implemented.");
              }}
              postHeaderPreview={function (): void {
                throw new Error("Function not implemented.");
              }}
            ></SideBar>
          </div>
        </div>
      )}
    </div>
  );
}
