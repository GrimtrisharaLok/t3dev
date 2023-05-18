import { RouterOutputs } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-500 p-4">
      <Link href={`/@${author.username}`}>
        <Image
          className="h-12 w-12 rounded-full"
          src={author.profileImageUrl}
          alt="Profile Image"
          height={48}
          width={48}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-700 dark:text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
