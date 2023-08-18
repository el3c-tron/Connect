import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import React from 'react'

const ProfileModal = ({ user , children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    { 
      children ? (<span span onClick={onOpen} > {children}</span> ) : (
        <IconButton
          display={{base:'flex'}}
          icon={<ViewIcon/>}
          onClick={onOpen}
        />
      )
    }

    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            fontSize="40px"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              border={'1px solid black'}
              boxSize="150px"
              src={user.profilePhoto}
              alt={user.name}
            />
            <Text
            
              fontSize={{ base: "28px", md: "30px" }}
            >
              username: {user.username}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default ProfileModal