import { Button, Input, Select, TextArea } from "../Layout";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddPostFormSchema,
  postSchemaInput,
} from "../../schemas/post.schema";
import { type Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useCreatePost, useUpdatePost } from "../../hooks";

type PostFormProps = {
  sports: string[];
  isEditing: boolean;
  post?: Post;
};

const PostForm = ({ sports, isEditing, post }: PostFormProps) => {
  const formDefaultValues = {
    title: post ? post.title : "",
    description: post ? post.description : "",
    sport: post ? post.sport : sports[Math.ceil(Math.random() * sports.length)],
    workoutDate: post ? post.workoutDate.toDateString() : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPostFormSchema>({
    resolver: zodResolver(postSchemaInput),
    defaultValues: formDefaultValues,
  });
  const router = useRouter();

  const { mutate: addPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();

  const submitHandler: SubmitHandler<AddPostFormSchema> = async (newPost) => {
    post && isEditing
      ? updatePost({ postId: newPost ? post.id : "", postSchemaInput: newPost })
      : addPost(newPost);
    // if post is passed as a prop, update form and mutateFn will be fired,
    //  otherwise 'addpost'
    router.push("/");
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
          placeholder="Title"
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
          options={sports}
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
      {
        // TODO: ADDING IIMAGE HANDLING
        /* <div>
            <label>Image</label>
            <input type={"file"} />
          </div> */
      }
      <Button
        color={`${isEditing ? "success" : "primary"}`}
        type="submit"
        className="mt-4"
      >
        {isEditing ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
};

export default PostForm;
