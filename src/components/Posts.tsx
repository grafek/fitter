import Image from "next/image";
import Link from "next/link";
import { type RouterInputs, type RouterOutputs } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  type AddPostFormSchema,
  postSchemaInput,
} from "../schemas/post.schema";
import { type Post } from "@prisma/client";
import type { ButtonColor } from "./UI/Button";
import { COMMENTS_LIMIT } from "../schemas/comment.schema";
import {
  POSTS_LIMIT,
  DATE_FORMATTER,
  DATETIME_FORMATTER,
  SPORTS,
} from "../utils/globals";
import { PostSkeleton } from "./UI/Skeletons";
import { BsFillTrashFill } from "react-icons/bs";
import { HiClipboardCopy, HiOutlinePencilAlt } from "react-icons/hi";
import {
  FaComment,
  FaFacebook,
  FaHeart,
  FaLinkedin,
  FaShareAlt,
  FaTwitter,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  useDeletePost,
  useFollowers,
  useInfiniteComments,
  useLikeAnimation,
  useLikePost,
  useUnlikePost,
  useUsers,
} from "../hooks";
import { memo, useCallback, useState } from "react";
import {
  Button,
  Dropdown,
  FollowBtn,
  IconBtn,
  ImageUpload,
  Input,
  InstagramIcon,
  Loading,
  Modal,
  ProfilePicture,
  Select,
  TextArea,
} from "./UI";
import { toast } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import UsersList from "./Users";
import { NavItem } from "./UI/Navigation";
import { DropdownItem } from "./UI/Dropdown";
import Comments, { CommentForm } from "./Comments";
import { uploadImg } from "../utils";

type PostListProps = {
  posts: RouterOutputs["post"]["infinitePosts"]["posts"];
  input: RouterInputs["post"]["infinitePosts"];
  isLoading: boolean;
};

const Posts: React.FC<PostListProps> = ({ posts, input, isLoading }) => {
  return (
    <>
      {isLoading
        ? Array(POSTS_LIMIT)
            .fill(1)
            .map((_, i) => <PostSkeleton key={i} />)
        : null}

      {(posts.length < 1 || !posts) && !isLoading ? (
        <div className="text-center text-xl">No posts found! </div>
      ) : null}

      {posts.map((post) => (
        <PostItem post={post} key={post.id} input={input} />
      ))}
    </>
  );
};

export default memo(Posts);

type PostItemProps = {
  post: RouterOutputs["post"]["infinitePosts"]["posts"][number];
  input: RouterInputs["post"]["infinitePosts"];
};

export const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
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
        Edited at: {DATETIME_FORMATTER.format(post.updatedAt)}
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
    <Dropdown>
      <DropdownItem>
        <NavItem
          Icon={HiOutlinePencilAlt}
          iconColor="#1d4ed8"
          iconSize="1.5rem"
          linkClasses="justify-center my-1"
          linkDestination={`/post/${post.id}/edit`}
        />
      </DropdownItem>
      <DropdownItem>
        <NavItem
          Icon={BsFillTrashFill}
          onClick={() => setRemovePostModal(true)}
          linkClasses="justify-center my-1"
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

