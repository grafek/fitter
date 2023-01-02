import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import { type IAddPostFormInput } from "../Posts/AddPost";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<IAddPostFormInput>;
  register: UseFormRegister<IAddPostFormInput>;
  className?: string;
  options: string[];
  validation: RegisterOptions<IAddPostFormInput>;
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
  const errorClassses = errors ? "outline-red-500" : null;

  return (
    <>
      <label htmlFor={name} />
      <select
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} w-full rounded-md px-2 py-1 outline outline-1 outline-gray-300`}
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
