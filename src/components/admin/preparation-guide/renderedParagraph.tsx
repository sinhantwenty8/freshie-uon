import { useCallback, useState } from "react";
import { TextField, Button, Modal } from "@mui/material";
import classes from "./subPageRenderedSection.module.css";

type Paragraph = {
  id: string;
  title: string;
  description: string;
};

interface RenderedParagraphProps {
  paragraph: Paragraph;
  handleEdit: (paragraphId: string, title: string, description: string) => void;
  handleDelete: (paragraphId: string) => void;
  index: number;
}

const RenderedParagraph: React.FC<RenderedParagraphProps> = ({
  paragraph,
  handleEdit,
  handleDelete,
  index,
}) => {
  const [title, setTitle] = useState(paragraph.title);
  const [description, setDescription] = useState(paragraph.description);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value);
    },
    []
  );

  const deleteParagraph = useCallback(() => {
    handleDelete(paragraph.id);
  }, [handleDelete, paragraph.id]);

  const saveParagraph = useCallback(() => {
    if (title === "" || description === "") {
      setModalMessage("Please fill in all the fields.");
      setIsModalOpen(true);
      return;
    }

    handleEdit(paragraph.id, title, description);
  }, [title, description, handleEdit, paragraph.id]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalMessage("");
  }, []);

  return (
    <div key={paragraph.id}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <h3 className={classes.title}>Paragraph {index + 1}</h3>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle} `}>Title:</h4>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "300px" }}
              size="small"
              id="title"
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle}`}>Description:</h4>
            <TextField
              InputProps={{ className: classes.inputMultiline }}
              sx={{ width: "300px" }}
              id="description"
              multiline={true}
              variant="outlined"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <Button className={classes.button} onClick={saveParagraph}>
            Save
          </Button>
          <Button className={classes.button} onClick={deleteParagraph}>
            Delete
          </Button>
        </div>
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          className={classes.modal}
        >
          <div className={classes.modalContainer}>
            <h2>{modalMessage}</h2>
            <Button variant="contained" onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RenderedParagraph;
