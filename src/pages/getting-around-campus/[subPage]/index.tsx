import Header from "../../../components/website/studentclub/header";
import classes from "./index.module.css";
import studentClubList from "@/components/website/studentclub/studentClubList";
import "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import YouTube from "react-youtube";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

interface Section {
  id: string;
  detailedPageUrl: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Header {
  title: string;
  description: string;
  imageURL: string;
}

export default function AboutCampus() {
  const [header, setHeader] = useState<Header>({
    title: "",
    description: "",
    imageURL: "",
  });
  const router = useRouter();
  const { subPage } = router.query;
  const blogTitle = subPage;
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  const getAboutCampusHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-campus-sub-page-header")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id == blogTitle) {
        const gettingAroundCampusHeader: Header = {
          title: doc.data().title,
          description: doc.data().description,
          imageURL: doc.data().imageUrl,
        };
        setHeader(gettingAroundCampusHeader);
        setIsPublished(doc.data().isPublishedGlobally);
      }
    });
  }, [blogTitle]);

  const getAboutCampusSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-campus")
    );
    const pageSections: Section[] = [];
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      console.log(blogTitle);
      if (
        docSlug.startsWith("getting-around-campus-" + blogTitle + "-section")
      ) {
        const section: Section = {
          id: doc.id,
          detailedPageUrl: doc.data().detailedPageUrl,
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        pageSections.push(section);
      }
      setSections(pageSections);
      setIsLoading(false);
    });
  }, [sections, blogTitle]);

  useEffect(() => {
    if (blogTitle) {
      setTimeout(() => {
        getAboutCampusHeader();
        getAboutCampusSection();
      }, 1000);
    }
  }, [blogTitle]);

  if (
    (header.title == "" && isLoading == false) ||
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
    <div className={classes.all}>
      <Header
        title={header.title}
        description={header.description}
        imageURL={header.imageURL}
      />
      <div className={classes.sectionsContainer}>
        <div className={classes.sectionContainer}>
          {sections.map((section, index) => {
            const isEven = index % 2 === 0;
            const containerOrder = isEven
              ? classes.evenContainerOrder
              : classes.oddContainerOrder;
            return (
              <div
                className={`${classes.section} ${containerOrder}`}
                key={section.id}
              >
                <div className={classes.leftContainer}>
                  <p className={classes.sectionDescription}>
                    {section.description}
                  </p>
                  <Link
                    href={`/getting-around-campus/${section.detailedPageUrl}`}
                  >
                    <button className={classes.sectionButton}>
                      Learn More
                    </button>
                  </Link>
                </div>
                <div className={classes.rightContainer}>
                  <h3 className={classes.sectionTitle}>{section.title}</h3>
                  <img
                    src={section.imageUrl}
                    className={classes.sectionImage}
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
