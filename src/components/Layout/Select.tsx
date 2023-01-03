import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import setCapitalized from "../../utils/setCapitalized";
import { type AddPostFormSchema } from "../../schemas/post.schema";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<AddPostFormSchema>;
  register: UseFormRegister<AddPostFormSchema>;
  className?: string;
  options: string[];
  validation: RegisterOptions<AddPostFormSchema>;
  errors: FieldError | undefined;
}

const Select = ({
  name,
  register,
  validation,
  className = "",
  options,
  errors,
  ...props
}: SelectProps) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";


  return (
    <>
      <label htmlFor={name}>{setCapitalized(name)}</label>
      <select
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} w-full rounded-md px-2 py-1 outline outline-1`}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};
export default Select;
