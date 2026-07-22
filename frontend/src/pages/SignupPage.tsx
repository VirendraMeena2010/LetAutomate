import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {useToast} from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const  toast  = useToast()
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        name,
        email,
        password
      }, {
        withCredentials: true
      });
      console.log(response);
      if(response.status === 200){
        toast({
          title: "Account created.",
          description: "Your account has been created successfully.",
        })
        navigate("/blogs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your account.",
      })
      console.log(error);
    }
  }     
  return(
    <>
    <Card className="w-87.5">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="john@example.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full" onClick={handleSignup}>Sign Up</Button>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <button className="text-blue-500 hover:underline" onClick={() => navigate("/signin")}>
            Sign In
          </button>
        </p>
      </CardFooter>
    </Card> 
    </>
  );
}