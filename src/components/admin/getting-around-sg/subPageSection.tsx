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
  title: string;
  slug: string;
  createdIn: string;
}

interface PageSection {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  detailedPageUrl: string;
}

export default function SubPageSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  let blogTitle = urlArray[4];
  const [showModal, setShowModal] = useState(false);
  const [newSection, setNewSection] = useState<PageSection>({
    id: "",
    title: "",
    imageUrl: "",
    description: "",
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
  const [newBlog, setNewBlog] = useState<Blog>({
    id: "",
    title: "",
    slug: "",
    createdIn: blogTitle,
  });
  console.log(blogTitle);

  const fetchPageSections = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around")
    );
    const fetchedPageSections: PageSection[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id.startsWith("getting-around-sg-" + blogTitle)) {
        const pageData = doc.data() as PageSection;
        pageData.id = doc.id;
        fetchedPageSections.push(pageData);
      }
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
    const docRef = doc(getFirestore(), "getting-around", id);

    try {
      await deleteDoc(docRef);

      // Filter out the deleted section from the pageSections state
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `getting-around-sg/getting-around-sg-section-${id}`
      );

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

  const fetchBlogs = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-sg-blog")
    );
    const fetchedBlogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Blog;
      if (blogData.createdIn == blogTitle) {
        fetchedBlogs.push(blogData);
      }
    });
    setBlogs(fetchedBlogs);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchBlogs();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchBlogs]);

  const handleAddBlog = () => {
    setShowModal(true);
  };

  const handleCreateBlog = async () => {
    if (newBlog.title === "") {
      seterrorstates({ ...errorstates });
    } else if (newBlog.slug === "") {
      seterrorstates({ ...errorstates });
    } else {
      let slug = newBlog.slug;
      const docRef = doc(getFirestore(), "getting-around-sg-blog", slug);
      const docSnap = await getDoc(docRef);
      try {
        if (docSnap.exists()) {
          setModalMessage(
            "Slug already exists. Please choose a different one."
          );
          setIsModalOpen(true);
        } else {
          await setDoc(docRef, {
            title: newBlog.title,
            slug: newBlog.slug,
            createdAt: timestamp,
            postedBy: "Admin",
            text: " ",
            createdIn: blogTitle,
            isPublishedGlobally: true,
          }).then(() => {
            fetchBlogs();
          });
          setModalMessage("Page successfully added.");
          setIsModalOpen(true);
          setShowModal(false);
          // Reset the input fields after successful creation
          setNewBlog({ id: "", title: "", slug: "", createdIn: blogTitle });
        }
      } catch (error) {
        setModalMessage("An error occurred while creating the page.");
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    const docRef = doc(getFirestore(), "getting-around-sg-blog", blogId);

    try {
      await deleteDoc(docRef).then(() => {
        fetchBlogs();
      });
      setModalMessage("Page successfully deleted.");
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
            {blogs.map((blog, index) => (
              <div key={blog.id} className={classes.blogContainer}>
                <Link
                  className={classes.link}
                  href={`/admin/pages/getting-around-sg/${blogTitle}/${blog.slug}`}
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
            Add Blogs
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
            <h2>Add Blog</h2>
            {/* Add the modal content to prompt the admin to add the title and slug */}
            <input
              type="text"
              placeholder="Title"
              value={newBlog.title}
              className={classes.modalInput}
              onChange={(e) =>
                setNewBlog({ ...newBlog, title: e.target.value })
              }
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
                    title: "",
                    slug: "",
                    createdIn: blogTitle,
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
