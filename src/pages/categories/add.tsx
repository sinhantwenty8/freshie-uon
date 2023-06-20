import { Button, Grid, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { Send } from "@mui/icons-material";
import { useRouter } from "next/router";

interface addCategoriesProps {

}

const addCategories: FunctionComponent<addCategoriesProps> = () => {
    const router = useRouter();
    const [error, seterror] = useState(false);
    const [category, setcategory] = useState("");
    const [slug, setslug] = useState("");
    const [errorstates, seterrorstates] = useState({
        sameslug: false, emptytext: false
    });
    const postCategory = async () => {
        if (category == '') {
            seterror(true);
            alert("Please enter a category");
        }
        else {
            await setDoc(doc(getFirestore(), "category", slug), {
                name: category,
            });
            router.push('/categories/list')
        }
    }

    const onCategoryChange = (categoryslug: string) => {
        setcategory(categoryslug)
        setslug(categoryslug.replaceAll(" ", "").toLowerCase())
        seterrorstates({ ...errorstates, sameslug: false })
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField fullWidth id="outlined-basic" label="Input Category" variant="outlined" onChange={(e) => { onCategoryChange(e.target.value) }} />
                    <TextField error={errorstates.sameslug} fullWidth id="outlined-basic" label="Slug" variant="outlined" style={{ margin: '10px 0' }} value={slug} onChange={(e) => { setslug(e.target.value); seterrorstates({ ...errorstates, sameslug: false }) }} helperText={errorstates.sameslug ? 'Slug already exists' : ''} />
                </Grid>
            </Grid>
            <Button variant="contained" endIcon={<Send />} onClick={() => postCategory()}>
                Upload
            </Button>
        </>);
}


export default addCategories;