import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "@/components/loading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PageLayout } from "@/components/layout";
import { PostView } from "@/components/post-view";

const CreatePostWizard = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast({
          variant: "destructive",
          title: "Failed to post",
          description: errorMessage[0],
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to post",
          description: "An error has occured",
        });
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        className="h-12 w-12 rounded-full"
        src={user.profileImageUrl}
        alt="profileImg"
        width={48}
        height={48}
      />
      <input
        className="grow bg-transparent outline-none"
        placeholder="Express yourself with an Emoji"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <Button disabled={isPosting} onClick={() => mutate({ content: input })}>
          Post
        </Button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start Fetching Early
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      {/* dark:from-[#2e026d] dark:to-[#15162c] */}
      <PageLayout>
        {/* <ThemeToggle /> */}
        <div className="flex border-b border-slate-500 p-4">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
