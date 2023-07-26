import { Height } from "@mui/icons-material";
import { Grid, Card, CardContent } from "@mui/material";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";

interface Videos {
    videourl: string;
    title: string;
}

interface testimonialProps {

}

const Testimonial: FunctionComponent<testimonialProps> = () => {
    const [videos, setvideos] = useState([] as Videos[]);

    const getdata = async () => {
        const querySnapshot = await getDocs(collection(getFirestore(), "testimonials"));
        const videos = [] as Videos[];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            videos.push({ videourl: doc.data().videourl, title: doc.data().title });
        });
        setvideos(videos);
        console.log(videos);
    }

    useEffect(() => {
        setTimeout(() => {
            getdata();
        },)
    }, []);

    return (
        <div style={{
            backgroundColor: 'rgb(214,189,177)',
            background: 'linear-gradient(139deg, rgba(214,189,177,1) -5%, rgba(218,229,245,1) 100%)',
            padding: '2rem',
            paddingLeft: '4rem',
            paddingRight: '4rem',
            paddingBottom: '4rem',
            height: '700px',
        }}>
            <div style={{
                fontSize: '50px',
                fontWeight: 'bold',
                color: '#1F304A',
                textAlign: 'center',
                marginBottom: '3rem',
                paddingTop: '30px',
            }}>
                Testimonials
            </div>
            <Grid container spacing={6} justifyContent="center" style={{ marginBottom: "2rem" }}>
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.videourl}>
                        <Card sx={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0)'
                        }}>
                            <CardContent style={{ padding: 0 }}>
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative"
                                    }}
                                >
                                    
                                    <video controls style={{ width: "100%", height: "100%" }}><source src={video.videourl} type="video/mp4" /></video>
                                </div>
                            </CardContent>
                            <div style={{color:"white", marginTop:"10px", fontSize:"20px", fontWeight:"bold"}}>{video.title}</div>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Testimonial; 