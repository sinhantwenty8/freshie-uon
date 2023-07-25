import Link from "next/link";
import { useState } from "react";
import classes from "./sideBar.module.css";
import { Button, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

// Define a custom theme with a green color palette
const theme = createTheme({
  palette: {
    primary: {
      main: green[400],
    },
  },
});

interface SideBarProps {
  postPage: () => void;
  postHeader: () => void;
  postPagePreview: () => void;
  postHeaderPreview: () => void;
  isPublished: boolean;
  postedBy: string;
  postedDate: Timestamp;
  setIsPublished: (isPublished: boolean) => void;
}

export default function SideBar({
  postPage,
  postHeader,
  postHeaderPreview,
  postPagePreview,
  setIsPublished,
  isPublished,
  postedBy,
  postedDate,
}: SideBarProps) {
  const [isPublishedGlobally, setIsPublishedGlobally] = useState(isPublished);

  const formattedPostedDate = format(postedDate.toDate(), "MMMM dd, yyyy"); // Format the timestamp as "Month dd, yyyy"

  const handlePublishToggle = () => {
    const newIsPublished = !isPublishedGlobally;
    setIsPublishedGlobally(newIsPublished);
    setIsPublished(newIsPublished);
  };

  const updatePage = () => {
    postPage();
    postHeader();
  };

  const updatePreview = () => {
    postPagePreview();
    postHeaderPreview();
  };

  const postPageSection = async (
    id: string,
    title: string,
    description: string,
    uploadedImage: string
  ) => {
    const storage = getStorage();
    const storageRef = ref(storage, `accommodation-page/` + id);

    try {
      if (uploadedImage.trim() != "") {
        await uploadString(storageRef, uploadedImage, "data_url");
      }
      const imageUrl = uploadedImage
        ? await getDownloadURL(storageRef)
        : uploadedImage;
      const docRef = doc(getFirestore(), "accommodation-page", id);
      const curDocSnap = await getDoc(docRef);
      if (curDocSnap.exists()) {
        await updateDoc(docRef, {
          title: title,
          description: description,
          imageUrl: uploadedImage,
        });
      } else {
        await setDoc(docRef, {
          title: title,
          description: description,
          id: id,
          imageUrl: uploadedImage,
        });
      }
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <div>
          {/* <Button className={classes.previewButton} onClick={updatePreview} variant="contained" startIcon={<PreviewIcon />}>
            Preview
          </Button> */}
          <Button
            onClick={updatePage}
            className={classes.saveButton}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </div>
        <div>
          <h3 className={classes.sectionTitle}>Posted By</h3>
          <TextField
            InputProps={{ className: classes.input }}
            value={postedBy}
            sx={{ width: "200px" }}
            size="small"
            id="postedBy"
            variant="outlined"
          />
          <h3 className={classes.sectionTitle}>Post Date</h3>
          <TextField
            InputProps={{ className: classes.input }}
            value={formattedPostedDate}
            sx={{ width: "200px" }}
            size="small"
            id="postedDate"
            variant="outlined"
          />
          <div className={classes.publishContainer}>
            <h3 className={classes.sectionTitle}>Published globally</h3>
            <Switch
              checked={isPublishedGlobally}
              onChange={handlePublishToggle}
              name="publishedGlobally"
              color="primary"
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

// type TopNavBarAdminProps = {
//   onClose?: () => void;
// };

// export default function TopNavBarAdmin({ onClose }: TopNavBarAdminProps) {
