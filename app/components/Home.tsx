'use client'
import { Page, Box } from "grommet"
import { getSession, signIn, useSession } from "next-auth/react";

import { Component } from "./component";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import Hero from "./Hero";
import Login from "./Login";
import { fetchUserData } from "@/utils/fetchData";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";


export const fetchContributorData = async () => {

  const data = await fetch('/api/getContributorData').then((res) => res.json());

  return data;
}

export default function Home() {

  const { data: session } = useSession();
  const [contributorData, setContributorData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchContributorData();
      setContributorData(data);
    };
    fetchData();
    
    const intervalId = setInterval(fetchData, 10000); // load every 10 seconds

    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (session) {
      const auth_token = session.accessToken;
      const fetchData = async () => {
        const userData = await fetchUserData(auth_token);
        const username = userData.username;

        if (contributorData.filter((contributor: any) => contributor.username === username).length === 0) {
          //post add user api
          const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: { username: username, access_token: auth_token } })
          });

        }
      }
      fetchData();
    }
  }
    , [session])


  return (
    <>
      <Page>


        <Box>
          <Hero />
          <Login />
          {!session &&
            <Button onClick={() => signIn()} className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-2">
              <FaGithub />Connect GitHub
            </Button>}
          {/* <Button onClick={() => signOut()} className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-2">
        <FaGithub />Signout
    </Button> */}
          <Component contributors={contributorData} />
          {/* {session ? <Component contributors={contributorData} /> : <Login />} */}
          <Footer />
        </Box>
      </Page >


    </>
  );
}