type PostShareProps = {
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostShare: React.FC<PostShareProps> = ({ postId, isOpen, setIsOpen }) => {
  const [copied, setCopied] = useState(false);

  const postLink = `https://fitterr.vercel.app/post/${postId}`;

  const shareOnFacebook = () => {
    const url =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnTwitter = () => {
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent("Check out this post!") +
      "&url=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    const url =
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnInstagram = () => {
    const url =
      "https://www.instagram.com/?url=" + encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const copyToClipboard = () => {
    if (!copied) {
      navigator.clipboard.writeText(postLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Modal
      actionTitle="Share Post"
      hideModal={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <div className="flex justify-center gap-4">
        <button
          onClick={shareOnFacebook}
          className="text-blue-600 transition-colors hover:text-blue-800 focus:outline-none"
        >
          <FaFacebook size={40} />
        </button>
        <button
          onClick={shareOnTwitter}
          className="text-blue-400 transition-colors hover:text-blue-500 focus:outline-none"
        >
          <FaTwitter size={40} />
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="text-blue-800 transition-colors hover:text-blue-900 focus:outline-none"
        >
          <FaLinkedin size={40} />
        </button>
        <button
          onClick={shareOnInstagram}
          className=" transition-colors hover:text-blue-900 focus:outline-none"
        >
          <InstagramIcon />
        </button>
      </div>
      <div className="relative max-w-[500px]">
        <input
          type="text"
          value={postLink}
          readOnly
          className="w-full rounded-md border px-4 py-2 text-gray-600"
        />
        <button
          className="absolute bottom-0 right-0 top-0 rounded-md bg-blue-500 px-3 py-2 text-white"
          onClick={copyToClipboard}
        >
          <HiClipboardCopy size={20} />
        </button>
      </div>
    </Modal>
  );
};

type PostCommentsProps = { postId: string; commentsShown: boolean };

const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const commentsInputData: RouterInputs["comment"]["infiniteComments"] = {
    limit: COMMENTS_LIMIT,
    where: {
      parentId: null,
      post: {
        id: postId,
      },
    },
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    error,
    isLoading,
  } = useInfiniteComments({
    input: commentsInputData,
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col divide-y-[1px] rounded-md bg-[#f6f8fa] shadow-lg outline outline-1 outline-[#d0d7de]  dark:divide-gray-700 dark:bg-[#21262d] dark:outline-[#30363d]">
      <>
        <CommentForm postId={postId} />
        <Comments
          isLoading={isLoading}
          comments={comments}
          input={commentsInputData}
          error={error}
        />
      </>
      {comments.length >= COMMENTS_LIMIT && hasNextPage ? (
        <Button
          onClick={() => {
            fetchNextPage();
          }}
          isRounded
          className="m-2 py-2 text-blue-700 outline-blue-600 hover:bg-gray-200 dark:text-blue-500 dark:hover:bg-gray-800"
        >
          {isFetchingNextPage ? <Loading /> : "Show more comments"}
        </Button>
      ) : null}
    </div>
  );
};

type PostFormProps = {
  post?: Post;
  onSubmit: ({}: any) => Promise<Post>;
  buttonText: string;
  buttonColor: ButtonColor;
  isEditing?: boolean;
  redirectPath?: string;
};

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSubmit,
  isEditing,
  buttonText,
  buttonColor,
  redirectPath = "/",
}) => {
  const formDefaultValues = {
    title: post ? post.title : "",
    description: post ? post.description : "",
    sport: post ? post.sport : SPORTS[Math.ceil(Math.random() * SPORTS.length)],
    workoutDate: post ? post.workoutDate.toDateString() : "",
    image: post ? post.image : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddPostFormSchema>({
    resolver: zodResolver(postSchemaInput),
    defaultValues: formDefaultValues,
  });
  const router = useRouter();

  const [imgData, setImgData] = useState<
    string | ArrayBuffer | null | undefined
  >();

  const submitHandler: SubmitHandler<AddPostFormSchema> = useCallback(
    async (postData) => {
      let toastId: string;

      const imageUrl = await uploadImg(imgData).catch((e) => {
        if (e instanceof TRPCClientError) {
          toast.error(e.message, { id: toastId });
        }
      });

      if (typeof onSubmit === "function") {
        toastId = toast.loading("Submitting...");
        if (post && isEditing) {
          await onSubmit({
            postId: post.id,
            postSchemaInput: { ...postData, image: imageUrl },
            // post Update
          });
        } else {
          await onSubmit({ ...postData, image: imageUrl });
          //add post
        }
        toast.success("Successfully submitted", { id: toastId });
      }
      router.push(redirectPath);
    },
    [imgData, isEditing, onSubmit, post, redirectPath, router]
  );

  return (
    <form
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="w-full space-y-2">
        <Input
          required
          register={register}
          validation={{ required: true }}
          name="title"
          labelname="Title"
          placeholder="A catchy title!"
          errors={errors.title}
          type="text"
        />
      </div>
      <div className="w-full space-y-2">
        <TextArea
          required
          register={register}
          validation={{ required: true }}
          name="description"
          labelname="Description"
          placeholder="Describe your workout and feelings post session 😀"
          errors={errors.description}
        />
      </div>
      <div className="w-full space-y-2">
        <Select
          required
          errors={errors.sport}
          labelname="Sport"
          name="sport"
          validation={{ required: true }}
          register={register}
          options={SPORTS}
        />
      </div>
      <div className="w-full space-y-2">
        <Input
          required
          errors={errors.workoutDate}
          register={register}
          validation={{ required: true }}
          name="workoutDate"
          labelname="Workout Date"
          placeholder="Workout date"
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        />
      </div>
      <div className="flex w-full flex-col space-y-2">
        <ImageUpload
          initialImage={post?.image}
          register={register}
          name="image"
          labelName="Image"
          errors={errors.image}
          onChangePicture={(img) => setImgData(img)}
        />
      </div>
      <Button
        buttonColor={buttonColor}
        type="submit"
        disabled={isSubmitting}
        className="mt-4"
      >
        {isSubmitting ? "Submitting.." : buttonText}
      </Button>
    </form>
  );
};
