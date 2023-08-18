import { Avatar, Box, Button, Menu, MenuButton, MenuList, Text, Tooltip, MenuItem, 
    MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, 
    DrawerBody, Input, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../Config/ChatLogics';
import NotificationBadge from 'react-notification-badge'
import Effect from 'react-notification-badge/lib/components/Effect';


const SideDrawer = () => {

    const [search , setSearch] = useState("");
    
    const [searchResult , setSearchResult] = useState([]);

    const [loading , setLoading] = useState(false);

    const [loadingChat , setLoadingChat] = useState();

    
    const { user , setSelectedChat , chats , setChats , notification , setNotification } = ChatState();
    const history = useHistory();
    const {isOpen , onOpen , onClose} = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }
    const handleSearch = async () => {

        if(!search){
            toast({

                title:"Please Enter Something",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"top-left"
            });
            return;
        }

        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/user?search=${search}`,config);
            setSearchResult(data);
        } catch (error) {
            
            toast({

                title:"No User Found",
                status:"error",
                duration:2000,
                isClosable:true,
                position:"bottom-left"
            });

        }

    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post(`/chat` , {userId} , config);
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            // console.log(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({

                title:"Error fetching the chat",
                status:"error",
                duration:2000,
                isClosable:true,
                position:"bottom-left"
            });

        }

    }

  return (
    <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          bg={'white'}
          w={'100%'}
          p={'5px 10px 5px 10px'}
          borderWidth={'5px'}
        >



            <Tooltip label = "Search Users" hasArrow placement = 'bottom'>


                <Button variant="ghost" onClick={onOpen}>

                    <i class="fas fa-search"></i>
                    <Text display = {{base:"none" , md:"flex"}} px="4">
                        Search User
                    </Text>
                    

                </Button>

            </Tooltip>

            <Text fontSize={'2xl'} >
                CONN3CT
            </Text>

            <div>
                <Menu>

                    <MenuButton p = {1}>

                        <NotificationBadge 
                            count = {notification.length}
                            effect = {Effect.SCALE}

                        />
                        
                        <BellIcon fontSize='2xl' m={1}/>

                    </MenuButton>

                    <MenuList pl={2} cursor="pointer">
                        {!notification.length && "No New Messages"}
                        {notification.map(notif => (
                            <MenuList key={notif._id} onClick={()=>{
                                setSelectedChat(notif.chat);
                                setNotification(notification.filter((n)=>n !== notif))
                            }} >
                                {notif.chat.isGroupChat ? `New Message is ${notif.chat.chatName}` : 
                                `New Message from ${getSender(user , notif.chat.users)}`}

                            </MenuList>
                        ))}
                    </MenuList>

                    

                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>

                        <Avatar size='sm' cursor='pointer' src = {user.profilePhoto} name = {user.name} />
                        
                        

                    </MenuButton>

                    <MenuList>
                        <ProfileModal user={user}>

                            <MenuItem>My Profile</MenuItem>

                        </ProfileModal>

                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>


                </Menu>
            </div>



        </Box>

        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>

            <DrawerOverlay />
            
            <DrawerContent>
                
                <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
            
                <DrawerBody>

                    <Box display="flex" pb={2}>

                        <Input placeholder='Search by Name or Username'
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)} />
                        <Button onClick={handleSearch}>Search</Button>

                    </Box>

                    {
                        searchResult?.map((user) => (

                            <UserListItem 
                             key={user._id}
                             user={user}
                             handleFunction={() => accessChat(user._id)} 
                            />
                        ))
                    }

                </DrawerBody>

            </DrawerContent>


        </Drawer>

    </>
  )
}

export default SideDrawer