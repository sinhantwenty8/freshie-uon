import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  styled,
  useTheme,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { getAuth, signOut } from "firebase/auth";
import universityLogo from "@/images/universitylogo.png";
import React from "react";
import Link from "next/link";
import InfoIcon from "@mui/icons-material/Info";
import ApartmentIcon from "@mui/icons-material/Apartment";
import GroupsIcon from "@mui/icons-material/Groups";
import ReviewsIcon from "@mui/icons-material/Reviews";
import PublicIcon from "@mui/icons-material/Public";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SchoolIcon from "@mui/icons-material/School";
interface AdminSidebarProps {}

const drawerWidth = 240;
// export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
//     open?: boolean;
// }>(({ theme, open }) => ({
//     flexGrow: 1,
//     // padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     // marginLeft: `-${drawerWidth}px`,
//     ...(open && {
//         transition: theme.transitions.create('margin', {
//             easing: theme.transitions.easing.easeOut,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//         marginLeft: 0,
//     }),
// }));

const AdminSidebar: FunctionComponent<AdminSidebarProps> = () => {
  const listItems = [
    { icon: <InfoIcon />, text: "About Us", url: "/admin/pages/aboutus" },
    {
      icon: <ApartmentIcon />,
      text: "Accommodation",
      url: "/admin/pages/accommodation",
    },
    {
      icon: <SchoolIcon />,
      text: "Getting Around Campus",
      url: "/admin/pages/getting-around-campus",
    },
    {
      icon: <PublicIcon />,
      text: "Getting Around SG",
      url: "/admin/pages/getting-around-sg",
    },
    {
      icon: <ListAltIcon />,
      text: "Preparation Guide",
      url: "/admin/pages/preparation-guide",
    },
    {
      icon: <AutoStoriesIcon />,
      text: "Student Stories",
      url: "/admin/pages/stories",
    },
    {
      icon: <GroupsIcon />,
      text: "Student Club",
      url: "/admin/pages/studentclub",
    },
    {
      icon: <ReviewsIcon />,
      text: "Testimonials",
      url: "/admin/pages/testimonial",
    },
  ];

  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const handledialogopen = () => {
    setOpenDialog(true);
  };

  const handledialogclose = () => {
    setOpenDialog(false);
  };

  const signout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(
  //     itemProps,
  //     ref,
  // ) {
  //     return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  // });

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1B1A18",
            color: "#FFFFFF",
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <DrawerHeader style={{ backgroundColor: "#272B40" }}>
          <div
            style={{
              backgroundImage: `url(${universityLogo.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: 70,
              height: 70,
              borderRadius: "50%",
              marginRight: "auto",
            }}
            onClick={handledialogopen}
          ></div>
          {/* <img src={universityLogo.src} alt="" /> */}
        </DrawerHeader>
        <Divider />
        <List>
          {listItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                href={item.url}
              >
                <ListItemButton>
                  <ListItemIcon style={{ color: "white" }}>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
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
            <Button variant="outlined" onClick={signout}>
              Sign Out
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handledialogclose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminSidebar;
