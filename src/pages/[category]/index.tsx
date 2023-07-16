import { TableRow, TableCell, Button, Grid } from "@mui/material";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";

interface indexPageProps {

}

interface article {
    slug: string;
    name: string;
    title: string;
    cohort: string;
    text: string;
    imageurl: string;
    category: string;
    published: boolean;
}

const IndexPage: FunctionComponent<indexPageProps> = () => {
    const [articles, setarticles] = useState([] as article[]);
    const [filtered, setfiltered] = useState([] as article[]);
    const [headerurl, setheaderurl] = useState("");
    const [name, setname] = useState("");
    const [description, setdescription] = useState("");

    const listblogs = async () => {
        const querySnapshot = await getDocs(collection(getFirestore(), "blogs"));
        const blogs = [] as article[];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            blogs.push({ slug: doc.id, ...doc.data() } as article);

        });
        console.log(blogs);
        setarticles(blogs);
        setfiltered(blogs);
    }
    const loadheader = async () => {
        const docRef = doc(getFirestore(), "blogs-header", "mainpageheader");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setheaderurl(docSnap.data().imageurl);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    const loaddescription = async () => {
        const docRef = doc(getFirestore(), "category", "studentstories");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setname(docSnap.data().name)
            setdescription(docSnap.data().description)
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    useEffect(() => {
        setTimeout(() => {
            listblogs();
            loadheader();
            loaddescription();
        }, 100);

    }, []);

    return (<div style={{ backgroundColor: '#D9E0E5' }}>
        {
            headerurl &&
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <img style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    src={headerurl}
                    alt="Header Image"
                />
                <div style={{ position: 'absolute', top: '50%', left: '10%', color: 'white' }}>
                    <h1>{name}</h1>
                    {description}
                </div>
            </div>
        }
        <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#565F76', paddingLeft: '120px', paddingTop: '70px' }}>
            Recommended For You
        </div>
        <Grid container spacing={2} justifyContent="left" style={{ padding: '0 120px' }}>{
            filtered
                .filter(article => article.published)
                .map((article) => (
                    <Grid key={article.slug} item xs={12} md={4}>
                        <Link href={`/${article.category}/${article.slug}`}>
                            <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 450, padding: '10px', borderRadius: '15px' }}>
                                <div style={{ width: '100%', height: '80%', overflow: 'hidden', position: 'relative', borderRadius: '15px 15px 15px 15px' }}>
                                    <img src={article.imageurl} alt="Article Image" style={{ objectFit: 'cover', width: '100%', height: '100%' }}></img>
                                    {/* <Image src={filtered.length > 0 ? filtered[0].imageurl : '/placeholder.jpg'} alt="Article Image" layout="fill" objectFit="cover" /> */}
                                </div>
                                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                    <div style={{ fontWeight: 'bold', textAlign: 'left', color: '#9E928B' }}>{
                                        article.title
                                    }</div>
                                    <div style={{ marginTop: '5px', textAlign: 'left', color: '#9E928B' }}>{
                                        article.name
                                    }</div>
                                </div>
                            </div>
                        </Link>

                    </Grid>
                ))
        }</Grid>


    </div>);
}

export default IndexPage;