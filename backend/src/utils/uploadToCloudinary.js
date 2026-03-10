import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file?.buffer) return reject(new Error("Invalid file"));

    const isPdf = file.mimetype === "application/pdf";

    let originalName = file.originalname;
    if (originalName.toLowerCase().endsWith(".pdf")) {
      originalName = originalName.slice(0, -4);
    }

    const publicId = `${Date.now()}-${originalName}`;

    const uploadOptions = {
      folder,
      public_id: publicId,
      resource_type: isPdf ? "raw" : "image",
      type: "upload",
      access_mode: "public",
      ...(isPdf && {
        format: "pdf",
        flags: "attachment",
      }),
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          reject(err);
        } else {
          if (isPdf && !result.secure_url.includes(".pdf")) {
            result.secure_url = `${result.secure_url}.pdf`;
          }
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });