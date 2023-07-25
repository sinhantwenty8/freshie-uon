import Link from "next/link";
import { useState } from "react";
import classes from "./topNavBar.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ExpandMore, ChevronRight, Menu } from "@mui/icons-material";
import SideNavBar from "./sideNavBar";
type TopNavBarAdminProps = {
  onClose?: () => void;
};

export default function TopNavBarAdmin({ onClose }: TopNavBarAdminProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <div className={classes.topNavBar}>
        <div className={classes.topNavContainer}>
          <Menu onClick={handleMenuClick} fontSize="large" />
          <h1 className={classes.title}>
            Freshie <sup>UON</sup>
          </h1>
        </div>
      </div>
    </div>
  );
}
