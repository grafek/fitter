import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Button, Layout, PageHeading } from "../components/Layout";
import { env } from "../env/client.mjs";

const SignInPage: NextPage = () => {
  return (
    <Layout title="Sign in">
      <PageHeading>Sign in</PageHeading>
      <div className="mx-auto flex h-[65vh] max-w-xl flex-col justify-center gap-4">
        <Button
          buttonColor="google"
          className="mx-auto flex w-full items-center justify-center space-x-2"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/",
            })
          }
        >
          <Image
            src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.NEXT_PUBLIC_SUPABASE_BUCKET}/assets/google.svg`}
            alt="Google"
            width={32}
            height={32}
          />
          <span>Continue with Google</span>
        </Button>
        <Button
          buttonColor="discord"
          onClick={() =>
            signIn("discord", {
              callbackUrl: "/",
            })
          }
          className="mx-auto flex w-full items-center justify-center space-x-2"
        >
          <Image
            src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.NEXT_PUBLIC_SUPABASE_BUCKET}/assets/discord.svg`}
            alt="Discord"
            width={32}
            height={32}
          />
          <span>Continue with Discord</span>
        </Button>
      </div>
    </Layout>
  );
};

export default SignInPage;
