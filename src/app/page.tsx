"use client"
import { useState } from "react";
import { api } from "./libs/eden";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SideBar from "./components/SideBar";
import {
  RiBookOpenLine,
  RiMap2Line,
  RiCalendarLine,
  RiGraduationCapLine,
  RiGroupLine,
  RiAddLine,
  RiMicLine,
} from "react-icons/ri";
export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);


  const categories = [
      {
        id: 1,
        title: "การศึกษา",
        description: "หลักสูตร วิชาเรียน การสอบ",
        icon: RiBookOpenLine,
      },
      {
        id: 2,
        title: "สถานที่",
        description: "อาคาร ห้องเรียน สิ่งอำนวยความสะดวก",
        icon: RiMap2Line,
      },
      {
        id: 3,
        title: "กิจกรรม",
        description: "กิจกรรมมหาวิทยาลัย งานต่างๆ",
        icon: RiCalendarLine,
      },
      {
        id: 4,
        title: "วิชาการ",
        description: "วิจัย โครงการ ทุนการศึกษา",
        icon: RiGraduationCapLine,
      },
      {
        id: 5,
        title: "ชุมชน",
        description: "ชมรม องค์กรนิสิต",
        icon: RiGroupLine,
      },
    ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOutput("");
    setLoading(true);

    try {
      const {data} = await api.chat.post({ prompt });
      if (!data) {
        setOutput("❌ Error connecting to chat stream");
        setLoading(false);
        return;
      }
      for await (const chunk of data) {
        const chunkStr = typeof chunk === "string" ? chunk : chunk.toString();
        const lines = chunkStr.split("\n");
        let eventType = "";
        let dataLine = "";
        for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              dataLine += line.slice(6);
            }
        }
        if (eventType !== "message") continue;
        try {
            const parsed = JSON.parse(dataLine);
            const msg = typeof parsed === "string" ? parsed : parsed.message ?? "";
            setOutput((prev) => prev + msg);
        } catch (err) {
            console.error("Failed to parse SSE chunk:", err);
        }
      }
    } catch (error) {
      setOutput("❌ Error during fetch");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedCategories, setSelectedCategories] = useState(0);
  return (
 <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 2,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#424242" }}>
                  KKU Chatbot
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#424242" }}
              >
                Welcome
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#424242" }}
              >
                Do you need help ?
              </Typography>
            </Box>

            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#424242",
                  mb: 2,
                }}
              >
                Category
              </Typography>
            </Box>
            {output === ""&&
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {categories.map((category, index) => (
                <Card
                  key={category.id}
                  sx={{
                    flex: "1 1 calc(20% - 16px)",
                    maxWidth: 200,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <CardActionArea
                    onClick={() => setSelectedCategories(index)}
                    data-active={selectedCategories === index ? "" : undefined}
                    sx={{
                      height: "100%",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ height: "100%" }}>
                      {category.icon && (
                        <category.icon size={30} color="#424242" />
                      )}
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {category.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>}

            {output !== ""&& <div className="text-black ">{output}</div>}
          </Container>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              gap: 1,
              mt: 5,
            }}
          >
            <TextField
              variant="outlined"
              fullWidth
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={handleSubmit}
              placeholder=" Type your message"
              slotProps={{
                input: {
                  startAdornment: (
                    <IconButton>
                      <RiAddLine />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton 

                      onClick={handleSubmit}
                    >
                      <RiMicLine />
                    </IconButton>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 5,
                  "& fieldset": {
                    borderColor: "gray",
                    borderWidth: 1,
                  },
                  "&:hover fieldset": {
                    borderColor: "gray",
                    borderWidth: 1,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                    borderWidth: 1,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
