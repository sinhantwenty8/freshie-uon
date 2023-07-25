import { Grid, TextField, Button, TableContainer, Paper, TableHead, TableRow, Box, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Toolbar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Typography, useTheme, DialogContentText } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Article } from "@mui/icons-material";
import Image from 'next/image';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { text } from "stream/consumers";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell as MuiTableCell } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router, { useRouter } from "next/router";
import { log } from "console";
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import React from "react";
import { Main } from "next/document";
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AdminSidebar from "@/components/admin/navBar/adminsidebar";

interface Article {
    slug: string;
    title: string;
    name: string;
    cohort: string;
    text: string;
    imageurl: string;
    category: string;
}

const Add: FunctionComponent = () => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [articles, setArticles] = useState<Article[]>([]);
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Map<string, string>>(new Map());
    const [data, setData] = useState({ title: "", name: "", cohort: "", text: "", imageurl: "" });
    const [open, setOpen] = useState(false);
    const [textBoxValue, setTextBoxValue] = useState('');
    const [newslug, setnewslug] = useState("");
    const [created, setcreated] = useState(new Date());
    const [edited, setedited] = useState(new Date());
    const [image, setimage] = useState(null as File | null);
    const [imageurl, setimageurl] = useState("");
    const [description, setdescription] = useState("");
    const [opendrawer, setOpendrawer] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const loadData = async () => {
        // Load category data
        const categoryDocRef = doc(getFirestore(), "category", "studentstories");
        const categoryDocSnap = await getDoc(categoryDocRef);
        if (categoryDocSnap.exists()) {
            const categoryData = {
                slug: categoryDocSnap.id,
                ...categoryDocSnap.data()
            } as Article;
            setTitle(categoryData.name);
            setSlug("studentstories");
            console.log(categoryData.name);
        } else {
            console.log("No such document!");
        }

        // Load article data
        const querySnapshot = await getDocs(collection(getFirestore(), "blogs"));
        const blogs: Article[] = querySnapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() } as Article));
        setArticles(blogs);
        setFiltered(blogs);


        // Load categories data
        const categorySnapshot = await getDocs(collection(getFirestore(), "category"));
        const categoryMap = new Map<string, string>();
        categorySnapshot.forEach((doc) => categoryMap.set(doc.id, doc.data().name));
        setCategories(categoryMap);

        const docRef = doc(getFirestore(), "category", "studentstories");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setdescription(docSnap.data().description);
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    };

    const searchChange = (query: string) => {
        const newFiltered = articles.filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.name.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(newFiltered);
    };

    const onTitleChange = (title: string) => {
        setData({ ...data, title: title })
    }

    const loadheader = async () => {
        const docRef = doc(getFirestore(), "blogs-header", "mainpageheader");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setimageurl(docSnap.data().imageurl);
            console.log("Document data:", imageurl);

        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    const editheader = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, '/blogs/header/mainpageheader.png');

        // 'file' comes from the Blob or File API
        const snapshot = await uploadBytes(storageRef, image!);
        const imgurl = await getDownloadURL(snapshot.ref);

        await setDoc(doc(getFirestore(), "blogs-header", "mainpageheader"), {
            imageurl: imgurl,
        });
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onStoryTitleChange = (slug: string) => {
        setTextBoxValue(slug);
        setnewslug(slug.replaceAll(" ", "-").toLowerCase());
    }

    const addpage = async () => {
        const date = new Date();
        setcreated(date);
        setedited(date);
        await setDoc(doc(getFirestore(), "blogs", newslug), {
            category: "studentstories",
            cohort: "",
            created: created,
            edited: edited,
            imageurl: "",
            name: "",
            published: false,
            text: "",
            title: textBoxValue,
        });
        handleClose();
    }

    const edittitle = async () => {
        const titleRef = doc(getFirestore(), "category", "studentstories");

        await updateDoc(titleRef, {
            name: title,
            description: description
        });
    }

    const StyledHeaderCell = styled(MuiTableCell)(({ theme }) => ({
        fontWeight: 'bold',
        backgroundColor: '#E2E8EC',
        color: '#6E94AF'
    }));

    const StyledBodyCell = styled(MuiTableCell)({
        color: '#6E94AF',
        fontweight: 'bold'
    });

    const handleDrawerOpen = () => {
        setOpendrawer(true);
    };

    const handleDrawerClose = () => {
        setOpendrawer(false);
    };

    const drawerWidth = 240;
    const theme = useTheme();

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
        open?: boolean;
    }>(({ theme, open }) => ({
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }));

    const handledialogopen = () => {
        setOpenDialog(true);
    };

    const handledialogclose = () => {
        setOpenDialog(false);
    };

    const signout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    // Load data on component mount
    useEffect(() => {
        setTimeout(() => {
            loadData();
            loadheader();

            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                console.log(user);

                if (!user) {
                    router.push("../login");
                }
                else {
                    console.log(user);
                }
            });
        }, 100);
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#1B1A18',
                            color: '#FFFFFF',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={true}
                >
                    <DrawerHeader style={{ backgroundColor: '#272B40' }}>
                        <div
                            style={{
                                backgroundImage: `url(/universitylogo.png)`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: 70,
                                height: 70,
                                borderRadius: '50%',
                                marginRight: 'auto'
                            }}
                            onClick={handledialogopen}
                        ></div>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Dialog
                    open={openDialog}
                    onClose={handledialogclose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Admin Options"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Button variant="outlined" onClick={signout}>Sign Out</Button>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handledialogclose} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog> */}
                

                <Main style={{ padding: "0px" }}>
                    {/* Header */}
                    <div style={{ backgroundColor: "#EDF6FF", padding: "50px" }}>
                        <h2 style={{ margin: 0, paddingBottom: "20px", color: "#6E94AF" }}>{title}</h2>
                        <p style={{ margin: 0, color: "#000000" }}>Pages {'>'}
                            <a href={`/${slug}`} style={{ color: "#0093FF", textDecoration: "underline" }}>
                                {title}
                            </a>
                        </p>
                    </div>
                    <Grid container style={{ backgroundColor: "#EBEEF0" }}>
                        <Grid item xs={12} xl={9} style={{ paddingLeft: "30px" }}>

                            {/* Title */}
                            <div style={{ color: "#6E94AF" }}>Title</div>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                style={{ backgroundColor: "#FFFFFF" }}
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                            />

                            {/* Slug */}
                            <div style={{ color: "#6E94AF" }}>Slug</div>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                disabled
                                style={{ margin: "10px 0", backgroundColor: "#FFFFFF" }}
                                value={slug}
                            />
                            <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "10px" }}>Header</div>
                            <div style={{ backgroundColor: "#FFFFFF", padding: '30px', borderRadius: '4px', width: "100%" }}>
                                <div style={{ backgroundColor: "#DCE2EA", borderRadius: '4px', padding: '30px', display: 'flex' }}>

                                    {/* Left side */}
                                    <div style={{ flex: 1, marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {/* Upload Section */}
                                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ color: "#000000", marginRight: '10px' }}>Upload Image:</div>
                                            <div style={{ width: '250px' }}>
                                                <input
                                                    accept="image/*"
                                                    multiple
                                                    type="file"
                                                    onChange={(e) => {
                                                        setimage(e.target.files![0]);
                                                        setimageurl(URL.createObjectURL(e.target.files![0]))
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Image Section */}
                                        <div style={{ marginBottom: '20px', width: '250px', marginLeft: '108px' }}>
                                            <div style={{ position: "relative", width: "100%" }}>
                                                <img style={{ objectFit: "cover" }}
                                                    src={imageurl}
                                                    alt="Header Image"
                                                    width={200}
                                                    height={100}
                                                />
                                            </div>
                                        </div>

                                        {/* Description Section */}
                                        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                                            <div style={{ color: "#000000", marginRight: '10px', marginTop: '20px' }}>Description:</div>
                                            <div style={{ width: '250px' }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    style={{ backgroundColor: "#FFFFFF" }}
                                                    value={description}
                                                    onChange={(e) => setdescription(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "20px" }}>Content</div>
                            <div style={{ backgroundColor: "#FFFFFF", padding: '50px', borderRadius: '4px', width: "100%" }}>
                                {/* Filter */}
                                <TextField
                                    label="Filter by title or author"
                                    variant="outlined"
                                    onChange={(e) => searchChange(e.target.value)}
                                    fullWidth
                                    style={{ margin: "20px 0", backgroundColor: "#FFFFFF", paddingTop: "0px" }}
                                />

                                {/* Table */}
                                <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledHeaderCell>No.</StyledHeaderCell>
                                                <StyledHeaderCell>Title</StyledHeaderCell>
                                                <StyledHeaderCell>Author</StyledHeaderCell>
                                                <StyledHeaderCell>Category</StyledHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filtered.map((article, index) => (
                                                <TableRow
                                                    key={article.slug}
                                                    onClick={() =>
                                                        (window.location.href = `/admin/pages/${article.category}/${article.slug}`)
                                                    }
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <StyledBodyCell style={{ width: '10%' }}>{index + 1}</StyledBodyCell>
                                                    <StyledBodyCell style={{ width: '50%' }} component="th" scope="row">
                                                        {article.title}
                                                    </StyledBodyCell>
                                                    <StyledBodyCell style={{ width: '20%' }}>{article.name}</StyledBodyCell>
                                                    <StyledBodyCell style={{ width: '20%' }}>
                                                        {categories.get(article.category)}
                                                    </StyledBodyCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Add Button */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    style={{ margin: "20px 0" }}
                                >
                                    <Button variant="contained" onClick={handleClickOpen} style={{ backgroundColor: "#86A7D3" }}>
                                        Add
                                    </Button>
                                </Box>
                            </div>

                        </Grid>

                        {/* Save Button */}
                        <Grid item xs={12} xl={3} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '30px' }}>
                            <Button
                                onClick={() => {
                                    editheader();
                                    edittitle();
                                }}
                                style={{
                                    backgroundColor: '#86A7D3',
                                    marginTop: '20px',
                                    height: '56px',
                                    minWidth: '100px',
                                    padding: '16px 24px'
                                }}
                                variant="contained"
                                startIcon={<SaveIcon />}
                            >
                                Save
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Add new student story</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Article name"
                                        type="text"
                                        fullWidth
                                        value={textBoxValue}
                                        onChange={(e) => onStoryTitleChange(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={addpage} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                </Main>
            </Box >



        </>
    );
}


export default Add;