import { Grid, TextField, Button, TableContainer, Paper, TableHead, TableRow, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { log } from "console";
import { setDoc, doc, getFirestore, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FunctionComponent, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell as MuiTableCell } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AdminSidebar from "@/components/admin/navBar/adminsidebar";
interface addTestimonialProps {

}

interface Video {
    title: string;
    videourl: string;
}

const AddTestimonial: FunctionComponent<addTestimonialProps> = () => {
    const [title, settitle] = useState("");
    const [video, setvideo] = useState(null as File | null);
    const [videolocalurl, setvideolocalurl] = useState("");
    const [filtered, setFiltered] = useState<Video[]>([]);
    const [videos, setvideos] = useState<Video[]>([]);

    const postdata = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, `testimonials/${title}`);

        // 'file' comes from the Blob or File API
        const snapshot = await uploadBytes(storageRef, video!)
        const vidurl = await getDownloadURL(snapshot.ref);
        await setDoc(doc(getFirestore(), "testimonials", title), {
            title: title, videourl: vidurl
        })
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

    const searchChange = (query: string) => {
        const newFiltered = videos.filter(video =>
            video.title.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(newFiltered);
    };

    const getData = async () => {
        const querySnapshot = await getDocs(collection(getFirestore(), "testimonials"));
        const videos: Video[] = querySnapshot.docs.map(doc => ({ ...doc.data() } as Video));
        setvideos(videos);
        setFiltered(videos);
    }

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 100);
    }, []);


    return (<>
        <AdminSidebar />
        <div style={{ paddingLeft: "240px" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#EDF6FF", padding: "50px" }}>
                <h2 style={{ margin: 0, paddingBottom: "20px", color: "#6E94AF" }}>Testimonials</h2>
                <p style={{ margin: 0, color: "#000000" }}>Pages {'>'}
                    <a href={`/testimonial`} style={{ color: "#0093FF", textDecoration: "underline" }}>
                        Testimonials
                    </a>
                </p>
            </div>

            <Grid container spacing={2} style={{ backgroundColor: "#EBEEF0" }}>
                <Grid item xs={12} xl={9} style={{ paddingLeft: "30px" }}>

                    {/* Title */}
                    <div style={{ color: "#6E94AF" }}>Title</div>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        style={{ backgroundColor: "#FFFFFF" }}
                        onChange={(e) => settitle(e.target.value)}
                    />

                    <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "10px" }}>Upload Video:</div>
                    <div style={{ backgroundColor: "#FFFFFF", padding: '30px', borderRadius: '4px', width: "100%" }}>
                        <div style={{ backgroundColor: "#DCE2EA", borderRadius: '4px', padding: '30px', display: 'flex' }}>

                            {/* Left side */}
                            <div style={{ flex: 1, marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Upload Section */}
                                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '250px' }}>
                                        <Button style={{ margin: '0 0 10px 0', color: "#000000" }} variant="text" component="label">
                                            Upload Video
                                            <input
                                                hidden
                                                accept="video/*"
                                                type="file"
                                                onChange={(e) => {
                                                    setvideo(e.target.files![0]);
                                                    setvideolocalurl(URL.createObjectURL(e.target.files![0]));
                                                }}
                                            />
                                        </Button>
                                    </div>
                                </div>

                                {/* Video Section */}
                                <div style={{ marginBottom: '20px', width: '250px', marginLeft: '108px' }}>
                                    <div style={{ position: "relative", width: "100%" }}>
                                        <video controls src={videolocalurl} style={{ width: "100%", height: "100%" }} />
                                        {/* <video controls style={{ width: "100%", height: "100%" }}><source src={videolocalurl} type="video/mp4" /></video> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "20px" }}>Content</div>
                    <div style={{ backgroundColor: "#FFFFFF", padding: '50px', borderRadius: '4px', width: "100%" }}>
                        {/* Filter */}
                        <TextField
                            label="Filter by title"
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((video, index) => (
                                        <TableRow
                                            key={video.title}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <StyledBodyCell style={{ width: '10%' }}>{index + 1}</StyledBodyCell>
                                            <StyledBodyCell style={{ width: '50%' }} component="th" scope="row">
                                                {video.title}
                                            </StyledBodyCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                </Grid>

                {/* Save Button */}
                <Grid item xs={12} xl={3} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '30px' }}>
                    <Button
                        onClick={() => {
                            postdata();
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
                </Grid>
            </Grid>
        </div>
    </>);
}

export default AddTestimonial;