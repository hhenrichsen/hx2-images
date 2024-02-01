import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";

const S3 = new S3Client({});

export const handler = ApiHandler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing id" }),
    };
  }

  const command = new GetObjectCommand({
    Bucket: Bucket.public.bucketName,
    Key: id,
  });
  const result = await S3.send(command);

  if (!result.Body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  }

  const res = await result.Body.transformToString("base64");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": result.ContentType || false,
      "Access-Control-Allow-Origin": "*",
    },
    body: res,
    isBase64Encoded: true,
  };
});
