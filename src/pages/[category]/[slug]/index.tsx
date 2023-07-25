import Grid from '@mui/material/Grid';
import { padding } from '@mui/system';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router'
import { FunctionComponent, useEffect, useState } from 'react';
import Image from 'next/image'
import { title } from 'process';
import ReactMarkdown from 'react-markdown';
import styles from './index.module.css'
import { Box } from '@mui/material';
import storiesBg from '../../../images/storiesbg.png'

interface PostData {
    title: string;
    name: string;
    cohort: string;
    text: string;
    imageurl: string;
    created: Date;
    edited: Date;
}

interface PostPageProps {

}

const PostPage: FunctionComponent<PostPageProps> = () => {
    const router = useRouter()
    const { slug } = router.query;
    const [data, setdata] = useState({
        title: "", name: "", cohort: "", text: "", imageurl: "", created: new Date(), edited: new Date()
    });
    const [headerurl, setheaderurl] = useState("");

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: undefined, timeZone: 'Asia/Singapore' } as Intl.DateTimeFormatOptions;


    const loaddata = async () => {
        console.log(router.query, router.query.slug, slug);
        const docRef = doc(getFirestore(), "blogs", slug as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const tempData = docSnap.data();
            tempData.created = tempData.created.toDate();
            tempData.edited = tempData.edited.toDate();
            setdata(tempData as PostData);
            console.log("Document data:", tempData);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    const loadheader = async () => {
        const docRef = doc(getFirestore(), "blogs-header", "storiesheader");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setheaderurl(docSnap.data().headerurl);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    useEffect(() => {
        if (slug !== undefined) {
            loaddata();
            loadheader();
        }
    }, [slug]);

    return <div style={{ paddingTop: '0px' }}>
        {
            headerurl &&
            <div style={{ width: '100%', height: 200, marginBottom: 16 }}>
                {/* <Image
                    src={headerurl}
                    alt="Header Image"
                    layout="fill"
                    objectFit="cover"
                /> */}
                <img src={headerurl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ color: 'white', marginLeft: 40, marginTop: -120, position: 'relative', fontSize: 15, }}>
                    <h1>{data.title}</h1>
                </div>
            </div>
        }
        {
            data.imageurl != "" ?
                <Grid container spacing={2}>
                    <Grid item lg={5} sx={{ display: { xs: 'none', lg: 'block' }, backgroundColor: '#FAFAFA' }}>
                        <div style={{ padding: 20 }}>
                            <div style={{ backgroundImage: `url(${storiesBg.src})`, backgroundSize: 'contain', height: 800, backgroundRepeat: 'no-repeat', padding: 50 }}>
                                <img src={data.imageurl} alt={data.name} width={400} height={400} style={{ objectFit: "cover", borderRadius: 30, marginLeft: 100 }} />
                                <div style={{ backgroundColor: '#DEDBD7', marginLeft: 40, marginTop: -50, borderRadius: '30px', width: '80%', padding: 40 }}>
                                    <strong><div className={styles.name}>{data.name}</div></strong>
                                    <strong><div className={styles.cohort}>{data.cohort}</div></strong>
                                    {/* <strong><div className={styles.time}>Published on: {data.created.toLocaleString('en-SG',dateOptions)}</div></strong> */}
                                    <strong><div className={styles.time}>Edited on: {data.edited.toLocaleString('en-SG', dateOptions)}</div></strong>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sx={{ display: { lg: 'none', xs: 'block' }, margin: 3 }}>
                        <Grid container>
                            <Grid item xs={3}>
                                <img src={data.imageurl} alt={data.name} style={{ objectFit: "cover", borderRadius: 5, width: '100%', marginTop: 5 }} />
                            </Grid>
                            <Grid item xs={9}>
                                <strong><div className={styles.name} style={{ paddingLeft: 20 }}>{data.name}</div></strong>
                                <strong><div className={styles.cohort} style={{ paddingLeft: 20 }}>{data.cohort}</div></strong>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={7} xs={12} sx={{ backgroundColor: '#FAF6F0' }}>
                        <ReactMarkdown className={styles.markdown} >{data.text}</ReactMarkdown>
                    </Grid>
                </Grid>
                : <p>loading</p>
        }
    </div>

}

export default PostPage;