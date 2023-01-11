import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Button, Layout, PageHeading } from "../components/Layout";

const SignInPage = () => {
  return (
    <Layout title="Sign in">
      <PageHeading>Sign in</PageHeading>
      <div className="mx-auto flex h-[65vh] max-w-xl flex-col justify-center gap-4">
        <Button
          color="google"
          className="mx-auto flex w-full items-center justify-center space-x-2"
          onClick={() =>
            signIn("google", {
              callbackUrl: '/',
            })
          }
        >
          <Image src="/google.svg" alt="Google" width={32} height={32} />
          <span>Sign in with Google</span>
        </Button>
        <Button
          color="discord"
          onClick={() =>
            signIn("discord", {
              callbackUrl: '/',
            })
          }
          className="mx-auto flex w-full items-center justify-center space-x-2"
        >
          <Image src="/discord.svg" alt="Discord" width={32} height={32} />
          <span>Sign in with Discord</span>
        </Button>
      </div>
    </Layout>
  );
};

export default SignInPage;
