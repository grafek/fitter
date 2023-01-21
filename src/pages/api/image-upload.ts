import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { env } from "../../env/server.mjs";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
const imageUploadHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const image = req.body;

    if (!image) {
      return res.status(500).json({ message: "No image provided" });
    }

    try {
      const contentType = image.match(/data:(.*);base64/)?.[1];
      const base64FileData = image.split("base64,")?.[1];

      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: "Image data not valid" });
      }

      // Upload image
      const fileName = nanoid();
      const ext = contentType.split("/")[1];
      const path = `${fileName}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(env.SUPABASE_BUCKET)
        .upload(path, Buffer.from(base64FileData, "base64"), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.log(uploadError);
        throw new Error("Unable to upload image to storage");
      }

      // Construct public URL
      const url = `${env.SUPABASE_URL.replace(
        ".co",
        ".in"
      )}/storage/v1/object/public/${env.SUPABASE_BUCKET}/${data.path}`;

      return res.status(200).json({ url });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
};
export default imageUploadHandler;
