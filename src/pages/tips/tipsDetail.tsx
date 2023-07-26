import Link from 'next/link';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import Header from "../../components/website/accommodation/header"

import { useEffect, useState, useCallback } from "react";
import { collection, getFirestore, getDoc, doc  } from "firebase/firestore";
import { useRouter } from 'next/router'

import classes from "./tipsDetail.module.css"

interface CoursesDetailHeader{
    title : string,
    description : string,
    imageUrl : string,
}

interface Blog{
  id:string,
  title:string;
  description:string;
  text:string;
}


export default function CourseDetail() {
  const router = useRouter();
  console.log('router', router)
  const [coursesDetailHeader, setCoursesDetailHeader] = useState<CoursesDetailHeader>({title:"",description:"",imageUrl: require('../../images/courseDetail-bg.jpeg').default.src });
  const [blog, setBlog] = useState<Blog|undefined>({id: "", "title" : "", "description": "", "text": ""});

  const fetchBlog = useCallback(async () => {
    if(router.query.id){
      const docCurRef = doc(getFirestore(), "tips-blog", router.query.id);
      const curDocSnap = await getDoc(docCurRef);
      const blogData = curDocSnap.data() as Blog;
      setBlog(blogData)
      const headerRef = doc(getFirestore(), "tips-blog-header", router.query.id);
      const curHeader = await getDoc(headerRef);
      const headerData = curHeader.data();
      setCoursesDetailHeader({ title: headerData.title, description: headerData.description, imageUrl: headerData.imageUrl });
    }
  }, []);

  useEffect(() => {
      setTimeout(()=>{
          fetchBlog()
      },400)
  }, []);
  console.log('blog', blog)
  return (
    <div className={classes.all}>
      <div className={classes.container} style={{ backgroundImage: `url(${coursesDetailHeader.imageUrl})`}}>
          <p className={classes.headerDescription}>Tips & Tricks > Article</p>
          <h1 className={classes.headerTitle}>{coursesDetailHeader.title}</h1>
      </div>
      <div className={"flex justify-center bg-[#ebe6de]"}>
          <div className={"w-[700px] p-[50px] bg-[#faf7f2]"} dangerouslySetInnerHTML={{ __html: blog.text }}></div>
      </div>

    </div>

  );
}
