import React from "react";
import {
  type UseFormRegister,
  type RegisterOptions,
  type Path,
  type FieldValues,
  type FieldError,
  type UnPackAsyncDefaultValues,
} from "react-hook-form";
import FormError from "./FormError";

export interface InputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<UnPackAsyncDefaultValues<T>>;
  labelname?: string;
  register: UseFormRegister<T>;
  className?: string;
  errors?: FieldError;
  validation?: RegisterOptions<T>;
  required?: boolean;
}

const Input = <T extends FieldValues>({
  name,
  register,
  className = "",
  errors,
  labelname,
  validation,
  required,
  ...props
}: InputProps<T>) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <>
      <label htmlFor={name}>
        {labelname} {requiredAsterisk}
      </label>
      <input
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} w-full rounded-md bg-[#f6f8fa] py-2 px-3 outline outline-1 dark:bg-[#161b22] dark:outline-[#30363d]`}
        {...props}
      />
      <FormError fieldErrors={errors} />
    </>
  );
};

export default Input;
