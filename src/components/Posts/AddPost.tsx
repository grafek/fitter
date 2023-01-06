import { Input, Select, TextArea } from "../Layout";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddPostFormSchema,
  postSchemaInput,
} from "../../schemas/post.schema";
import { useRouter } from "next/router";
import { useAddPost } from "../../hooks";

type AddPostProps = {
  sports: string[];
};

const AddPost = ({ sports }: AddPostProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPostFormSchema>({ resolver: zodResolver(postSchemaInput) });

  const router = useRouter();

  const { mutate } = useAddPost();

  const submitHandler: SubmitHandler<AddPostFormSchema> = (post) => {
    mutate(post);
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
      <div className="w-full space-y-1">
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
      <button
        className="rounded-md bg-blue-600 p-3 py-1 text-white shadow-md outline outline-1 outline-blue-600 transition-colors duration-200 hover:bg-transparent hover:text-black"
        type="submit"
      >
        Add post!
      </button>
    </form>
  );
};

export default AddPost;
