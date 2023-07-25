import Header from "../../components/website/aboutus/header";
import classes from "./index.module.css";
import ServiceItemList from "@/components/website/aboutus/serviceList";
import "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import YouTube from "react-youtube";

interface AboutUsHeader {
  title: string;
  description: string;
  imageURL: string;
}

interface Section {
  id: string;
  iconUrl: string;
  title: string;
  description: string;
}

export default function AboutUs() {
  const [aboutUsHeader, setAboutUsHeader] = useState<AboutUsHeader>({
    title: "",
    description: "",
    imageURL: "",
  });
  const [upperSection, setUpperSection] = useState<Section[]>([]);
  const [lowerSection, setLowerSection] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const [testimonialsTitle, setTestimonialsTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPublishedGlobally, setIsPublishedGlobally] = useState(false);

  const getAboutUsHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "aboutus-header")
    );
    const data = querySnapshot.docs[0].data();
    const aboutUsHeaderData: AboutUsHeader = {
      title: data.title,
      description: data.description,
      imageURL: data.imageURL,
    };
    setAboutUsHeader(aboutUsHeaderData);
  };

  const getTitleAndUrl = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "aboutus-page")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id == ("aboutus-testimonials")) {
        const videoUrl = doc.data().videoUrl;
        const id = videoUrl.split("/")[3];
        setTitle(doc.data().title);
        setVideoId(id);
      }
    });
  }, []);
  console.log(videoId);

  const getAboutUsUpperSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "aboutus-page")
    );
    const upperSection: Section[] = [];
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug.startsWith("what-we-do-")) {
        const section: Section = {
          id: doc.id,
          iconUrl: doc.data().iconUrl,
          title: doc.data().title,
          description: doc.data().description,
        };
        upperSection.push(section);
      }
    });
    setUpperSection(upperSection);
  }, []);

  const getTestimonialsAndLowerSection = useCallback(async () => {
    const testimonialsSnapshot = await getDocs(
      collection(getFirestore(), "aboutus-page")
    );

    if (testimonialsSnapshot.docs.length > 0) {
      const testimonialsTitle =
        testimonialsSnapshot.docs[0].data().testimonialsTitle;
      setTestimonialsTitle(testimonialsTitle);
    }

    const lowerSectionSnapshot = await getDocs(
      collection(getFirestore(), "aboutus-page")
    );

    const lowerSection: Section[] = [];
    lowerSectionSnapshot.forEach((doc) => {
      const docSlug = doc.id;
      if (docSlug.startsWith("testimonial-")) {
        const section: Section = {
          id: doc.id,
          iconUrl: doc.data().iconUrl,
          title: doc.data().title,
          description: doc.data().description,
        };
        lowerSection.push(section);
      }
    });

    setLowerSection(lowerSection);
  }, []);

  const getIsPublishedGlobally = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "aboutus"));
    querySnapshot.forEach((doc) => {
      const isPublishedGlobally = doc.data().isPublishedGlobally;
      setIsPublishedGlobally(isPublishedGlobally);
    });
  }, [title]);

  useEffect(() => {
    setTimeout(() => {
      getAboutUsHeader();
      getTitleAndUrl();
      getAboutUsUpperSection();
      getTestimonialsAndLowerSection();
      getIsPublishedGlobally();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header
        title={aboutUsHeader.title}
        description={aboutUsHeader.description}
        imageURL={aboutUsHeader.imageURL}
      />
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>{title}</h1>
        </div>
        <div className={classes.sectionContainer}>
          {upperSection.map((section) => (
            <div className={classes.section} key={section.id}>
              <div className={classes.sectionCircle}></div>
              <img
                className={classes.sectionImg}
                src={section.iconUrl}
                width={250}
                height={250}
                alt={section.title}
              />
              <h3 className={classes.sectionTitle}>{section.title}</h3>
              <p className={classes.sectionDescription}>
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ServiceItemList />
      <div className={classes.lowerContainer}>
        <div className={classes.testTitleContainer}>
          <h1 className={classes.testTitle}>Testimonials</h1>
        </div>
        <div className={classes.testSectionContainer}>
          {lowerSection.map((section) => (
            <div className={classes.testSection} key={section.id}>
              <p className={classes.testSectionDescription}>
                {section.description}
              </p>
              <div className={classes.testSectionContent}>
                <img
                  className={classes.testSectionImg}
                  src={section.iconUrl}
                  width={50}
                  height={50}
                  alt={section.title}
                />
                <h3 className={classes.testSectionTitle}>{section.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPublishedGlobally && (
        <div className={classes.videoContainer}>
          <YouTube
            className={classes.video}
            videoId={videoId}
            opts={{ width: "100%", height: "500px" }}
          />
        </div>
      )}
    </div>
  );
}
