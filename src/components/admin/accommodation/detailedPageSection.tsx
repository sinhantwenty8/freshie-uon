import { Fragment, useCallback, useEffect, useState } from 'react';
import classes from "./detailedPageSection.module.css";
import { collection, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import RenderedSection from './renderedSection';
import Link from "next/link";

interface Blog{
    id:string;
    title:string;
    slug:string;
}

interface PageSection{
  id:string
  title:string;
  imageUrl:string;
  description:string;
}

export default function DetailedPageSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pageSection,setPageSection] = useState<PageSection[]>([]);
    const fetchBlogs = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "accommodation-blog"));
    const fetchedBlogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Blog;
      fetchedBlogs.push(blogData);
      console.log(doc.data().slug)
    });
    setBlogs(fetchedBlogs);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async()=>{
      fetchBlogs();
    },100)
    return ()=> clearTimeout(timeOutId)
  }, [fetchBlogs]);

    const fetchPageSection = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "accommodation-page"));
    const fetchedPageSection: PageSection[] = [];
    querySnapshot.forEach((doc) => {
      const pageData = doc.data() as PageSection;
      fetchedPageSection.push(pageData);
    });
    setPageSection((prev)=>fetchedPageSection);
  }, []);

    useEffect(() => {
      const timeOutId = setTimeout(async()=>{
        fetchPageSection();
      },100)
      return ()=> clearTimeout(timeOutId)
    }, [fetchPageSection]);
  
  return (
    <div>
        <div className={classes.container}>
          <div className={classes.innerContainer}>
            <div className={classes.titleContainer}>
              <h3 className={classes.title} style={{ marginRight: '150px' }}>No.</h3>
              <h3 className={classes.title}>Title</h3>
            </div>
            <div>
              {blogs.map((blog, index) => (
                <Link className={classes.link} key={blog.id} href={`/admin/pages/accommodation/blogTitle?=${blog.slug}`}>
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.blog}>{blog.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {pageSection.map((section,index)=>(
          <RenderedSection key={section.id+index} index={index+1} id={section.id} sectionTitle={section.title} sectionDescription={section.description} sectionImageUrl={section.imageUrl} ></RenderedSection>
        ))}
    </div>
  );
}
