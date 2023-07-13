import { AppBar, Toolbar, IconButton, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, styled, useTheme } from "@mui/material";
import { FunctionComponent, useState } from "react";
import MailIcon from '@mui/icons-material/Mail';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { getAuth, signOut } from "firebase/auth";

interface AdminSidebarProps {

}

const drawerWidth = 240;
export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AdminSidebar: FunctionComponent<AdminSidebarProps> = () => {
    const [openDialog, setOpenDialog] = useState(false);

    
    const theme = useTheme();

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
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
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    return (<>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1B1A18',
                    color: '#FFFFFF',
                },
            }}
            variant="persistent"
            anchor="left"
            open={true}
        >
            <DrawerHeader style={{ backgroundColor: '#272B40' }}>
                <div
                    style={{
                        backgroundImage: `url(../../images/universitylogo.png)`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        marginRight: 'auto'
                    }}
                    onClick={handledialogopen}
                ></div>
            </DrawerHeader>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
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
                    <Button variant="outlined" onClick={signout}>Sign Out</Button>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handledialogclose} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog></>);
}

export default AdminSidebar;