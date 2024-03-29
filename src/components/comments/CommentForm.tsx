import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import type { Dispatch, SetStateAction } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { useCreateComment, useUpdateComment } from "../../hooks";
import {
  type AddCommentFormSchema,
  commentSchemaInput,
} from "../../schemas/comment.schema";
import { TextArea, Button } from "../ui";
import type { Comment } from "@prisma/client";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  setShowReplies?: Dispatch<SetStateAction<boolean>>;
  comment?: Comment;
  isEditing?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  setShowReplies,
  isEditing,
  comment,
  setIsEditing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddCommentFormSchema>({
    resolver: zodResolver(commentSchemaInput),
  });

  const { mutateAsync: addComment } = useCreateComment();
  const { mutateAsync: updateComment } = useUpdateComment();

  let toastId: string;

  const submitCommentHandler: SubmitHandler<AddCommentFormSchema> = async (
    data,
  ) => {
    try {
      toastId = toast.loading("Submitting a comment");
      if (comment && isEditing && setIsEditing) {
        await updateComment({
          commentId: comment.id,
          text: data.commentContent,
        });
        setIsEditing(false);
      } else {
        await addComment({
          postId,
          text: data.commentContent,
          parentId: parentId ? parentId : undefined,
        });
      }
      toast.success("You've added a comment!", { id: toastId });
      reset();
      if (setShowReplies && parentId) {
        setShowReplies(true);
      }
    } catch (e) {
      if (e instanceof TRPCClientError) toast.error(e.message, { id: toastId });
    }
  };
  return (
    <form
      className="min-w-[150px] p-3"
      onSubmit={handleSubmit(submitCommentHandler)}
    >
      <div className="relative top-1">
        <TextArea
          name="commentContent"
          register={register}
          errors={errors.commentContent}
          defaultValue={comment ? comment.text : undefined}
          placeholder="What do you think about this post?"
        />
        {isEditing && setIsEditing ? (
          <Button
            isRounded
            onClick={() => setIsEditing(false)}
            buttonColor="danger"
            title="Dismiss"
            className={`absolute -top-9 right-0 md:-top-12`}
            disabled={isSubmitting}
          >
            <AiOutlineClose size={20} />
          </Button>
        ) : null}
        <Button
          type="submit"
          isRounded
          title="Add a comment"
          className={`${
            errors.commentContent ? "bottom-10" : "bottom-4"
          } absolute right-2 ml-auto bg-indigo-500 p-[10px] text-white outline-indigo-500 hover:bg-indigo-700`}
          disabled={isSubmitting}
        >
          <AiOutlineSend />
        </Button>
      </div>
    </form>
  );
};
