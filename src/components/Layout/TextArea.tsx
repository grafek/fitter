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
  errors: FieldError | undefined;
  validation: RegisterOptions<AddPostFormSchema>;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  register,
  className = "",
  errors,
  validation,
  required,
  ...props
}) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <>
      <label htmlFor={name}>
        {setCapitalized(name)}
        {requiredAsterisk}
      </label>
      <textarea
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} max-h-[200px] min-h-[100px] w-full rounded-md bg-[#f6f8fa] px-3 py-2 outline outline-1 dark:bg-[#161b22] dark:outline-[#30363d] md:min-h-[150px]`}
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
