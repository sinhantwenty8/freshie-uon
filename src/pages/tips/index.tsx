import Link from 'next/link';
import Header from "../../components/website/accommodation/header"
import classes from "./index.module.css"

import "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { collection, getFirestore, getDocs, ref, getStorage, getDownloadURL  } from "firebase/firestore";

interface CoursesHeader{
    title : string,
    description : string,
    imageUrl : string,
}

interface Blog{
  id:string,
  blogTitle:string;
  compareImageUrl:string;
}


export default function AccommodationCompare() {
  const [coursesHeader, setCoursesHeader] = useState<CoursesHeader>({title:"",description:"",imageUrl: require('../../images/top-bg.png').default.src });
  const [bannerImageUrl,setBannerImageUrl] = useState("");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const fetchBlogs = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "tips-blog-header"));
    const fetchedBlogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Blog;
      fetchedBlogs.push({...blogData, id: doc.id});
    });
    setBlogs(fetchedBlogs);
  }, []);


  const fetchHeaderBanner = useCallback(async () => {
    
    const docs = await getDocs(collection(getFirestore(),"tips-header"));
    docs.forEach(e=>{
      if(e.id ==='tips'){
        let item = e.data()
        setBannerImageUrl(item.imageUrl)
        setCoursesHeader({title: item.title, description: item.description, imageUrl: item.imageUrl});
      }
    })
    
  }, []);


  


  useEffect(() => {
    setTimeout(()=>{
      fetchBlogs();
      fetchHeaderBanner()
    }, 300)
    
  }, []);

  console.log('courseHeader', coursesHeader)
  console.log('blogs', blogs)
  return (
    <div className={classes.all}>
        <Header title={coursesHeader.title} description={coursesHeader.description} imageUrl={bannerImageUrl}></Header>
        <div className={classes.cards}>
          <Grid container spacing={6} style={{ marginTop: '20px' }}>
            {blogs.map((_, index) => (
              <Grid key={index} item xs={6} md={4}>
                <Link href={`/tips/tipsDetail?id=${_.id}`} className={classes.link}>
                  <div className='flex'>
                    <div>
                      <img className='w-[270px] h-[300px]' src={_.imageUrl} />
                    </div>
                    <div className='flex flex-col	w-[200px] p-2 bg-white'>
                      <h1 className="text-[28px] mt-[30px]">{_.title}</h1>
                      <p>{_.description}</p>
                    </div>
                  </div>
                </Link>
              </Grid>
            ))}
        </Grid>
      </div>

    </div>
  )
}