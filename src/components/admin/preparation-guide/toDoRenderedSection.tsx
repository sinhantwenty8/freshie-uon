import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Button, TextField, Modal } from "@mui/material";
import RenderedParagraph from "./renderedParagraph";
import classes from "./toDoRenderedSection.module.css";
import RenderedAction from "./renderedAction";

type Paragraph = {
  id: string;
  title: string;
  description: string;
};

type Action = {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
};

interface Todo {
  id: string;
  category: string;
  imageUrl: string;
  name: string;
  progress: string;
  slug: string;
  actions: Action[];
  paragraphs: Paragraph[];
}

interface RenderedSectionProps {
  todo: Todo;
}

const RenderedSection: React.FC<RenderedSectionProps> = ({ todo }) => {
  const [newParagraph, setNewParagraph] = useState<Paragraph>({
    id: "",
    title: "",
    description: "",
  });
  const [newAction, setNewAction] = useState<Action>({
    id: "",
    name: "",
    description: "",
    isCompleted: false,
  });
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isAddParagraphModalOpen, setIsAddParagraphModalOpen] =
    useState<boolean>(false);
  const [isAddActionModalOpen, setIsAddActionModalOpen] =
    useState<boolean>(false);

  const firestore = getFirestore();

  const fetchParagraphs = useCallback(async () => {
    if (todo.id) {
      const todoDocRef = doc(firestore, "preparation-guide-todos", todo.id);
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
  }, [firestore, todo.id]);

  const fetchActions = useCallback(async () => {
    if (todo.id) {
      const todoDocRef = doc(firestore, "preparation-guide-todos", todo.id);
      const actionsCollectionRef = collection(todoDocRef, "actions");
      const actionsSnapshot = await getDocs(actionsCollectionRef);
      const actionsData: Action[] = [];

      actionsSnapshot.forEach((actionDoc) => {
        const actionData = actionDoc.data();
        const action: Action = {
          id: actionDoc.id,
          name: actionData.name,
          description: actionData.description,
          isCompleted: actionData.isCompleted,
        };
        actionsData.push(action);
      });

      setActions(actionsData);
    }
  }, [firestore, todo.id]);

  const handleEditParagraph = async (
    paragraphId: string,
    title: string,
    description: string
  ) => {
    if (paragraphId === "") {
      try {
        const docRef = await addDoc(
          collection(
            firestore,
            "preparation-guide-todos",
            todo.id,
            "paragraphs"
          ),
          {
            title: title,
            description: description,
          }
        );
        setModalMessage("Paragraph added successfully.");
        setIsModalOpen(true);
        fetchParagraphs();
      } catch (error) {
        console.log("Error adding paragraph:", error);
        setError("An error occurred while adding the paragraph.");
        setIsModalOpen(true);
      }
      return; // Exit the function after adding the paragraph
    }

    const paragraphRef = doc(
      firestore,
      "preparation-guide-todos",
      todo.id,
      "paragraphs",
      paragraphId
    );

    try {
      await updateDoc(paragraphRef, {
        title: title,
        description: description,
      });
      setModalMessage("Paragraph edited successfully.");
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error editing paragraph:", error);
      setError("An error occurred while editing the paragraph.");
      setIsModalOpen(true);
    }
  };

  const handleDeleteParagraph = async (paragraphId: string) => {
    const paragraphRef = doc(
      firestore,
      "preparation-guide-todos",
      todo.id,
      "paragraphs",
      paragraphId
    );

    try {
      await deleteDoc(paragraphRef);
      setModalMessage("Paragraph deleted successfully.");
      setIsModalOpen(true);
      fetchParagraphs();
    } catch (error) {
      console.log("Error deleting paragraph:", error);
      setError("An error occurred while deleting the paragraph.");
      setIsModalOpen(true);
    }
  };

  const handleEditAction = async (
    actionId: string,
    name: string,
    description: string
  ) => {
    if (actionId === "") {
      try {
        const docRef = await addDoc(
          collection(firestore, "preparation-guide-todos", todo.id, "actions"),
          {
            name: name,
            description: description,
            isCompleted: false,
          }
        );
        setModalMessage("Action added successfully.");
        setIsModalOpen(true);
        fetchActions();
      } catch (error) {
        console.log("Error adding action:", error);
        setError("An error occurred while adding the action.");
        setIsModalOpen(true);
      }
      return; // Exit the function after adding the action
    }

    const actionRef = doc(
      firestore,
      "preparation-guide-todos",
      todo.id,
      "actions",
      actionId
    );

    try {
      await updateDoc(actionRef, {
        name: name,
        description: description,
      });
      setModalMessage("Action edited successfully.");
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error editing action:", error);
      setError("An error occurred while editing the action.");
      setIsModalOpen(true);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    const actionRef = doc(
      firestore,
      "preparation-guide-todos",
      todo.id,
      "actions",
      actionId
    );

    try {
      await deleteDoc(actionRef);
      setModalMessage("Action deleted successfully.");
      setIsModalOpen(true);
      fetchActions();
    } catch (error) {
      console.log("Error deleting action:", error);
      setError("An error occurred while deleting the action.");
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchParagraphs();
    fetchActions();
  }, [fetchParagraphs, fetchActions]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
    setModalMessage("");
  };

  const handleOpenAddParagraphModal = () => {
    setParagraphs((prevPageParagraphs) => [
      ...prevPageParagraphs,
      newParagraph,
    ]);
  };

  const handleOpenAddActionModal = () => {
    setActions((prevActions) => [...prevActions, newAction]);
  };

  return (
    <div className={classes.container}>
      <h3 className={classes.sectionTitle}>Paragraphs:</h3>
      {paragraphs.map((paragraph, index) => (
        <RenderedParagraph
          key={paragraph.id}
          paragraph={paragraph}
          handleEdit={handleEditParagraph}
          handleDelete={handleDeleteParagraph}
          index={index}
        />
      ))}

      <Button
        onClick={handleOpenAddParagraphModal}
        className={classes.button}
        style={{ width: "95%", marginLeft: "0" }}
      >
        Add Paragraph
      </Button>

      <h3 className={classes.sectionTitle}>Actions :</h3>
      {actions.map((action, index) => (
        <RenderedAction
          key={action.id}
          action={action}
          handleEdit={handleEditAction}
          handleDelete={handleDeleteAction}
          index={index}
        />
      ))}

      <Button
        onClick={handleOpenAddActionModal}
        className={classes.button}
        style={{ width: "95%", marginLeft: "0" }}
      >
        Add Action
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <div className={classes.modalContainer}>
          <h2>{error || modalMessage}</h2>
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RenderedSection;
