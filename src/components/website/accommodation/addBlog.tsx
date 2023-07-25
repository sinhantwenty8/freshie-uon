import TextField from "@mui/material/TextField";
import { FunctionComponent, useCallback, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import Grid from "@mui/material/Grid";
import ReactMarkdown from "react-markdown";
import Button from "@mui/material/Button";
import { Send } from "@mui/icons-material";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import classes from "./addBlog.module.css";
import HeaderEdit from "@/components/admin/pagesContent/hearderEdit";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// Initialize Cloud Firestore and get a reference to the service
interface writeProps {}

const AddBlog: FunctionComponent<writeProps> = () => {
  const [text, settext] = useState("");
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const timestamp = serverTimestamp();

  const postPage = async () => {
    if (text == "") {
      seterrorstates({ ...errorstates, emptytext: true });
    } else {
      const docRef = doc(getFirestore(), "accommodation-blog", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        seterrorstates({ ...errorstates, sameslug: true });
      } else {
        await setDoc(doc(getFirestore(), "accommodation-blog", slug), {
          title: title,
          text: text,
          createdAt: timestamp,
          postedBy: "",
        });
      }
    }
  };

  const onTitleChange = (title: string) => {
    settitle(title);
    setslug(title.replaceAll(" ", "-").toLowerCase());
    seterrorstates({ ...errorstates, sameslug: false });
  };

  return (
    <>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} xl={6} style={{}}>
          <div className={classes.upperSecContainer}>
            <h3 className={classes.sectionTitle}>Title</h3>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "600px" }}
              size="small"
              id="title"
              variant="outlined"
              onChange={(e) => onTitleChange(e.target.value)}
            />
            <h3 className={classes.sectionTitle}>Slug</h3>
            <TextField
              InputProps={{ className: classes.input }}
              sx={{ width: "600px" }}
              size="small"
              id="slug"
              variant="outlined"
              value={slug}
              onChange={(e) => {
                setslug(e.target.value);
                seterrorstates({ ...errorstates, sameslug: false });
              }}
              helperText={errorstates.sameslug ? "Slug already exists" : ""}
            />
            <h3 className={classes.sectionTitle}>Header</h3>
          </div>
          <HeaderEdit></HeaderEdit>
          <SimpleMDE
            className={classes.simpleMde}
            value={text}
            onChange={(e: string) => {
              settext(e);
              seterrorstates({ ...errorstates, emptytext: false });
            }}
          />
          <div style={{ color: "red" }}>
            {errorstates.emptytext ? "Please enter text" : ""}
          </div>
        </Grid>
        <Grid item xs={12} xl={6}>
          <ReactMarkdown className={classes.markdown}>
            {"# " + title + "  \n" + text}
          </ReactMarkdown>
        </Grid>
      </Grid>
      <Button variant="contained" endIcon={<Send />} onClick={() => postPage()}>
        Upload
      </Button>
    </>
  );
};
export default AddBlog;
