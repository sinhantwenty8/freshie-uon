import Link from "next/link";
import { useState } from "react";
import classes from "./sideNavBar.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

interface SideNavBarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function SideNavBar({ open = true }: SideNavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={classes.container}>
      {open ? (
        <div className={classes.navBarContainer}>
          <div className={classes.topContainer}>
            <div className={classes.profileDiv}>
              <AccountCircleIcon
                style={{ fontSize: "60px", color: "white" }}
              ></AccountCircleIcon>
            </div>
            <div className={classes.profileDesDiv}>
              <h3>Admin #928</h3>
              <p>Last Accessed 10/02/23</p>
            </div>
          </div>
          <div className={classes.linksContainer}>
            <div className={classes.linkContainer}>
              <Link href="#" className={classes.link}>
                <p>Dashboard</p>
              </Link>
            </div>
            <div className={classes.linkContainer}>
              <div className={classes.collapseContainer}>
                <div className={classes.link} onClick={handleMenuClick}>
                  <p>
                    Pages{" "}
                    {isMenuOpen ? (
                      <ExpandMore className={classes.collapseIcon} />
                    ) : (
                      <ChevronRight className={classes.collapseIcon} />
                    )}
                  </p>
                </div>
                {isMenuOpen && (
                  <div className={classes.subLinksContainer}>
                    <div className={classes.subLinkContainer}>
                      <Link href="#" className={classes.sublink}>
                        <p>About Us</p>
                      </Link>
                    </div>
                    <div className={classes.subLinkContainer}>
                      <Link href="#" className={classes.sublink}>
                        <p>Contact Us</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={classes.linkContainer}>
              <Link href="#" className={classes.link}>
                <p>Posts</p>
              </Link>
            </div>
            <div className={classes.linkContainer}>
              <Link href="#" className={classes.link}>
                <p>Users</p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
