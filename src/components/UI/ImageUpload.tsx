import React, { useRef, useState } from "react";
import {
  type UseFormRegister,
  type Path,
  type FieldError,
} from "react-hook-form";
import { type AddPostFormSchema } from "../../schemas/post.schema";
import Image from "next/image";
import { AiOutlineArrowUp } from "react-icons/ai";
import FormError from "./FormError";

interface ImageUploadProps {
  name: Path<AddPostFormSchema>;
  errors: FieldError | undefined;
  register: UseFormRegister<AddPostFormSchema>;
  sizeLimit?: number;
  labelName: string;
  onChangePicture: (image: string | ArrayBuffer | null | undefined) => void;
  initialImage: string | null | undefined | ArrayBuffer;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage = null,
  register,
  errors,
  labelName,
  name,
  sizeLimit = 10 * 1024 * 1024, //10MB
  onChangePicture,
}) => {
  const { ref, ...rest } = register(name);
  const pictureRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<string | null | undefined | ArrayBuffer>(
    initialImage
  );
  const [updatingPicture, setUpdatingPicture] = useState(false);
  const [pictureError, setPictureError] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const changePreviewPicture = (file: File) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        setImage(reader.result);
        setUpdatingPicture(true);
        if (typeof onChangePicture === "function") {
          onChangePicture(reader.result);
        }
      } catch (err) {
      } finally {
        setUpdatingPicture(false);
      }
    });
    console.log(file);

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingPicture(true);
        setPictureError("");
        reader.readAsDataURL(file);
      } else {
        setPictureError("File size is exceeding 10MB.");
      }
    }
  };

  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const file = e.target.files[0];

    if (file) {
      changePreviewPicture(file);
    }
  };

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];

    if (file) {
      changePreviewPicture(file);
    }
  };

  return (
    <>
      <label>{labelName}</label>
      <button
        type="button"
        onClick={handleOnClickPicture}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
        ${
          isDragging
            ? "border-4 border-dashed border-[#96aace] bg-[#EEDFFF]"
            : ""
        }${
          image
            ? `hover:opacity-80`
            : `border-2 border-dashed border-gray-500 hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200`
        }  relative min-h-[150px] overflow-hidden rounded-md bg-gradient-to-br from-slate-100 to-[#d1d5db4b] transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:from-[#21262d] dark:to-[#12162048] md:min-h-[250px]`}
      >
        {image && typeof image === "string" ? (
          <Image
            src={image}
            alt={"Image Preview"}
            className="mx-auto min-h-[100px] max-w-fit rounded-md object-contain md:object-fill"
            fill
            priority
            sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : null}

        <div className="flex items-center justify-center">
          {!image ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="shrink-0 rounded-full bg-gray-200 p-2 transition group-hover:scale-110 group-focus:scale-110">
                <AiOutlineArrowUp className="text-xl text-black" />
              </div>
              <span className="text-xs font-semibold text-gray-500 transition">
                {updatingPicture
                  ? "Uploading..."
                  : "Upload a file or drag and drop here"}
              </span>
            </div>
          ) : null}
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            {...rest}
            ref={(e) => {
              ref(e);
              pictureRef.current = e;
            }}
            onChange={handleOnChangePicture}
            className="hidden"
          />
        </div>
        {image ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setImage(null);
            }}
            className="absolute right-1 top-0 [&>svg]:fill-[#b8b8b8] [&>svg]:hover:fill-[#eb2020]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-300"
            >
              <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM7.879 6.464C7.69946 6.28275 7.45743 6.17697 7.20245 6.16832C6.94748 6.15967 6.69883 6.2488 6.50742 6.41747C6.31601 6.58613 6.1963 6.82159 6.1728 7.07562C6.14929 7.32966 6.22378 7.58308 6.381 7.784L6.465 7.879L8.585 9.999L6.465 12.121C6.28375 12.3005 6.17797 12.5426 6.16932 12.7975C6.16067 13.0525 6.2498 13.3012 6.41847 13.4926C6.58713 13.684 6.82258 13.8037 7.07662 13.8272C7.33066 13.8507 7.58408 13.7762 7.785 13.619L7.879 13.536L10 11.414L12.121 13.536C12.3005 13.7173 12.5426 13.823 12.7975 13.8317C13.0525 13.8403 13.3012 13.7512 13.4926 13.5825C13.684 13.4139 13.8037 13.1784 13.8272 12.9244C13.8507 12.6703 13.7762 12.4169 13.619 12.216L13.536 12.121L11.414 10L13.536 7.879C13.7173 7.69946 13.823 7.45743 13.8317 7.20245C13.8403 6.94748 13.7512 6.69883 13.5825 6.50742C13.4139 6.31601 13.1784 6.1963 12.9244 6.1728C12.6703 6.14929 12.4169 6.22378 12.216 6.381L12.121 6.464L10 8.586L7.879 6.464Z" />
            </svg>
          </span>
        ) : null}
      </button>
      <FormError fieldErrors={errors} errors={pictureError} />
    </>
  );
};
export default ImageUpload;
