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
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import HeaderEdit from "@/components/admin/pagesContent/hearderEdit";
import { Modal } from "@mui/material";
import DetailedContentSection from "@/components/admin/studentclub/detailedContentSection";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

interface Page {
  id: string;
  pageTitle: string;
  clubImageURL: string;
}

export default function DetailPage() {
  const router = useRouter();
  const currentURL = router.asPath;
  const urlArray: string[] = currentURL.split("/");
  const [page, setPage] = useState<Page>({
    id: "",
    pageTitle: "",
    clubImageURL: "",
  });
  let pageTitle = urlArray[4].split("?=")[1];
  console.log(pageTitle, "PAGE TITLE");
  urlArray[urlArray.length - 1] = pageTitle;
  const [isLoading, setIsLoading] = useState(true);
  const [text, settext] = useState("");
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageURL, setBannerImageURL] = useState("");
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

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-blog")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      setslug((slug) => pageTitle);
      if (docSlug == pageTitle) {
        settitle((title) => doc.data().title);
        settext((text) => doc.data().text);
        setPage({
          id: doc.id,
          pageTitle: doc.data().title,
          clubImageURL: doc.data().clubImageURL,
        });
        setisPublishedGlobally(doc.data().isPublishedGlobally);
        setPostedBy(doc.data().postedBy);
        setCreatedAt(doc.data().createdAt);
      }
    });
    const docs = await getDocs(
      collection(getFirestore(), "studentclub-header")
    );
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
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [pageTitle]);

  const postPage = async () => {
    if (text === "") {
      seterrorstates({ ...errorstates, emptytext: true });
    } else {
      const docRef = doc(getFirestore(), "studentclub-blog", slug);
      const docCurRef = doc(getFirestore(), "studentclub-blog", pageTitle);
      const docSnap = await getDoc(docRef);
      const docCurSnap = await getDoc(docCurRef);
      try {
        if (docCurSnap.exists()) {
          if (slug != pageTitle) {
            await deleteDoc(docCurRef).then(() =>
              setModalMessage("Page successfully deleted.")
            );
            await setDoc(docRef, {
              slug: slug,
              title: title,
              text: text,
              createdAt: timestamp,
              postedBy: "Admin",
              isPublishedGlobally: isPublishedGlobally,
            }).then(() => {
              router.replace(`/admin/pages/studentclub/pageTitle?=${slug}`);
            });
            setModalMessage("Page successfully updated.");
          } else {
            console.log(text);
            await updateDoc(docRef, {
              title: title,
              text: text,
              isPublishedGlobally: isPublishedGlobally,
            });
            setModalMessage("Page successfully updated.");
          }
        } else {
          await setDoc(docRef, {
            title: title,
            text: text,
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
    }
  };

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `studentclub/studentclub-${slug}-header-banner/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageURL, "data_url");
      }
      const imageURL = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageURL;
      const docRef = doc(getFirestore(), "studentclub-header", slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(getFirestore(), "studentclub-header", pageTitle);
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        // Delete the existing document if the slug is not the same
        console.log(slug, pageTitle);
        if (slug != pageTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageURL,
            slug: slug,
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageURL,
          });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageURL,
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

  const postHeaderPreview = async () => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `studentclub/studentclub-${slug}-header-banner-preview/`
    );

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageURL, "data_url");
      }
      const imageURL = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageURL;
      const docRef = doc(
        getFirestore(),
        "studentclub-page-header-preview",
        slug
      );
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(
        getFirestore(),
        "studentclub-page-header-preview",
        pageTitle
      );
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
            slug: slug,
          }).then(() => {
            router.replace(`/studentclub/${slug}/preview`);
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            description: bannerDescription,
            imageURL,
          }).then(() => {
            router.replace(`/studentclub/${slug}/preview`);
          });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          description: bannerDescription,
          imageURL,
          slug: slug,
        }).then(() => {
          router.replace(`/studentclub/${slug}/preview`);
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
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress /> {/* Display the spinner */}
          <p>Loading...</p>
        </div>
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
                headerImageUrl={bannerImageURL}
                setBannerTitle={setBannerTitle}
                setBannerImageUrl={setBannerImageURL}
                setBannerDescription={setBannerDescription}
                setIsImageUploaded={setIsImageUploaded}
              />

              <div className={classes.upperSecContainer}>
                <h3 className={classes.sectionTitle}>Content</h3>
                <DetailedContentSection
                  pageTitle={pageTitle}
                ></DetailedContentSection>
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
              {/* <Grid item xs={12} xl={6}>
                <ReactMarkdown className={classes.markdown}>{'# ' + title + '  \n' + text}</ReactMarkdown>
            </Grid> */}

              <div style={{ color: "red" }}>
                {errorstates.emptytext ? "Please enter text" : ""}
              </div>
            </div>
            <div className={classes.sideBar}>
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
        </div>
      )}
    </div>
  );
}
