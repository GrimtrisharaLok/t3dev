import Head from "next/head";
import { GetStaticProps, NextPage } from "next/types";
import { api } from "@/utils/api";
import { PageLayout } from "@/components/layout";
import { LoadingPage } from "@/components/loading";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "@/server/db";
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import Image from "next/image";
import { PostView } from "@/components/post-view";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>An unexpected error has occured</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.users.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>404</div>;

  console.log(username);

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      {/* dark:from-[#2e026d] dark:to-[#15162c] */}
      <PageLayout>
        <div className="relative h-48 border-b border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username}'s profile image`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -m-16 ml-6 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-16" />
        <div className="p-6 text-2xl font-bold text-slate-200">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug.");

  const username = slug.replace("@", "");

  ssg.users.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
