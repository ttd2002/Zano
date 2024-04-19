import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  User,
  MagnifyingGlass,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { scrollElements, showScrollbars } from "../../components/Scrollbar";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends"; 
import { useDispatch, useSelector  } from "react-redux";
// scrollElements.forEach((el) => {
//   el.addEventListener("scroll", showScrollbars);
//   el.addEventListener("mouseenter", showScrollbars);
// });
import { fetchUserList, selectUserList, selectUserListLoading, selectUserListError } from '../../redux/slices/userSlice';
import Conversations from "../../components/Conversation/Conversations/Conversations";
const Chats = () => {
  // const dispatch = useDispatch();
  // const userList = useSelector(selectUserList);
  const [selectedUserId, setSelectedUserId] = useState(null);
  

  // const handleUserClick = (index) => {
  //   const selectedUser = userList[index]; // Log giá trị của selectedUser._id để kiểm tra
  //   const previousUserId = localStorage.getItem("SelectedUser");
  //   if (previousUserId) {
  //     // Nếu có, xóa thông tin user cũ
  //     removeUserFromLocalStorage();
  //   }
  //   saveUserToLocalStorage(selectedUser);
  //   setSelectedUserId(selectedUser);
  //   console.log(selectedUser);
  // };

  // const saveUserToLocalStorage = (User) => {
  //   localStorage.setItem("SelectedUser", JSON.stringify(User));
  // };

  // // Hàm xóa thông tin user cũ khỏi local storage
  // const removeUserFromLocalStorage = () => {
  //   localStorage.removeItem("SelectedUser");
  // };

  //test
  // const loading = useSelector(selectUserListLoading);
  // const error = useSelector(selectUserListError);

  // useEffect(() => {
  //   dispatch(fetchUserList());  
  // }, [dispatch]);
 
  const theme = useTheme();
  const [openDiaglog, setOpenDialogg] = useState(false);

  const handleCloseDialog = ()=>{
    setOpenDialogg(false);
  }
  const handleOpenDialog = ()=>{
    setOpenDialogg(true);
  }

  // const SearchSchema = Yup.object().shape({
  //   phone: Yup.string()
  //   .required("Phone number is required"), 
  // });
  


  // const onSubmit = async (data) => {
  //   try {
  //     //submit data backend
  //     //api call
  //     dispatch(searchUser())

  //   } catch (error) {
  //     console.log(error);
  //     reset();
  //     setError("afterSubmit", {
  //       ...error,
  //       message: error.message,
  //     });
  //   }
  // };

  // const methods = useForm({
  //   resolver: yupResolver(SearchSchema),
  // });

  // const {
  //   reset,
  //   setError,
  //   setValue,
  //   handleSubmit,
  //   formState: { errors, isSubmitting, isSubmitSuccessful },
  // } = methods;

  useEffect(() => {
    scrollElements.forEach((el) => {
      el.addEventListener("scroll", showScrollbars);
      // el.addEventListener("mouseenter", showScrollbars);

      return () => {
        el.removeEventListener("scroll", showScrollbars);
        // el.removeEventListener("mouseenter", showScrollbars);
      };
    });
  }, []); // Chạy một lần sau khi component được render

  return (
    <>
    <Box
      sx={{
        position: "relative",
        width: 310,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* App title */}
      <Stack p={2} spacing={2} sx={{ height: "100vh" }}>
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
        >

          <Typography variant="h5">ZANO</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton onClick={()=>{
              handleOpenDialog();
            }}>
              <User />
            </IconButton>
            <IconButton>
              <CircleDashed />
            </IconButton>
          </Stack>
        </Stack>

        {/* search */}
        <Stack sx={{ width: "100%" }}>
          <Search     >
            <IconButton >
            <SearchIconWrapper>
            <MagnifyingGlass color="#709CE6" /> 
            </SearchIconWrapper>     
            </IconButton>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>

        {/* archive */}
        <Stack spacing={1}>
          <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
            <ArchiveBox size={24} />
            <Button>Archive</Button>
          </Stack>

          <Divider />
        </Stack>

        {/* Chat Element */}
        <Stack
          onScroll={showScrollbars}
          data-scrollbars
          spacing={2}
          direction={"column"}
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: "8px", // chiều rộng của thanh cuộn
            },
            "&:-webkit-scrollbar-track": {
              background: "pink", // màu nền của thanh cuộn
            },
            "&:-webkit-scrollbar-thumb": {
              background: "#888", // màu của thanh cuộn
            },
            "&:-webkit-scrollbar-thumb:hover": {
              background: "#555", // màu của thanh cuộn khi di chuột qua
            },
            "&.is-scrolling": {
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.primary.main, // màu của thanh cuộn khi đang cuộn
                borderRadius: 10,
              },
            },
          }}
        >
          {/* Scroll bar */}
          <Stack spacing={2.4}>
            {/* pinned chat */}
            {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Pinned
            </Typography>
            {ChatList.filter((el) => el.pinned).map((el) => {
              return <ChatElement {...el} />;
            })} */}
          </Stack>

          {/* All chats */}
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              All Chats
            </Typography>
          {/* LOADING USERLISTchat */}
           <Conversations/>
{/*             
            {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          userList.map((user, index) => (
            // lay id
            <div onClick={() => handleUserClick(index)}> 
                 <ChatElement key={user._id} {...user}    />
            </div>
            
          ))
        )}      */}
          {/* {selectedUserId && <Conversation user={selectedUserId} />}  */}
          </Stack>
        </Stack>
      </Stack>
    </Box>

{openDiaglog && <Friends open={openDiaglog} handleClose={handleCloseDialog} />}

    </>
  );
};

export default Chats;