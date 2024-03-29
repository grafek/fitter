import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  type AddPostFormSchema,
  postSchemaInput,
} from "../../schemas/post.schema";
import { type Post } from "@prisma/client";
import type { ButtonColor } from "../ui/Button";
import { SPORTS } from "../../utils/globals";
import { useCallback, useState } from "react";
import { Button, ImageUpload, Input, Select, TextArea } from "../ui";
import { toast } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import { uploadImg } from "../../utils";
import { useRouter } from "next/router";
import { useCreatePost, useUpdatePost } from "../../hooks";

type PostFormProps = {
  post?: Post;
  buttonText: string;
  buttonColor: ButtonColor;
  isEditing?: boolean;
  redirectPath?: string;
};

const PostForm: React.FC<PostFormProps> = ({
  post,
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

  const { mutateAsync: addPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();


  const [imgData, setImgData] = useState<
    string | ArrayBuffer | null | undefined
  >();

  const submitHandler: SubmitHandler<AddPostFormSchema> = useCallback(
    async (postData) => {

      const imageUrl = await uploadImg(imgData).catch((e) => {
        if (e instanceof TRPCClientError) {
          toast.error(e.message, { id: toastId });
        }
      });

      const toastId = toast.loading("Submitting...");
      if (post && isEditing) {
        await updatePost({
          postId: post.id,
          postSchemaInput: { ...postData, image: imageUrl },
        });
      } else {
        await addPost({ ...postData, image: imageUrl });
      }
      toast.success("Successfully submitted", { id: toastId });
      router.push(redirectPath);
    },
    [addPost, imgData, isEditing, post, redirectPath, router, updatePost],
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
export default PostForm;
