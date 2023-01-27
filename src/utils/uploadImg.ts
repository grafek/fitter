import { toast } from "react-hot-toast";

const uploadImg = async (imgData: string | null | undefined | ArrayBuffer) => {
  let toastId;
  if (!imgData) return;
  try {
    toastId = toast.loading("Uploading image...");
    const res = await fetch("/api/image-upload", {
      body: JSON.stringify({
        imgData,
      }),
      method: "POST",
    });
    const data = await res.json();
    toast.success("Image uploaded!", { id: toastId, icon: "📷" });
    return data.url;
  } catch (e) {
    toast.error("Unable to upload :(", { id: toastId });
  }
};

export default uploadImg;
