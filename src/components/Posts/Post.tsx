import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useDeletePost,
  useFollowers,
  useLikeAnimation,
  useLikePost,
  useUnlikePost,
  useUsers,
} from "../../hooks";
import { BsFillTrashFill } from "react-icons/bs";
import { HiOutlinePencilAlt } from "react-icons/hi";
import {
  Button,
  Dropdown,
  DropdownItem,
  FollowBtn,
  IconBtn,
  Modal,
  NavItem,
  ProfilePicture,
} from "../Layout";
import { toast } from "react-hot-toast";
import { FaComment, FaHeart, FaShareAlt } from "react-icons/fa";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import React, { memo, useCallback, useState } from "react";
import PostComments from "./PostComments";
import { DATE_FORMATTER } from "../../utils/globals";
import PostShare from "./PostShare";
import { TRPCClientError } from "@trpc/client";
import UsersList from "../Users/UsersList";

type PostItemProps = {
  post: RouterOutputs["post"]["infinitePosts"]["posts"][number];
  input: RouterInputs["post"]["infinitePosts"];
};

const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutate: like } = useLikePost({
    userId: session?.user?.id ? session.user.id : "",
    input,
  });
  const { mutate: unlike } = useUnlikePost({ input });

  const hasLiked = post.likes.find((like) => like.userId === session?.user?.id);

  const { animationClasses, likeAnimation } = useLikeAnimation({ hasLiked });

  const [commentsShown, setCommentsShown] = useState(false);

  const [removePostModal, setRemovePostModal] = useState(false);

  const [shareModal, setShareModal] = useState(false);

  const [usersLikedPostModal, setUsersLikedPostModal] = useState(false);

  const { data: usersLikedPost, isLoading } = useUsers({
    input: {
      where: {
        likes: {
          some: {
            postId: post.id,
          },
        },
      },
    },
    enabled: usersLikedPostModal,
  });

  const isOwner = post.creatorId === session?.user?.id;

  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
    enabled: session?.user ? true : false,
  });
  const isFollowing = followingIds?.includes(post.creatorId);

  const toggleLike = useCallback(async () => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    if (hasLiked) {
      unlike({ postId: post.id });
      return;
    }
    like({ postId: post.id });
    await likeAnimation();
  }, [hasLiked, like, likeAnimation, post.id, router, session, unlike]);

  const toggleComments = useCallback(() => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    setCommentsShown((prev) => !prev);
  }, [router, session]);

  const removePost = useCallback(async () => {
    const toastId = toast.loading("Removing post..", {
      icon: "🚮",
      style: { color: "#dc2626" },
    });
    try {
      await deletePost({ postId: post.id });
      toast.success("Post removed!", { id: toastId });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message, { id: toastId });
      }
    }

    router.push("/");
  }, [deletePost, post.id, router]);

  const seePost = router.query.postId ? null : (
    <Link
      href={`/post/${post.id}`}
      className="w-fit text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
    >
      See post
    </Link>
  );
  // only display 'see post' if it's not been redirected to post details

  const updatedAtContent =
    post.updatedAt.getTime() === post.createdAt.getTime() ? null : (
      <span className="font-light italic">
        Edited at: {post.updatedAt.toLocaleString()}
      </span>
    );

  const imageContent = post.image ? (
    <Link
      href={post.image}
      target="_blank"
      className="relative mb-8 h-96 rounded-lg bg-gradient-to-br from-slate-100 to-[#ecebeb] dark:from-[#1616208a] dark:to-[#161a2780]"
      rel="noreferrer"
    >
      <Image
        src={post.image}
        fill
        alt="workout-img"
        priority
        sizes="40x40"
        className="mx-auto min-h-[100px] max-w-fit rounded-md object-contain md:object-fill"
      />
    </Link>
  ) : null;

  const postOwnerActions = isOwner ? (
    <Dropdown className="divide-y-[1px] divide-gray-200 dark:divide-gray-600">
      <DropdownItem>
        <NavItem
          Icon={HiOutlinePencilAlt}
          iconColor="#1d4ed8"
          iconSize="1.5rem"
          linkClasses="justify-center py-2"
          linkDestination={`/post/${post.id}/edit`}
        />
      </DropdownItem>
      <DropdownItem>
        <NavItem
          Icon={BsFillTrashFill}
          onClick={() => setRemovePostModal(true)}
          linkClasses="justify-center py-2"
          iconColor="#dc2626"
          iconSize="1.5rem"
        />
      </DropdownItem>
    </Dropdown>
  ) : null;

  const postActions = (
    <div className="flex">
      <div className="mx-auto flex">
        <IconBtn
          Icon={FaHeart}
          iconColor={hasLiked ? "red" : "#818181"}
          className={`${animationClasses}`}
          title={`${hasLiked ? "Unlike" : "Like"} post`}
          onClick={toggleLike}
        />
        <Button
          onClick={() => setUsersLikedPostModal(true)}
          className="px-2 py-1 text-sm text-gray-800 outline-none hover:bg-[#e5e7eb] dark:text-gray-400 dark:hover:bg-[#1d2229]"
        >
          {post._count.likes}
        </Button>
      </div>
      <IconBtn
        Icon={FaComment}
        iconColor={"#818181"}
        onClick={toggleComments}
        title={`${commentsShown ? "Hide" : "Show"} comments`}
        count={post._count.comments}
      />
      <IconBtn
        Icon={FaShareAlt}
        iconColor={"#818181"}
        onClick={() => setShareModal(true)}
      />
    </div>
  );

  return (
    <div className="flex flex-col justify-between gap-3 rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${post.creatorId}`}>
          <ProfilePicture imageSrc={post.creator.image} />
        </Link>
        <div className="flex flex-col gap-[2px] text-sm">
          <Link
            href={`/profile/${post.creatorId}`}
            className="text-base font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
          >
            {post.creator.name}
          </Link>
          <span>{post.sport}</span>
          <span className="font-light">
            {DATE_FORMATTER.format(post.workoutDate)}
          </span>
          {updatedAtContent}
        </div>
        <span className="ml-auto">
          {!isOwner ? (
            <FollowBtn
              isFollowing={isFollowing ?? false}
              followingId={post.creatorId}
            />
          ) : null}
        </span>
        {postOwnerActions}
      </div>
      {seePost}
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="overflow-auto pb-8">{post.description}</p>
      {imageContent}
      {postActions}

      {session?.user && commentsShown ? (
        <PostComments postId={post.id} commentsShown={commentsShown} />
      ) : null}

      {removePostModal ? (
        <Modal
          actionTitle="Delete Post"
          hideModal={() => setRemovePostModal(false)}
          isOpen={removePostModal}
        >
          <h2>Are you sure to remove this post?</h2>
          <Button
            buttonColor="danger"
            onClick={removePost}
            className="mx-auto w-1/2"
          >
            Remove
          </Button>
        </Modal>
      ) : null}

      {usersLikedPostModal ? (
        <Modal
          actionTitle="Users who liked this post"
          hideModal={() => setUsersLikedPostModal(false)}
          isOpen={usersLikedPostModal}
        >
          <UsersList users={usersLikedPost} isLoading={isLoading} />
        </Modal>
      ) : null}

      {shareModal ? (
        <PostShare
          isOpen={shareModal}
          setIsOpen={setShareModal}
          postId={post.id}
        />
      ) : null}
    </div>
  );
};

export default memo(PostItem);
