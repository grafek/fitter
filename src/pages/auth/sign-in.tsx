import { type NextPage } from "next";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Button, Layout, PageHeading } from "../../components/Layout";
import { env } from "../../env/client.mjs";
import type { BuiltInProviderType } from "next-auth/providers";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

type SignInPageProps = {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
};

const SignInPage: NextPage<SignInPageProps> = ({ providers }) => {
  const router = useRouter();

  useEffect(() => {
    switch (router.query.error) {
      case "OAuthAccountNotLinked":
        toast(
          "The E-mail address is already connected to other provider. Please try using other account.",
          {
            style: {
              color: "rgb(239, 68, 68)",
              fontWeight: 500,
            },
            icon: "❌",
            id: "errorMsg",
          }
        );
        break;
      default:
        break;
    }
  }, [router.query.error]);

  return (
    <Layout title="Sign in">
      <PageHeading>Sign in</PageHeading>
      <div className="mx-auto flex h-[65vh] max-w-xl flex-col justify-center gap-4 ">
        {Object.values(providers).map((provider) => (
          <Button
            key={provider.id}
            buttonColor={provider.id}
            className="mx-auto flex w-full items-center justify-center space-x-2 md:px-4 md:py-2"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <Image
              src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.NEXT_PUBLIC_SUPABASE_BUCKET}/assets/${provider.id}.svg`}
              alt="Discord"
              width={32}
              height={32}
            />
            <span>Sign in with {provider.name}</span>
          </Button>
        ))}
      </div>
    </Layout>
  );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
