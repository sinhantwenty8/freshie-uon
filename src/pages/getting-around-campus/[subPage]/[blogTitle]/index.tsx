import Header from "../../../../components/website/studentclub/header";
import classes from "./index.module.css";
import "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { CircularProgress } from "@mui/material";

interface BlogHeader {
  title: string;
  description: string;
  imageUrl: string;
}

export default function Blog() {
  const router = useRouter();
  const { blogTitle } = router.query;
  const [blogHeader, setBlogHeader] = useState<BlogHeader>({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getBlogHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-campus-header")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id === blogTitle) {
        const blogHeader: BlogHeader = {
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        setBlogHeader(blogHeader);
      }
    });
  }, [blogTitle]);

  const getBlog = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-campus-blog")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id === blogTitle) {
        setTitle(doc.data().title);
        setText(doc.data().text);
        setIsPublished(doc.data().isPublishedGlobally);
      }
    });
    setIsLoading(false);
  }, [blogTitle]);

  useEffect(() => {
    setTimeout(() => {
      getBlogHeader();
    }, 100);
  }, [getBlogHeader]);

  useEffect(() => {
    setTimeout(() => {
      getBlog();
    }, 100);
  }, [getBlog]);

  if (
    (title == "" && isLoading == false) ||
    (isPublished == false && isLoading == false)
  ) {
    return <h3 className={classes.loading}>Page not found</h3>;
  }

  if (isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress /> {/* Display the spinner */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <Header
        title={blogHeader.title}
        description={blogHeader.description}
        imageURL={blogHeader.imageUrl}
      />
      <div className={classes.markDownContainer}>
        <div className={classes.markDownLayer}>
          <ReactMarkdown className={classes.markdown}>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
