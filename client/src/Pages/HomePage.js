import React, { useEffect } from 'react'
import { Box, Container, Text , Tab , TabList , TabPanel , TabPanels , Tabs } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Registration from '../Components/Authentication/Registration'
import { useHistory } from 'react-router-dom'

const HomePage = () => {

  const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if(userInfo) {
            history.push("/chats");
        }
    } , [history]);

  return (
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
<Text fontSize="4xl" textAlign="center">
            CONNECT
          </Text>
        </Box>
        <Box  w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded" >
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Registration />
</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    );
  }

export default HomePage
