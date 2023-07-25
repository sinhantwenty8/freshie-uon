import { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./detailedPageSection.module.css";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
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
import RenderedSection from "./renderedSection";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Modal } from "@mui/material";

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface PageSection {
  id: string;
  title: string;
  imageURL: string;
  description: string;
  slug: string; // Add slug property to the PageSection interface
}

export default function DetailedPageSection() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSection, setNewSection] = useState<PageSection>({
    id: "",
    title: "",
    imageURL: "",
    description: "",
    slug: "", // Initialize slug property with an empty string
  });
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timestamp = serverTimestamp();
  const [createdAt, setCreatedAt] = useState(Timestamp.now);

  const fetchPages = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-page")
    );
    const fetchedPages: Page[] = [];
    querySnapshot.forEach((doc) => {
      const pageData = doc.data() as Page;
      fetchedPages.push(pageData);
      console.log(doc.data().slug);
    });
    setPages(fetchedPages);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchPages();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchPages]);

  const fetchPageSections = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "studentclub-page")
    );
    const fetchedPageSections: PageSection[] = [];
    querySnapshot.forEach((doc) => {
      const pageData = doc.data() as PageSection;
      fetchedPageSections.push(pageData);
    });
    setPageSections(fetchedPageSections);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchPageSections();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchPageSections]);

  const handleCreateSection = (newSection: PageSection) => {
    setPageSections((prevPageSections) => [...prevPageSections, newSection]);
    setShowModal(false);
  };

  const handleDeleteSection = async (id: string) => {
    const docRef = doc(getFirestore(), "studentclub-page", id);

    try {
      await deleteDoc(docRef);

      // Filter out the deleted section from the pageSections state
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );

      const storage = getStorage();
      const storageRef = ref(storage, `studentclub/studentclub-page-${id}`);

      try {
        await getDownloadURL(storageRef); // Check if the file exists
        await deleteObject(storageRef); // Delete the file from storage
      } catch (error) {
        if (
          isFirebaseStorageError(error) &&
          error.code === "storage/object-not-found"
        ) {
          console.log("Image does not exist. Skipping deletion.");
        } else {
          console.error(
            "An error occurred while checking the image existence.",
            error
          );
        }
      }
    } catch (error) {
      console.error("An error occurred while deleting the section.", error);
    }
  };

  // Type guard to check if the error is of type FirebaseStorageError
  function isFirebaseStorageError(error: any): error is FirebaseStorageError {
    return error && error.code && typeof error.code === "string";
  }

  // Custom type for Firebase storage errors
  interface FirebaseStorageError {
    code: string;
    message: string;
    name: string;
  }

  const handleAddPage = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleCreatePage = async () => {
    if (newSection.title === "") {
      seterrorstates({ ...errorstates });
    } else if (newSection.slug === "") {
      seterrorstates({ ...errorstates });
    } else {
      let slug = newSection.slug;
      const docRef = doc(getFirestore(), "studentclub-blog", slug);
      const docSnap = await getDoc(docRef);
      try {
        if (docSnap.exists()) {
          setModalMessage(
            "Slug already exists. Please choose a different one."
          );
          setIsModalOpen(true);
        } else {
          await setDoc(docRef, {
            title: newSection.title,
            slug: newSection.slug,
            createdAt: timestamp,
            postedBy: "Admin",
            isPublishedGlobally: true,
          }).then(() => {
            fetchPages();
          });
          setModalMessage("Page successfully added.");
          setIsModalOpen(true);
          setShowModal(false);
          // Reset the input fields after successful creation
          setNewSection({
            id: "",
            title: "",
            imageURL: "",
            description: "",
            slug: "",
          });
        }
      } catch (error) {
        setModalMessage("An error occurred while creating the page.");
        setIsModalOpen(true);
      }
    }
  };

  const handleDeletePage = async (pageId: string) => {
    const docRef = doc(getFirestore(), "studentclub-page", pageId);

    try {
      await deleteDoc(docRef).then(() => {
        fetchPages();
      });
      setModalMessage("Page successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the blog.");
      setIsModalOpen(true);
    }
  };
  console.log(pages[0]);
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.titleContainer}>
            <h3 className={classes.title} style={{ marginRight: "150px" }}>
              No.
            </h3>
            <h3 className={classes.title}>Title</h3>
          </div>
          <div>
            {pages.map((page, index) => (
              <div key={page.id} className={classes.blogContainer}>
                <Link
                  className={classes.link}
                  href={`/admin/pages/studentclub/pageTitle?=${page.id}`}
                >
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.page}>{page.title}</p>
                  </div>
                  
                </Link>
                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleDeletePage(page.slug)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {pageSections.map((section, index) => (
        <RenderedSection
          key={section.id + index}
          index={index + 1}
          id={section.id}
          sectionTitle={section.title}
          sectionDescription={section.description}
          sectionImageURL={section.imageURL}
          onDeleteSection={handleDeleteSection} // Pass the deleteSection function as a prop
          fetchPageSections={fetchPageSections}
        />
      ))}
      <button
        className={classes.button}
        onClick={() => handleCreateSection(newSection)}
      >
        Add Page Section
      </button>
    </div>
  );
}
