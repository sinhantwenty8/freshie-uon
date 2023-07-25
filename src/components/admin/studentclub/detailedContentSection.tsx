import { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./detailedContentSection.module.css";
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
import RenderedContent from "./renderedContent";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Modal } from "@mui/material";
import { useRouter } from "next/router";
interface Content {
  id: string;
  title: string;
  slug: string;
}
interface ContentSection {
  id: string;
  title: string;
  subtitle: string;
  imageURL: string;
  description: string;
  slug: string; // Add slug property to the ContentSection interface
}
interface DetailedContentProps {
  pageTitle: string;
}
export default function DetailedContentSection({
  pageTitle,
}: DetailedContentProps) {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSection, setNewSection] = useState<ContentSection>({
    id: "",
    title: "",
    subtitle: "",
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
  const router = useRouter();

  console.log(router);

  const fetchContentSections = async (collectionName: string) => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(), collectionName)
      );
      const fetchedContentSections: ContentSection[] = [];
      querySnapshot.forEach((doc) => {
        const contentData = doc.data() as ContentSection;
        fetchedContentSections.push(contentData);
      });
      setContentSections(fetchedContentSections);
    } catch (error) {
      console.error(
        "An error occurred while fetching the content sections.",
        error
      );
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
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
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [pageTitle]);

  const handleDeleteSection = async (id: string) => {
    console.log(pageTitle,id)
    if (pageTitle == "industry-chapters") {
        pageTitle = "industrychapter-page";
      }
      if (pageTitle == "interest-groups") {
        pageTitle = "interestgroup-page";
      }
      if (pageTitle == "international-communities") {
        pageTitle = "internationalcommunities-page";
      }
    const docRef = doc(getFirestore(), pageTitle, id);
    try {
      await deleteDoc(docRef);
      await fetchContentSections(pageTitle);
      setModalMessage("Section successfully deleted.");
    } catch (error) {
      setModalMessage("An error occurred while deleting the section.");
    }
    setIsModalOpen(true);
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
  const handleCreateSection = (newSection: ContentSection) => {
    setContentSections((prevPageSections) => [...prevPageSections, newSection]);
    setShowModal(false);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };
  const handleCreateContent = async () => {
    if (newSection.title === "" || newSection.id === "") {
      seterrorstates({ ...errorstates });
    } else {
      const docRef = doc(getFirestore(), pageTitle, newSection.id);
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
            subtitle: newSection.subtitle,
            imageURL: newSection.imageURL,
            description: newSection.description,
            id: newSection.id,
            createdAt: timestamp,
            postedBy: "Admin",
            isPublishedGlobally: true,
          });
          await fetchContentSections(pageTitle);
          setModalMessage("Page successfully added.");
          setIsModalOpen(true);
          setShowModal(false);
          setNewSection({
            id: "",
            title: "",
            subtitle: "",
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
  return (
    <div>
      <div>
        {contentSections.map((content, index) => (
            <div key={content.id} className={classes.contentItem}>
              <RenderedContent
                key={content.id + index}
                index={index + 1}
                id={content.id}
                sectionTitle={content.title}
                sectionSubTitle={content.subtitle}
                sectionDescription={content.description}
                sectionImageURL={content.imageURL}
                onDeleteSection={handleDeleteSection} // Pass the deleteSection function as a prop
                fetchContentSections={fetchContentSections}
                databaseUrl={pageTitle}
                pageTitle={pageTitle}
              />
            </div>
          ))}
        
        <button
        className={classes.button}
        onClick={() => handleCreateSection(newSection)}
      >
        Add Page Section
      </button>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className={classes.modal}>
          <div className={classes.modalContainer}>
            <h2>Add Content</h2>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={newSection.title}
              onChange={(e) =>
                setNewSection({ ...newSection, title: e.target.value })
              }
            />
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              value={newSection.slug}
              onChange={(e) =>
                setNewSection({ ...newSection, id: e.target.value })
              }
            />
            <label htmlFor="subtitle">Subtitle</label>
            <input
              type="text"
              id="subtitle"
              value={newSection.subtitle}
              onChange={(e) =>
                setNewSection({ ...newSection, subtitle: e.target.value })
              }
            />
            <label htmlFor="imageURL">Image URL</label>
            <input
              type="text"
              id="imageURL"
              value={newSection.imageURL}
              onChange={(e) =>
                setNewSection({ ...newSection, imageURL: e.target.value })
              }
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              value={newSection.description}
              onChange={(e) =>
                setNewSection({ ...newSection, description: e.target.value })
              }
            ></textarea>
            <div className={classes.modalButtons}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateContent}
              >
                Create Content
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Modal */}
      <Modal open={isModalOpen} onClose={closeModal} className={classes.modal}>
        <div className={classes.modalContainer}>
          <h2>{modalMessage}</h2>
          <Button variant="contained" color="primary" onClick={closeModal}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
}
