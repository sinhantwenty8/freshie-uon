import Header from "@/components/website/aboutSchool/header";
import classes from "./index.module.css";
import ServiceItemList from "@/components/website/aboutSchool/serviceList";
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
  const [mentionsSection, setMentionsSection] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const [testimonialsTitle, setTestimonialsTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPublishedGlobally, setIsPublishedGlobally] = useState(false);

  const getAboutUsHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-header")
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
      collection(getFirestore(), "tips-aboutus-page")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id == "aboutus-welcome") {
        const videoUrl = doc.data().videoUrl;
        setTitle(doc.data().title);
        setVideoId(videoUrl);
      }
    });
  }, []);
  console.log(videoId);

  const getAboutUsUpperSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-page")
    );
    const upperSection: Section[] = [];
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug.startsWith("picture-and-text")) {
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

  const getAboutMentiionsSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-page")
    );
    const upperSection: Section[] = [];
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      if (docSlug.startsWith("mentions")) {
        const section: Section = {
          id: doc.id,
          iconUrl: doc.data().iconUrl,
          title: doc.data().title,
          description: doc.data().description,
        };
        upperSection.push(section);
      }
    });
    setMentionsSection(upperSection);
  }, []);

  const getTestimonialsAndLowerSection = useCallback(async () => {
    const testimonialsSnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-mid-section")
    );

    if (testimonialsSnapshot.docs.length > 0) {
      const testimonialsTitle =
        testimonialsSnapshot.docs[0].data().testimonialsTitle;
      setTestimonialsTitle(testimonialsTitle);
    }

    const lowerSectionSnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus-mid-section")
    );

    const lowerSection: Section[] = [];
    lowerSectionSnapshot.forEach((doc) => {
      const docSlug = doc.id;
      if (docSlug.startsWith("welcome-to")) {
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
    const querySnapshot = await getDocs(
      collection(getFirestore(), "tips-aboutus")
    );
    querySnapshot.forEach((doc) => {
      const isPublishedGlobally = doc.data().isPublishedGlobally;
      setIsPublishedGlobally(isPublishedGlobally);
    });
  }, [title]);

  useEffect(() => {
    setTimeout(() => {
      getAboutUsHeader();
      getTitleAndUrl();
      //getAboutUsUpperSection();
      getAboutMentiionsSection();
      getTestimonialsAndLowerSection();
      getIsPublishedGlobally();
    }, 100);
  }, []);

  return (
    <div className={classes.all}>
      <Header title={""} description={""} imageURL={aboutUsHeader.imageURL} />
      <div className={classes.container}>
        <div className="text-center	text-[30px] my-[30px] font-bold	">
          {aboutUsHeader.title}
        </div>
        <div className="text-center mx-auto	w-[700px] text-[#6e676c]">
          {aboutUsHeader.description}
        </div>
      </div>
      <ServiceItemList />
      <div className={classes.videoContainer}>
        <YouTube
          className={classes.video}
          videoId={videoId}
          opts={{ width: "100%", height: "700px" }}
        />
      </div>
      <div className={classes.lowerContainer}>
        <div className={classes.testTitleContainer}>
          <h1 className={classes.testTitle}></h1>
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
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>
            Honourable
            <br /> Mentions
          </h1>
        </div>
        <div className={classes.sectionContainer}>
          {mentionsSection.map((section) => (
            <div className={classes.section} key={section.id}>
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
    </div>
  );
}
