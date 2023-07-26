import classes from "./index.module.css";
import AccommodationCompareList from "@/components/website/accommodation/accommodationCompareList";
import "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import YouTube from "react-youtube";
import Link from "next/link";
import Header from "@/components/website/preparation-guide/header";

interface Header {
  title: string;
  description1: string;
  description2: string;
  drawingUrl: string;
  image1Url: string;
  image2Url: string;
  image3Url: string;
  image4Url: string;
  image5Url: string;
}

interface Section {
  id: string;
  iconUrl: string;
  title: string;
  description: string;
  detailedPageUrl: string;
}

interface Blog {
  id: string;
  blogTitle: string;
  compareImageUrl: string;
}

export default function GettingAroundSG() {
  const [header, setHeader] = useState<Header>({
    title: "",
    description1: "",
    description2: "",
    drawingUrl: "",
    image1Url: "",
    image2Url: "",
    image3Url: "",
    image4Url: "",
    image5Url: "",
  });
  const blogTitle = "getting-around-sg";
  const [sections, setSections] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [isPublishedGlobally, setisPublishedGlobally] = useState(true);

  const getGettingAroundSGHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-header")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug == blogTitle) {
        const gettingAroundHeader: Header = {
          title: doc.data().title,
          description1: doc.data().description,
          description2: doc.data().description2,
          drawingUrl: doc.data().drawingUrl,
          image1Url: doc.data().image1Url,
          image2Url: doc.data().image2Url,
          image3Url: doc.data().image3Url,
          image4Url: doc.data().image4Url,
          image5Url: doc.data().image5Url,
        };
        setHeader(gettingAroundHeader);
      }
    });
  }, [blogTitle]);

  const getGettingAroundSGSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around")
    );
    const pageSections: Section[] = [];
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug.startsWith(blogTitle + "-section")) {
        console.log(doc.id);
        const section: Section = {
          id: doc.id,
          iconUrl: doc.data().iconUrl,
          title: doc.data().title,
          description: doc.data().description,
          detailedPageUrl: doc.data().detailedPageUrl,
        };
        pageSections.push(section);
      }
      setSections(pageSections);
    });
  }, [sections]);

  const getTitleAndUrl = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug == blogTitle) {
        let id = doc.data().youtubeUrl;
        id = id.split("/")[3];
        setTitle(doc.data().title);
        setYoutubeId(id);
      }
    });
  }, [title]);

  const getIsPublishedGlobally = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "getting-around-sg")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug == blogTitle) {
        setisPublishedGlobally(doc.data().isPublishedGlobally);
        if (isPublishedGlobally == false) {
          return <h3 className={classes.loading}>Page not found.</h3>;
        }
      }
    });
  }, [title]);

  useEffect(() => {
    setTimeout(() => {
      getGettingAroundSGHeader();
      getGettingAroundSGSection();
      getTitleAndUrl();
      getIsPublishedGlobally();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <div className={classes.header}>
        <Header
          title={header.title}
          title2={header.description1}
          imageUrl={header.image1Url}
        ></Header>
        {/* <Header
          title={header.title}
          description1={header.description1}
          description2={header.description2}
          drawingUrl={header.drawingUrl}
          image1Url={header.image1Url}
          image2Url={header.image2Url}
          image3Url={header.image3Url}
          image4Url={header.image4Url}
          image5Url={header.image5Url}
        ></Header> */}
      </div>
      <div className={classes.sectionsContainer}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>{title}</h1>
        </div>
        <div style={{ display: "flex" }} className={classes.sectionContainer}>
          {sections.map((section) => {
            return (
              <div className={classes.section} key={section.id}>
                <Link href={section.detailedPageUrl} className={classes.link}>
                  <img
                    className={classes.sectionImg}
                    src={section.iconUrl}
                    width={100}
                    height={100}
                  ></img>
                  <h3 className={classes.sectionTitle}>{section.title}</h3>
                  <p
                    className={classes.sectionDescription}
                    style={{ margin: "auto", marginTop: "20px" }}
                  >
                    {section.description}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <YouTube
        className={classes.video}
        videoId={youtubeId}
        opts={{ width: "100%", height: "700px" }}
      />
    </div>
  );
}
