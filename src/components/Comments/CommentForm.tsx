import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";
import { useCreateComment } from "../../hooks";
import {
  commentSchemaInput,
  type AddCommentFormSchema,
} from "../../schemas/comment.schema";
import { Button, TextArea } from "../Layout";

type CommentFormProps = { postId: string };

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddCommentFormSchema>({
    resolver: zodResolver(commentSchemaInput),
  });

  const { mutateAsync: addComment, isError } = useCreateComment();

  let toastId: string;

  const submitCommentHandler: SubmitHandler<AddCommentFormSchema> = async (
    data
  ) => {
    toastId = toast.loading("Submitting a comment");
    await addComment({ postId, text: data.commentContent });
    if (isError) {
      toast.error("Someting went wrong...", { id: toastId });
    } else {
      toast.success("You've added a comment!", { id: toastId });
    }
    reset();
  };
  return (
    <form className="p-3" onSubmit={handleSubmit(submitCommentHandler)}>
      <div className="relative top-1">
        <TextArea
          name="commentContent"
          register={register}
          errors={errors.commentContent}
          placeholder="What do you think about this post?"
        />
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

export default CommentForm;
