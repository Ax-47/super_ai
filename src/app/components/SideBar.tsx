import {
  Box,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useState } from "react";

const SideBar = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const historyItems = [
    { id: 1, title: "การลงทะเบียนเรียน", time: "2 ชม." },
    { id: 2, title: "ตารางสอบปลายภาค", time: "1 วัน" },
    { id: 3, title: "กิจกรรมปฐมนิเทศ", time: "3 วัน" },
    { id: 4, title: "ทุนการศึกษา", time: "1 สัปดาห์" },
    { id: 5, title: "ชมรมนิสิต", time: "2 สัปดาห์" },
  ];

  return (
    <>
      <Box sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
        <IconButton
          onClick={toggleDrawer}
          disableRipple
          sx={{
            "&:hover": { backgroundColor: "#e0e0e0" },
            transition: "background-color 0.2s",
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: open ? 300 : 75,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 300 : 75,
            boxSizing: "border-box",
            transition: "all 0.3s ease-in-out",
            pt: 8,
            background: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {/* <Card sx={{ bgcolor: "#d9d9d9", borderRadius: 2, mb: 1, mx: 1.5 }}> */}
            <ListItemButton
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 1 : 0,
                borderRadius: 3,
                mx: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  display: "flex",
                  color: "inherit",
                }}
              >
                <ChatBubbleOutlineIcon />
              </ListItemIcon>
              {open && <ListItemText primary="New chat" sx={{ ml: 2 }} />}
            </ListItemButton>
            {/* </Card> */}

            {/* <Card sx={{ bgcolor: "#d9d9d9", borderRadius: 2, mb: 1, mx: 1.5 }}> */}
            <ListItemButton
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 1 : 0,
                borderRadius: 3,
                mx: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  display: "flex",
                  color: "inherit",
                }}
              >
                <HistoryIcon />
              </ListItemIcon>
              {open && <ListItemText primary="History" sx={{ ml: 2 }} />}
            </ListItemButton>

            {open && (
              <CardContent>
                <Box sx={{ ml: 2 }}>
                  {historyItems.map((item) => (
                    <ListItemButton
                      key={item.id}
                      sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1,
                        color: "#424242",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        textTransform: "none",
                        fontSize: "0.875rem",
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#424242",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#757575" }}>
                          {item.time}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  ))}
                </Box>
              </CardContent>
            )}
            {/* </Card> */}
          </List>
        </Box>

        <Box>
          <Divider />
          <List>
            {/* <Card sx={{ bgcolor: "#d9d9d9", borderRadius: 2, mb: 1, mx: 1.5 }}> */}
            <ListItemButton
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 1 : 0,
                borderRadius: 3,
                mx: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  display: "flex",
                  color: "inherit",
                }}
              >
                <SettingsOutlinedIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Setting" sx={{ ml: 2 }} />}
            </ListItemButton>
            {/* </Card> */}

            {/* <Card sx={{ bgcolor: "#d9d9d9", borderRadius: 2, mb: 1, mx: 1.5 }}> */}
            <ListItemButton
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 1 : 0,
                borderRadius: 3,
                mx: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  display: "flex",
                  color: "inherit",
                }}
              >
                <InfoOutlinedIcon />
              </ListItemIcon>
              {open && <ListItemText primary="About" sx={{ ml: 2 }} />}
            </ListItemButton>
            {/* </Card> */}

            <ListItemButton
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 1 : 0,
                borderRadius: 3,
                mx: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  display: "flex",
                  color: "inherit",
                }}
              >
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Account" sx={{ ml: 2 }} />}
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
