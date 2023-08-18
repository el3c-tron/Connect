import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React , {useState} from 'react'
import { useHistory } from 'react-router-dom';
import * as secp from '@noble/secp256k1';

let ToBase64 = function (u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}

let FromBase64 = function (str) {
    return atob(str).split('').map(function (c) { return c.charCodeAt(0); });
}

const Registration = () => {

    const [name , setName] = useState();
    const [username , setUsername] = useState();
    const [password , setPassword] = useState();
    const [confirmPassword , setConfirmpassword] = useState();

    const history = useHistory();
    const toast = useToast();

    const submitHandler = async () => {

        if(!name || !username || !password || !confirmPassword) {
            toast({
                title:"Please Fill all the Fields",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"bottom"
            });
            return;
        }

        if(password !== confirmPassword) {
            toast({
                title : "Passwrod and Confirm Password Does'nt Match",
                status : "warning",
                duration : 2000,
                isClosable : true,
                position : "bottom"
            });
            return;
        }

        try {

            const privKey = secp.utils.randomPrivateKey();
            const pubKey = secp.getPublicKey(privKey);

            var pbkey  = ToBase64(pubKey);
            var prkey  = ToBase64(privKey);

            const config = {
                headers : {
                    "Content-type" : "application/json"
                },
            };



            const { data } = await axios.post("/user/register" , {name , username , password , publicKey:pbkey} , config);
            
            toast({
                title : "Registration Sucessfull",
                status : "success",
                duration : 2000,
                isClosable : true,
                position : "bottom"
            });

            localStorage.setItem(username+"_privkey",prkey);
            localStorage.setItem("userInfo" , JSON.stringify(data));
            history.push("/chats");
        } catch(error) {
            toast({
                title : "Error Occured",
                status : "error",
                duration : 2000,
                isClosable : true,
                position : "bottom"
            });

        }
    }


  return (
    <VStack spacing='5px'>

        <FormControl isRequired id='first-name'>
            <FormLabel >Name</FormLabel>
            <Input
                placeholder='Name'
                onChange={(e)=>setName(e.target.value)}

            />

        </FormControl>

        <FormControl isRequired id='username'>
            <FormLabel >Username</FormLabel>
            <Input
                placeholder='Username'
                onChange={(e)=>setUsername(e.target.value)}

            />

        </FormControl>

        <FormControl isRequired id='password'>
            <FormLabel >Password</FormLabel>
            <Input
                type='password'
                placeholder='Password'
                onChange={(e)=>setPassword(e.target.value)}

            />

        </FormControl>

        <FormControl isRequired id='cpassword'>
            <FormLabel >Confirm Password</FormLabel>
            <Input
                type='password'
                placeholder='Confirm Password'
                onChange={(e)=>setConfirmpassword(e.target.value)}

            />

        </FormControl>

        <Button
            colorScheme='purple'
            width='100%'
            style={{marginTop:15}}
            onClick={submitHandler}
        >
            Register
        </Button>
        
    </VStack>
  )
}

export default Registration