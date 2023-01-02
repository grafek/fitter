import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import setCapitalized from "../../utils/setCapitalized";
import { type IAddPostFormInput } from "../Posts/AddPost";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: Path<IAddPostFormInput>;
  register: UseFormRegister<IAddPostFormInput>;
  className?: string;
  placeholder: string;
  errors: FieldError | undefined;
  validation: RegisterOptions<IAddPostFormInput>;
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
  const errorClassses = errors ? "outline-red-500" : null;

  return (
    <>
      <label htmlFor={name} />
      <textarea
        {...register(name, validation)}
        id={name}
        placeholder={placeholder}
        className={`${className} ${errorClassses} max-h-[200px] min-h-[100px] w-full rounded-md px-3 py-1 outline outline-1 outline-gray-300 md:min-h-[150px]`}
        {...props}
      />

      {errors?.type === "required" ? (
        <span role={"alert"} className="text-sm text-red-500">
          {setCapitalized(name)} is required!
        </span>
      ) : null}
    </>
  );
};

export default TextArea;
