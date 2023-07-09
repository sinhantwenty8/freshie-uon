import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Checkbox, CircularProgress, Card, CardContent } from "@mui/material";
import classes from "./index.module.css";
import Header from "@/components/website/preparation-guide/toDoHeader";

interface Action {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
}

interface ToDo {
  id: string;
  name: string;
  actions: Action[];
  progress: number;
}

interface Paragraph {
  id: string;
  title: string;
  description: string;
}

interface Header {
  title: string;
  description: string;
  imageUrl: string;
}

const ToDoDetailPage: React.FC = () => {
  const router = useRouter();
  const { todoId } = router.query;
  const [todo, setTodo] = useState<ToDo | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isPublished, setIsPublished] = useState(false);
  const [header, setHeader] = useState<Header>({
    title: "",
    description: "",
    imageUrl: "",
  });
  const getToDoHeader = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-detailed-page-header")
    );
    querySnapshot.forEach((doc) => {
      if (doc.id == todoId) {
        const preparationGuideHeader: Header = {
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        setHeader(preparationGuideHeader);
        setIsPublished(doc.data().isPublishedGlobally);
      }
    });
  }, [todoId]);

  const fetchToDo = useCallback(async () => {
    console.log(todoId);
    if (todoId) {
      const todoDocRef = doc(
        getFirestore(),
        "preparation-guide-todos",
        todoId as string
      );
      const todoDocSnap = await getDoc(todoDocRef);

      if (todoDocSnap.exists()) {
        const todoData = todoDocSnap.data();
        const todo: ToDo = {
          id: todoDocSnap.id,
          name: todoData.name,
          actions: [],
          progress: todoData.progress,
        };

        const actionsQuery = query(
          collection(
            getFirestore(),
            "preparation-guide-todos",
            todoDocSnap.id,
            "actions"
          )
        );
        const actionsSnapshot = await getDocs(actionsQuery);

        actionsSnapshot.forEach((actionDoc) => {
          const actionData = actionDoc.data();
          const action: Action = {
            id: actionDoc.id,
            name: actionData.name,
            description: actionData.description,
            isCompleted: actionData.isCompleted,
          };
          todo.actions.push(action);
        });

        setTodo(todo);
      } else {
        console.log("Todo does not exist");
      }
    }
    setIsLoading(false);
  }, [todoId]);

  const fetchParagraphs = useCallback(async () => {
    if (todoId) {
      const todoDocRef = doc(
        getFirestore(),
        "preparation-guide-todos",
        todoId as string
      );
      const paragraphsCollectionRef = collection(todoDocRef, "paragraphs");
      const paragraphsSnapshot = await getDocs(paragraphsCollectionRef);
      const paragraphsData: Paragraph[] = [];

      paragraphsSnapshot.forEach((paragraphDoc) => {
        const paragraphData = paragraphDoc.data();
        const paragraph: Paragraph = {
          id: paragraphDoc.id,
          title: paragraphData.title,
          description: paragraphData.description,
        };
        paragraphsData.push(paragraph);
      });

      setParagraphs(paragraphsData);
    }
  }, [todoId]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      getToDoHeader();
      fetchToDo();
      fetchParagraphs();
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [fetchToDo, fetchParagraphs]);

  const handleCheckboxChange = async (actionId: string) => {
    if (todo) {
      const updatedActions = todo.actions.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            isCompleted: !action.isCompleted,
          };
        }
        return action;
      });

      const updatedProgress =
        (updatedActions.filter((action) => action.isCompleted).length /
          updatedActions.length) *
        100;

      const todoDocRef = doc(
        getFirestore(),
        "preparation-guide-todos",
        todo.id
      );
      const actionsCollectionRef = collection(todoDocRef, "actions");

      await Promise.all(
        updatedActions.map((action) => {
          const actionDocRef = doc(actionsCollectionRef, action.id);
          return updateDoc(actionDocRef, { isCompleted: action.isCompleted });
        })
      );

      await updateDoc(todoDocRef, {
        actions: updatedActions,
        progress: updatedProgress,
      });

      setTodo((prevTodo) =>
        prevTodo
          ? {
              ...prevTodo,
              actions: updatedActions,
              progress: updatedProgress,
            }
          : null
      );
    }
  };

  return (
    <div className={classes.body}>
      <Header
        title={header.title}
        description={header.description}
        imageUrl={header.imageUrl}
      />
      <div className={classes.outerContainer}>
        <div className={classes.container}>
          <div className={classes.todo}>
            {isLoading ? (
              <div className={classes.loading}>
                <CircularProgress />
                <p>Loading...</p>
              </div>
            ) : (
              todo && (
                <>
                  <h2>{todo.name}</h2>
                  <div className={classes.actions}>
                    {todo.actions.map((action) => (
                      <Card key={action.id} className={classes.action}>
                        <CardContent>
                          {/* <Checkbox
                            checked={action.isCompleted}
                            onChange={() => handleCheckboxChange(action.id)}
                          /> */}
                          <h3>{action.name}</h3>
                          <p>{action.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* <div className={classes.progressBar}>
                    <div
                      className={classes.progressFill}
                      style={{ width: `${todo.progress}%` }}
                    ></div>
                  </div>
                  <div className={classes.progressPercentage}>
                    <p>{todo.progress}%</p>
                  </div> */}
                </>
              )
            )}
          </div>
          <div className={classes.sideSection}>
            {paragraphs.map((paragraph) => (
              <div className={classes.answer} key={paragraph.id}>
                <h2>{paragraph.title}</h2>
                <p>{paragraph.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoDetailPage;
