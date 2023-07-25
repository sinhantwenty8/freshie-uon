import Header from "../../../components/website/accommodation/header";
import classes from "./index.module.css";
import AccommodationList from "@/components/website/accommodation/accommodationList";
import "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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

  const getBlogHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "accommodation-blog-header")
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
      collection(getFirestore(), "accommodation-blog")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id === blogTitle) {
        setTitle(doc.data().title);
        setText(doc.data().text);
        setIsPublished(doc.data().isPublishedGlobally);
      }
    });
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

  if ((blogHeader.title == "" && title == "") || isPublished == false) {
    return <p className={classes.loading}>Page not found</p>;
  }

  return (
    <div>
      <Header
        title={blogHeader.title}
        description={blogHeader.description}
        imageUrl={blogHeader.imageUrl}
      />
      <div className={classes.markDownContainer}>
        <div className={classes.markDownLayer}>
          <ReactMarkdown className={classes.markdown}>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
