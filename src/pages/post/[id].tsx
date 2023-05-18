import { PageLayout } from "@/components/layout";
import Head from "next/head";
import { NextPage } from "next/types";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      {/* dark:from-[#2e026d] dark:to-[#15162c] */}
      <PageLayout>Post Page</PageLayout>
    </>
  );
};

export default SinglePostPage;
