import React, { useRef, useState } from "react";
import {
  type UseFormRegister,
  type Path,
  type FieldError,
} from "react-hook-form";
import { type AddPostFormSchema } from "../../schemas/post.schema";
import Image from "next/image";
import { AiOutlineArrowUp } from "react-icons/ai";
import setCapitalized from "../../utils/setCapitalized";

interface ImageUploadProps {
  name: Path<AddPostFormSchema>;
  errors: FieldError | undefined;
  register: UseFormRegister<AddPostFormSchema>;
  sizeLimit?: number;
  onChangePicture: (image: string | ArrayBuffer | null | undefined) => void;
  initialImage: string | null | undefined | ArrayBuffer;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage = null,
  register,
  errors,
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

  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        setImage(reader.result);
        setUpdatingPicture(true);
        if (typeof onChangePicture === "function") {
          onChangePicture(reader.result);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setUpdatingPicture(false);
      }
    });

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

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click();
    }
  };

  return (
    <>
      <label>{setCapitalized(name)}</label>
      <button
        type="button"
        onClick={handleOnClickPicture}
        className={`${
          image
            ? `hover:opacity-50 disabled:hover:opacity-100`
            : `border-2 border-dashed border-gray-500 hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200`
        }  relative min-h-[150px] overflow-hidden rounded-md bg-gradient-to-br from-slate-100 to-[#d1d5db4b] transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:from-[#21262d] dark:to-[#12162048] md:min-h-[250px]`}
      >
        {image && typeof image === "string" ? (
          <Image
            src={image}
            alt={"Image Preview"}
            className="mx-auto min-h-[100px] max-w-fit rounded-md object-contain md:object-fill"
            fill
          />
        ) : null}
        <div className="flex items-center justify-center">
          {!image ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="shrink-0 rounded-full bg-gray-200 p-2 transition group-hover:scale-110 group-focus:scale-110">
                <AiOutlineArrowUp className="text-xl text-black" />
              </div>
              <span className="text-xs font-semibold text-gray-500 transition">
                {updatingPicture ? "Uploading..." : "Upload"}
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
      </button>
      {pictureError || errors ? (
        <span className="text-sm text-red-600">
          {pictureError || errors?.message}
        </span>
      ) : null}
    </>
  );
};
export default ImageUpload;
