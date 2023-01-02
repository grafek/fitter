import { Input, Select, TextArea } from "../Layout";
import { type SubmitHandler, useForm } from "react-hook-form";

type AddPostProps = {
  sports: string[];
};

export interface IAddPostFormInput {
  title: string;
  description: string;
  sport: string;
  date: string;
}

const AddPost = ({ sports }: AddPostProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddPostFormInput>();

  const submitHandler: SubmitHandler<IAddPostFormInput> = (data) => {
    console.log(data);
  };

  return (
    <form
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="w-full">
        <Input
          register={register}
          validation={{ required: true }}
          name="title"
          placeholder="Title"
          errors={errors.title}
          type="text"
        />
      </div>
      <div className="w-full">
        <TextArea
          register={register}
          validation={{ required: true }}
          name="description"
          placeholder="Describe your workout and feelings post session 😀"
          errors={errors.description}
        />
      </div>
      <div className="w-full">
        <Select
          errors={errors.sport}
          name="sport"
          validation={{ required: true }}
          register={register}
          options={sports}
        />
      </div>
      <div className="w-full">
        <Input
          errors={errors.date}
          register={register}
          validation={{ required: true }}
          name="date"
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
