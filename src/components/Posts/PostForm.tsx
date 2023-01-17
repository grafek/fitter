import { Button, ImageUpload, Input, Select, TextArea } from "../Layout";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddPostFormSchema,
  postSchemaInput,
} from "../../schemas/post.schema";
import { type Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ButtonColor } from "../Layout/Button";
import { SPORTS } from "../../utils/globals";

type PostFormProps = {
  post?: Post;
  onSubmit: ({}: any) => Promise<Post>;
  buttonText: string;
  buttonColor: ButtonColor;
  isEditing?: boolean;
  redirectPath?: string;
};

const PostForm = ({
  post,
  onSubmit,
  isEditing,
  buttonText,
  buttonColor,
  redirectPath = "/",
}: PostFormProps) => {
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
  const [imageUrl, setImageUrl] = useState<string | null>();

  const upload = async (image: string | null | undefined | ArrayBuffer) => {
    if (!image) return;
    try {
      const res = await fetch("/api/image-upload", {
        body: JSON.stringify({
          image,
        }),
        method: "POST",
      });
      const data = await res.json();
      setImageUrl(data.url);
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const submitHandler: SubmitHandler<AddPostFormSchema> = async (postData) => {
    if (typeof onSubmit === "function") {
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
    }
    router.push(redirectPath);
  };

  return (
    <form
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="w-full space-y-1">
        <Input
          required
          register={register}
          validation={{ required: true }}
          name="title"
          placeholder="A catchy title!"
          errors={errors.title}
          type="text"
        />
      </div>
      <div className="w-full space-y-1">
        <TextArea
          required
          register={register}
          validation={{ required: true }}
          name="description"
          placeholder="Describe your workout and feelings post session 😀"
          errors={errors.description}
        />
      </div>
      <div className="w-full space-y-1">
        <Select
          required
          errors={errors.sport}
          name="sport"
          validation={{ required: true }}
          register={register}
          options={SPORTS}
        />
      </div>
      <div className="w-full space-y-3">
        <Input
          required
          errors={errors.workoutDate}
          register={register}
          validation={{ required: true }}
          name="workoutDate"
          placeholder="Workout date"
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        />
      </div>
      <div className="flex w-full flex-col space-y-3">
        <ImageUpload
          initialImage={post?.image}
          register={register}
          name="image"
          errors={errors.image}
          onChangePicture={upload}
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
