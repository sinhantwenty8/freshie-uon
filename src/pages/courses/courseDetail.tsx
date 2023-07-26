import Link from 'next/link';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import Header from "../../components/website/accommodation/header"

import { useEffect, useState, useCallback } from "react";
import { collection, getFirestore, getDoc, doc  } from "firebase/firestore";
import { useRouter } from 'next/router'

import classes from "./courseDetail.module.css"

interface CoursesDetailHeader{
    title : string,
    description : string,
    imageUrl : string,
}

interface Blog{
  id:string,
  blogTitle:string;
  compareImageUrl:string;
}


export default function CourseDetail() {
  const router = useRouter();
  console.log('router', router)
  const [coursesDetailHeader, setCoursesDetailHeader] = useState<CoursesDetailHeader>({title:"",description:"",imageUrl: require('../../images/courseDetail-bg.jpeg').default.src });
  const [blog, setBlog] = useState<Blog|undefined>({id: "", "title" : "", "description": "", "text": ""});

  const fetchBlog = useCallback(async () => {
    if(router.query.id){
      const docCurRef = doc(getFirestore(), "courses-blog", router.query.id);
      const curDocSnap = await getDoc(docCurRef);
      const blogData = curDocSnap.data() as Blog;
      setBlog(blogData)
      const headerRef = doc(getFirestore(), "courses-blog-header", router.query.id);
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
      <Header title={""} description={""} imageUrl={coursesDetailHeader.imageUrl} height='100vh'></Header>
      <div className={classes.content}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/courses" className={classes.link}>
            Courses
          </Link>
          <Typography color="textPrimary" className={classes.link}>
            Detail
          </Typography>
        </Breadcrumbs>

        <Card >
          <CardContent>
            <Typography variant="h4" component="h5" className={classes.title}>
              {blog.title}
            </Typography>
            <Typography className={classes.subtitle}>
              {blog.description}
            </Typography>
            <div className={classes.cardcontent}>
              <div className={classes.text} dangerouslySetInnerHTML={{ __html:blog.text  }}></div>
            </div>
          </CardContent>
        </Card>

      </div>
      
    </div>
    
  );
}
