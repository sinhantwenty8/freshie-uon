import { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./subPageSection.module.css";
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
import RenderedSection from "./subPageRenderedSection";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Modal } from "@mui/material";
import { useRouter } from "next/router";

interface Blog {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface PageSection {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  detailedPageUrl: string;
  createdAt: Timestamp;
}

export default function SubPageSection() {
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  let blogTitle = urlArray[4];
  const [showModal, setShowModal] = useState(false);
  const timestamp = serverTimestamp();
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [newSection, setNewSection] = useState<PageSection>({
    id: "",
    title: "",
    imageUrl: "",
    description: "",
    detailedPageUrl: "",
    createdAt: createdAt,
  });
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [newBlog, setNewBlog] = useState<Blog>({
    id: "",
    name: "",
    slug: "",
    category: "",
  });
  const [normalTodos, setNormalTodos] = useState<Blog[]>([]);
  const [todoBeforeWeek1, setTodoBeforeWeek1] = useState<Blog[]>([]);

  const fetchPageSections = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-sections")
    );
    const fetchedPageSections: PageSection[] = [];
    querySnapshot.forEach((doc) => {
      const pageData = doc.data() as PageSection;
      pageData.id = doc.id;
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
    if (!id) throw Error;
    const docRef = doc(getFirestore(), "preparation-guide-sections", id);

    try {
      await deleteDoc(docRef);

      // Filter out the deleted section from the pageSections state
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );

      const storage = getStorage();
      const storageRef = ref(storage, `preparation-guide-sections/${id}`);

      try {
        await getDownloadURL(storageRef); // Check if the file exists
        await deleteObject(storageRef); // Delete the file from storage
        setModalMessage("Successfully deleted");
        setIsModalOpen(true);
      } catch (error) {
        if (
          isFirebaseStorageError(error) &&
          error.code === "storage/object-not-found"
        ) {
          console.log("Image does not exist. Skipping deletion.");
        } else {
          setModalMessage(
            "An error occurred while checking the image existence."
          );
          setIsModalOpen(true);
        }
      }
      fetchPageSections();
    } catch (error) {
      setModalMessage("An error occurred while deleting the section.");
      setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchTodos = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-todos")
    );

    const fetchedNormalTodos: Blog[] = [];
    const fetchedTodoBeforeWeek1: Blog[] = [];

    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Blog;
      blogData.id = doc.id;

      if (blogData.category === "normal") {
        fetchedNormalTodos.push(blogData);
      } else if (blogData.category === "todoBeforeWeek1") {
        fetchedTodoBeforeWeek1.push(blogData);
      }
    });

    setNormalTodos(fetchedNormalTodos);
    setTodoBeforeWeek1(fetchedTodoBeforeWeek1);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchTodos();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchTodos]);

  const handleAddBlog = (category: string) => {
    setShowModal(true);
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      category: category,
    }));
  };

  const handleCreateBlog = async () => {
    if (newBlog.name === "") {
      seterrorstates({ ...errorstates });
    } else if (newBlog.slug === "") {
      seterrorstates({ ...errorstates });
    } else {
      let slug = newBlog.slug;
      const docRef = doc(getFirestore(), "preparation-guide-todos", slug);
      const docSnap = await getDoc(docRef);
      try {
        if (docSnap.exists()) {
          setModalMessage(
            "Slug already exists. Please choose a different one."
          );
          setIsModalOpen(true);
        } else {
          const headerCollectionRef = collection(
            getFirestore(),
            "preparation-guide-detailed-page-header"
          );
          const headerDocRef = doc(headerCollectionRef, slug); // Set the header document ID to the slug
          const createdAt = new Date();
          const headerData = {
            createdAt: createdAt,
            postedBy: "Admin",
            isPublishedGlobally: true,
            imageUrl: "",
            title: newBlog.name,
            description: " ",
          };

          await setDoc(headerDocRef, headerData);

          await setDoc(docRef, {
            name: newBlog.name,
            slug: newBlog.slug,
            category: newBlog.category,
            progress: "0",
            imageUrl: "",
          }).then(() => {
            fetchTodos();
          });
          setModalMessage("Todo successfully added.");
          setIsModalOpen(true);
          setShowModal(false);
          // Reset the input fields after successful creation
          setNewBlog({
            id: "",
            name: "",
            slug: "",
            category: "",
          });
        }
      } catch (error) {
        setModalMessage("An error occurred while creating the page.");
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    const docRef = doc(getFirestore(), "preparation-guide-todos", blogId);

    try {
      // Delete the document
      await deleteDoc(docRef);

      // Delete the actions subcollection
      const actionsCollectionRef = collection(docRef, "actions");
      const actionsQuerySnapshot = await getDocs(actionsCollectionRef);
      actionsQuerySnapshot.forEach(async (actionDoc) => {
        await deleteDoc(actionDoc.ref);
      });

      // Delete the paragraphs subcollection
      const paragraphsCollectionRef = collection(docRef, "paragraphs");
      const paragraphsQuerySnapshot = await getDocs(paragraphsCollectionRef);
      paragraphsQuerySnapshot.forEach(async (paragraphDoc) => {
        await deleteDoc(paragraphDoc.ref);
      });

      // Delete the header document
      const headerDocRef = doc(
        getFirestore(),
        "preparation-guide-detailed-page-header",
        blogId
      );
      const headerDocSnap = await getDoc(headerDocRef);
      if (headerDocSnap.exists()) {
        await deleteDoc(headerDocRef);
      }

      fetchTodos();
      setModalMessage("Todo and related data successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the page.");
      setIsModalOpen(true);
    }
  };

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
            {normalTodos.map((blog, index) => (
              <div key={blog.id} className={classes.blogContainer}>
                <Link
                  className={classes.link}
                  href={`/admin/pages/preparation-guide/${blog.slug}`}
                >
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.blog}>{blog.name}</p>
                  </div>
                </Link>
                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleDeleteBlog(blog.slug)}
                />
              </div>
            ))}
          </div>
          <button
            style={{ width: "100%" }}
            className={classes.button}
            onClick={() => handleAddBlog("normal")}
          >
            Add Todo
          </button>
        </div>
      </div>
      <h3 className={classes.sectionTitle}>
        ToDos Before Week 1 Detailed Page
      </h3>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.titleContainer}>
            <h3 className={classes.title} style={{ marginRight: "150px" }}>
              No.
            </h3>
            <h3 className={classes.title}>Title</h3>
          </div>
          <div>
            {todoBeforeWeek1.map((blog, index) => (
              <div key={blog.id} className={classes.blogContainer}>
                <Link
                  className={classes.link}
                  href={`/admin/pages/preparation-guide/${blog.slug}`}
                >
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.blog}>{blog.name}</p>
                  </div>
                </Link>
                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleDeleteBlog(blog.slug)}
                />
              </div>
            ))}
          </div>
          <button
            style={{ width: "100%" }}
            className={classes.button}
            onClick={() => handleAddBlog("todoBeforeWeek1")}
          >
            Add Todo
          </button>
        </div>
      </div>
      {pageSections.map((section, index) => (
        <RenderedSection
          key={section.id + index}
          index={index + 1}
          id={section.id}
          sectionTitle={section.title}
          sectionDescription={section.description}
          sectionImageUrl={section.imageUrl}
          onDeleteSection={handleDeleteSection} // Pass the deleteSection function as a prop
          fetchPageSections={fetchPageSections}
          num={pageSections.length.toString()}
          detailPageUrl={section.detailedPageUrl}
        />
      ))}
      <button
        className={classes.button}
        onClick={() => handleCreateSection(newSection)}
      >
        Add Page Section
      </button>
      {showModal && (
        <div className={classes.modal}>
          <div className={classes.modalContainer}>
            <h2>Add Todo</h2>
            {/* Add the modal content to prompt the admin to add the title and slug */}
            <input
              type="text"
              placeholder="Name"
              value={newBlog.name}
              className={classes.modalInput}
              onChange={(e) => setNewBlog({ ...newBlog, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Slug"
              value={newBlog.slug}
              className={classes.modalInput}
              onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
            />
            <div className={classes.modalButtons}>
              <button
                className={classes.modalButton}
                onClick={() => handleCreateBlog()}
              >
                Add
              </button>
              <button
                className={classes.modalButton}
                onClick={() => {
                  setShowModal(false);
                  setNewBlog({
                    id: "",
                    name: "",
                    slug: "",
                    category: "",
                    createdAt: createdAt,
                    postedBy: "Admin",
                    isPublishedGlobally: true,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      <Modal open={isModalOpen} onClose={closeModal} className={classes.modal}>
        <div className={classes.modalContainer}>
          <h2>{modalMessage}</h2>
          <Button variant="contained" onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
