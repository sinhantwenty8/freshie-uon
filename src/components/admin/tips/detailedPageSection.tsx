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

interface Blog {
  id: string;
  title: string;
  slug: string;
}

interface PageSection {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  slug: string; // Add slug property to the PageSection interface
  detailedPageUrl: string;
}

export default function DetailedPageSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSection, setNewSection] = useState<PageSection>({
    id: "",
    title: "",
    imageUrl: "",
    description: "",
    slug: "", // Initialize slug property with an empty string
    detailedPageUrl: "",
  });
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timestamp = serverTimestamp();
  const [createdAt, setCreatedAt] = useState(Timestamp.now);

  const fetchBlogs = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-blog")
    );
    const fetchedBlogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Blog;
      fetchedBlogs.push(blogData);
      console.log(doc.data().slug);
    });
    setBlogs(fetchedBlogs);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchBlogs();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchBlogs]);

  const fetchPageSections = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-page")
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
    if (!id) {
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );
      return;
    }
    const docRef = doc(getFirestore(), "tips-page", id);

    try {
      await deleteDoc(docRef);

      // Filter out the deleted section from the pageSections state
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );

      const storage = getStorage();
      const storageRef = ref(storage, `tips/tips-page-${id}`);

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

  const handleAddBlog = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleCreateBlog = async () => {
    if (newSection.title === "") {
      alert('请输入标题')
    } else if (newSection.slug === "") {
      alert('请输入slug')
    } else {
      let slug = newSection.slug;
      const docRef = doc(getFirestore(), "tips-blog", slug);
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
            text: " ",
            isPublishedGlobally: true,
          }).then(() => {
            fetchBlogs();
          });
          setModalMessage("Blog successfully added.");
          setIsModalOpen(true);
          setShowModal(false);
          // Reset the input fields after successful creation
          setNewSection({
            id: "",
            title: "",
            imageUrl: "",
            description: "",
            slug: "",
            detailedPageUrl: "",
          });
        }
      } catch (error) {
        setModalMessage("An error occurred while creating the blog.");
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    const docRef = doc(getFirestore(), "tips-blog", blogId);

    try {
      await deleteDoc(docRef).then(() => {
        fetchBlogs();
      });
      setModalMessage("Blog successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the blog.");
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
            {blogs.map((blog, index) => (
              <div key={blog.id} className={classes.blogContainer}>
                <Link
                  className={classes.link}
                  href={`/admin/pages/tips/blogTitle?=${blog.slug}`}
                >
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.blog}>{blog.title}</p>
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
            onClick={handleAddBlog}
          >
            Add Articles
          </button>
        </div>
      </div>

      {showModal && (
        <div className={classes.modal}>
          <div className={classes.modalContainer}>
            <h2>Add Articles</h2>
            {/* Add the modal content to prompt the admin to add the title and slug */}
            <input
              type="text"
              placeholder="Title"
              value={newSection.title}
              className={classes.modalInput}
              onChange={(e) =>
                setNewSection({ ...newSection, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Slug"
              value={newSection.slug}
              className={classes.modalInput}
              onChange={(e) =>
                setNewSection({ ...newSection, slug: e.target.value })
              }
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
                  setNewSection({
                    id: "",
                    title: "",
                    imageUrl: "",
                    description: "",
                    slug: "",
                    detailedPageUrl: "",
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
