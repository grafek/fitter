import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import { type AddPostFormSchema } from "../../schemas/post.schema";
import setCapitalized from "../../utils/setCapitalized";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: Path<AddPostFormSchema>;
  register: UseFormRegister<AddPostFormSchema>;
  className?: string;
  placeholder: string;
  errors: FieldError | undefined;
  validation: RegisterOptions<AddPostFormSchema>;
}

const TextArea = ({
  name,
  register,
  className = "",
  placeholder,
  errors,
  validation,
  ...props
}: TextAreaProps) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";

  return (
    <>
      <label htmlFor={name}>{setCapitalized(name)}</label>
      <textarea
        {...register(name, validation)}
        id={name}
        placeholder={placeholder}
        className={`${className} ${errorClassses} max-h-[200px] min-h-[100px] w-full rounded-md px-3 py-1 outline outline-1 md:min-h-[150px]`}
        {...props}
      />

      {errors ? (
        <span role={"alert"} className="text-sm text-red-500">
          {errors.message}
        </span>
      ) : null}
    </>
  );
};

export default TextArea;
