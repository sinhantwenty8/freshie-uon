import React, { useCallback, useEffect, useState } from "react";
import classes from "./index.module.css";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Height } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Header from "@/components/website/preparation-guide/header";
import { CircularProgress } from "@mui/material";

interface Section {
  id: string;
  detailedPageUrl: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Header {
  title: string;
  title2: string;
  imageUrl: string;
}

interface ToDo {
  id: string;
  name: string;
  imageUrl: string;
  progress: string;
  category: string;
}

const PreparationGuide: React.FC = () => {
  const [header, setHeader] = useState<Header>({
    title: "",
    title2: "",
    imageUrl: "",
  });
  const router = useRouter();
  const blogTitle = "preparation-guide";
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [todos, setTodos] = useState<ToDo[]>([]);

  const getToDos = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-todos")
    );
    const pageTodos: ToDo[] = [];
    querySnapshot.forEach((doc) => {
      const todo: ToDo = {
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
        category: doc.data().category,
        progress: doc.data().progress,
      };
      pageTodos.push(todo);
    });
    setTodos(pageTodos);
    setIsLoading(false);
  }, [blogTitle]);

  useEffect(() => {
    if (blogTitle) {
      setTimeout(() => {
        getToDos();
      }, 1000);
    }
  }, [blogTitle]);

  const getPreparationGuideHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-header")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id == blogTitle) {
        const preparationGuideHeader: Header = {
          title: doc.data().title,
          title2: doc.data().title2,
          imageUrl: doc.data().imageUrl,
        };
        setHeader(preparationGuideHeader);
        setIsPublished(doc.data().isPublishedGlobally);
      }
    });
  }, [blogTitle]);

  const getPreparationGuideSection = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-sections")
    );
    const pageSections: Section[] = [];
    querySnapshot.forEach((doc) => {
      const section: Section = {
        id: doc.id,
        detailedPageUrl: doc.data().detailedPageUrl,
        title: doc.data().title,
        description: doc.data().description,
        imageUrl: doc.data().imageUrl,
      };
      pageSections.push(section);
    });
    setSections(pageSections);
    setIsLoading(false);
  }, [blogTitle]);

  useEffect(() => {
    if (blogTitle) {
      setTimeout(() => {
        getPreparationGuideHeader();
        getPreparationGuideSection();
      }, 3000);
    }
  }, [blogTitle]);

  const sortedTodos = [...todos].sort(
    (a, b) => Number(b.progress) - Number(a.progress)
  );

  const todoBeforeWeek1Todos = sortedTodos.filter(
    (todo) => todo.category === "todoBeforeWeek1"
  );

  const normalTodos = sortedTodos.filter((todo) => todo.category === "normal");

  console.log(normalTodos);
  if (isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress /> {/* Display the spinner */}
        <p>Loading...</p>
      </div>
    );
  }

  if (isPublished == false && isLoading == false) {
    return <h3 className={classes.loading}>Page not found.</h3>;
  } else if (isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress /> {/* Display the spinner */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Header
        title={header.title}
        title2={header.title2}
        imageUrl={header.imageUrl}
      ></Header>
      {/* <div className={classes.progressSection}>
        <h2 className={classes.sectionTitle}>In Progress</h2>
        <div className={classes.carousel}>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            totalSlides={sortedTodos.length}
            visibleSlides={1}
            step={1}
            isIntrinsicHeight={true}
            lockOnWindowScroll={true}
          >
            <Slider>
              {sortedTodos.map((todo, index) => (
                <Slide key={index} index={index}>
                  <div className={classes.todoItemProgress}>
                    <div className={classes.todoContainerProgress}>
                      <div className={classes.todoTitleProgress}>
                        <h2>{todo.name}</h2>
                        <Link
                          href={`./preparation-guide/${todo.id}`}
                          className={classes.resumeButton}
                        >
                          Resume
                        </Link>
                      </div>
                      <h4>Progress:</h4>
                      <div className={classes.progressBar}>
                        <div
                          className={classes.progressFill}
                          style={{ width: `${todo.progress}%` }}
                        ></div>
                      </div>
                      <div className={classes.progressPercentage}>
                        <p>{todo.progress}%</p>
                      </div>
                    </div>
                  </div>
                </Slide>
              ))}
            </Slider>
            <div className={classes.buttons}>
              <ButtonBack className={`${classes.button} ${classes.buttonBack}`}>
                Back
              </ButtonBack>
              <ButtonNext className={`${classes.button} ${classes.buttonNext}`}>
                Next
              </ButtonNext>
            </div>
          </CarouselProvider>
        </div>
      </div> */}
      <div
        className={classes.beforeWeek1Section}
        style={{ marginTop: "330px" }}
      >
        <h2 className={classes.sectionTitle} style={{ marginTop: "-18%" }}>
          What to do before Week 1
        </h2>
        <div className={classes.grid}>
          {todoBeforeWeek1Todos.map(
            (
              todo,
              index // Slice the array to include all todos
            ) => (
              <Link
                href={`./preparation-guide/${todo.id}`}
                className={classes.link}
              >
                <div className={classes.todoItem} key={index}>
                  <div
                    className={classes.todoContainer}
                    style={{ backgroundImage: `url(${todo.imageUrl})` }}
                  >
                    <div className={classes.todoName}>{todo.name}</div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
      <div className={classes.todoSection}>
        <h2 className={classes.sectionTitle}>To Dos</h2>
        <div className={classes.grid}>
          {normalTodos.map(
            (
              todo,
              index // Slice the array to include all todos
            ) => (
              <Link
                href={`./preparation-guide/${todo.id}`}
                className={classes.link}
              >
                <div className={classes.todoItem} key={index}>
                  <div
                    className={classes.todoContainer}
                    style={{ backgroundImage: `url(${todo.imageUrl})` }}
                  >
                    <div className={classes.todoName}>{todo.name}</div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
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
                  <h3 className={classes.secTitle}>{section.title}</h3>
                  <p className={classes.sectionDescription}>
                    {section.description}
                  </p>
                  <Link
                    href={`/getting-around-sg/${section.detailedPageUrl}`}
                    className={classes.link}
                  >
                    <button className={classes.sectionButton}>
                      Learn More
                    </button>
                  </Link>
                </div>
                <div className={classes.rightContainer}>
                  <img
                    src={section.imageUrl}
                    className={classes.sectionImage}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreparationGuide;
