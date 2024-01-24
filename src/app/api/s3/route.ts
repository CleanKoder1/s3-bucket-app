const { S3Client } = require("@aws-sdk/client-s3");
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image");

  if (image && typeof image === "object" && image.name) {
    const Body = (await image.arrayBuffer()) as Buffer;
    const params = {
      Bucket: bucketName,
      Key: image.name,
      Body,
      ContentType: image.type,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const getObjectParams = {
      Bucket: bucketName,
      Key: image.name,
      ACL: "private",
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 50000,
    });
    return NextResponse.json({
      success: true,
      message: "Successfully image uploaded",
      data: {
        url,
      },
    });
  }

  return NextResponse.json({
    success: false,
    message: "Image is required",
    data: null,
  });
}
