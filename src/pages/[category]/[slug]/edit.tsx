import TextField from "@mui/material/TextField";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ReactMarkdown from "react-markdown";
import Button from "@mui/material/Button";
import { Send } from '@mui/icons-material';
import { maxWidth } from "@mui/system";
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css";
import Image from "next/image";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { blob } from "stream/consumers";
import styles from '../../../styles/Edit.module.css'
import { useRouter } from "next/router";
import { FormControlLabel, Switch } from "@mui/material";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

// Initialize Cloud Firestore and get a reference to the service
interface PostData {
    title: string;
    name: string;
    cohort: string;
    text: string;
    imageurl: string;
}

interface editProps {

}

const edit: FunctionComponent<editProps> = () => {
    const [emptytext, setemptytext] = useState(false);
    const router = useRouter()
    const { slug } = router.query;
    const [data, setdata] = useState({
        title: "", name: "", cohort: "", text: "", imageurl: ""
    });
    const [image, setimage] = useState(null);
    const [imageurl, setimageurl] = useState("");
    const [ispublished, setispublished] = useState(false);
    const [header, setheader] = useState(null);
    const [headerurl, setheaderurl] = useState("");

    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setispublished(e.target.checked);
    }
    const loaddata = async () => {
        console.log(router.query, router.query.slug, slug);
        const docRef = doc(getFirestore(), "blogs", slug as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const postData = docSnap.data() as PostData & { published: boolean };
            setdata(docSnap.data() as PostData);
            setispublished(postData.published);
            console.log("Document data:", docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        const docRef2 = doc(getFirestore(), "blogs-header", "storiesheader");
        const docSnap2 = await getDoc(docRef2);

        if (docSnap2.exists()) {
            console.log("Document data:", docSnap2.data());
            setheaderurl(docSnap2.data().headerurl);
            console.log("Document data:", headerurl);

        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    useEffect(() => {
        if (slug !== undefined) loaddata();
    }, [slug]);

    const updatePage = async () => {
        if (data.text == '') {
            setemptytext(true)
        }
        else {
            const storage = getStorage();
            const storageRef = ref(storage, `blogs/${slug}`);
            const snapshot = await uploadBytes(storageRef, image!);
            const imgurl = await getDownloadURL(snapshot.ref);

            const docRef = doc(getFirestore(), "blogs", slug as string);
            await updateDoc(docRef, {
                title: data.title, name: data.name, cohort: data.cohort, text: data.text, imageurl: imgurl, published: ispublished
            })
            const docRef2 = doc(getFirestore(), "blogs-header", "storiesheader");
            const docSnap2 = await getDoc(docRef2);

            if (docSnap2.exists()) {
                console.log("Document data:", docSnap2.data());
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

            const headerstorageRef = ref(storage, '/blogs/header/storiesheader.png');
            const headersnapshot = await uploadBytes(headerstorageRef, header!);
            const headerurl = await getDownloadURL(headersnapshot.ref);

            await setDoc(doc(getFirestore(), "blogs-header", "storiesheader"), {
                headerurl: headerurl,
            });
        }
    }

    const onTitleChange = (title: string) => {
        setdata({ ...data, title: title })
    }


    return (
        <Grid container spacing={2} style={{ backgroundColor: '#EBEEF0' }}>
            <Grid item xs={12} xl={9} style={{ paddingLeft: '30px' }}>
                <div style={{ color: '#6E94AF' }}>Title</div>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={data.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                />
                <div style={{ color: '#6E94AF' }}>Slug</div>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    disabled
                    style={{ margin: '10px 0', backgroundColor: '#FFFFFF' }}
                    value={slug}
                />
                <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "10px" }}>Header</div>
                <div style={{ backgroundColor: "#FFFFFF", padding: '30px', borderRadius: '4px', width: "100%" }}>
                    <div style={{ backgroundColor: "#DCE2EA", borderRadius: '4px', padding: '30px' }}>
                        <Button style={{ margin: '0 0 10px 0', color: "#000000" }} variant="text" component="label" endIcon={<DriveFolderUploadIcon />}>Change header<input hidden accept="image/*" multiple type="file" onChange={(e) => { setheader(e.target.files[0]); setheaderurl(URL.createObjectURL(e.target.files[0])) }} />
                        </Button>
                        {/* Image */}
                        <div style={{ position: "relative", width: "100%", paddingTop: "30%" }}>
                            <Image
                                src={headerurl}
                                alt="Header Image"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div style={{ margin: '0 0 10px 0' }}  >{header ?
                            <div style={{ color: 'green' }}>Header inserted <br />
                            </div> : <div></div>}
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: '30px', borderRadius: '4px', width: "100%" }}>
                    <div style={{ backgroundColor: "#DCE2EA", borderRadius: '4px', padding: '30px' }}>
                        <Button style={{ margin: '0 0 10px 0', color: "#000000" }} variant="text" component="label" endIcon={<DriveFolderUploadIcon />}>Change profile photo<input hidden accept="image/*" multiple type="file" onChange={(e) => { setimage(e.target.files[0]); setimageurl(URL.createObjectURL(e.target.files[0])) }} />
                        </Button>
                        {/* Image */}
                        <div style={{ position: "relative", width: "100%", paddingTop: "30%" }}>
                            <Image
                                src={data.imageurl}
                                alt="Header Image"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div style={{ margin: '0 0 10px 0' }}  >{image ?
                            <div style={{ color: 'green' }}>Profile inserted <br />
                            </div> : <div></div>}
                        </div>
                    </div>
                </div>



                <div style={{ color: '#6E94AF' }}>Content</div>
                <div style={{ padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid rgba(0, 0, 0, 0.23)' }}>
                    <SimpleMDE
                        value={data.text}
                        onChange={(e: string) => { setdata({ ...data, text: e }); setemptytext(false) }}
                    />
                </div>
                <div style={{ color: 'red' }}>{emptytext ? 'Please enter text' : ''}</div>

                <div style={{ color: '#6E94AF' }}>Class</div>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    style={{ margin: '10px 0', backgroundColor: '#FFFFFF' }}
                    value={data.cohort}
                    onChange={(e) => setdata({ ...data, cohort: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} xl={3} style={{ marginTop: '35px', paddingLeft: '30px', paddingRight: '30px' }}>
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" style={{ backgroundColor: '#86A7D3' }} endIcon={<Send />} onClick={() => updatePage()}>
                        Update
                    </Button>
                </Box>
                <div style={{ color: '#6E94AF', marginTop: '10px' }}>Name</div>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={data.name}
                    onChange={(e) => setdata({ ...data, name: e.target.value })}
                />
                <Box display="flex" justifyContent="flex-end" style={{ marginTop: '20px' }}><FormControlLabel label="Published globally" control={<Switch checked={ispublished} onChange={onchange} />} /></Box>
            </Grid>
        </Grid>
    );

}
export default edit;