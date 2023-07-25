import { useCallback, useState } from "react";
import { TextField, Button, Modal } from "@mui/material";
import classes from "./subPageRenderedSection.module.css";

type Action = {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
};

interface RenderedActionProps {
  action: Action;
  handleEdit: (actionId: string, name: string, description: string) => void;
  handleDelete: (actionId: string) => void;
  index: number;
}

const RenderedAction: React.FC<RenderedActionProps> = ({
  action,
  handleEdit,
  handleDelete,
  index,
}) => {
  const [name, setName] = useState(action.name);
  const [description, setDescription] = useState(action.description);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value);
    },
    []
  );

  const deleteAction = useCallback(() => {
    handleDelete(action.id);
  }, [handleDelete, action.id]);

  const saveAction = useCallback(() => {
    if (name === "" || description === "") {
      setModalMessage("Please fill in all the fields.");
      setIsModalOpen(true);
      return;
    }

    handleEdit(action.id, name, description);
  }, [name, description, handleEdit, action.id]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalMessage("");
  }, []);

  return (
    <div key={action.id}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <h3 className={classes.title}>Action {index + 1}</h3>
          <div className={classes.textFieldContainer}>
            <h4 className={`${classes.subTitle} `}>Name:</h4>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "300px" }}
              size="small"
              id="name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
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
          <Button className={classes.button} onClick={saveAction}>
            Save
          </Button>
          <Button className={classes.button} onClick={deleteAction}>
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

export default RenderedAction;
