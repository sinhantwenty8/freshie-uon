import TopNavBar from '../components/website/navBar/topNavBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app'
import { useRouter } from 'next/router';
import TopNavBarAdmin from '@/components/admin/navBar/topNavBar';
import SideNavBar from '@/components/admin/navBar/sideNavBar';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;
  const [isSideBarOpen,setIsSideBarOpen] = useState(true);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyA8hfrTnxD1pOUvJO6PchHxmj75A6U--M8",
      authDomain: "orientation-8ca3c.firebaseapp.com",
      projectId: "orientation-8ca3c",
      storageBucket: "orientation-8ca3c.appspot.com",
      messagingSenderId: "828392869780",
      appId: "1:828392869780:web:9b92b1e92881025bae8981"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
  }, []);

  const toggleSideBar = () => {
    console.log('click')
    setIsSideBarOpen(isSideBarOpen => !isSideBarOpen);
  };

  useEffect(() => {
    console.log(isSideBarOpen)
  if (isSideBarOpen == true) {
    document.body.classList.remove('closed');
  } else {
    document.body.classList.add('closed');
  }
}, [isSideBarOpen]);

  if(currentUrl.startsWith("/admin")){
    return (
      <div className='container'>
        <div>
          <SideNavBar open={isSideBarOpen} onClose={toggleSideBar} ></SideNavBar>
        </div>
        <div className={`sideContainer${isSideBarOpen ? '' : ' closed'}`}>
          <div className='topNavBarContainer'>
            <TopNavBarAdmin onClose={toggleSideBar}></TopNavBarAdmin>
          </div>
          <Component {...pageProps} />
        </div>
      </div>
    )
  }

  return (
  <div>
    <TopNavBar><Component {...pageProps} /></TopNavBar>
    
  </div>)
}



