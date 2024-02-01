import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { parse as multipartParse } from "lambda-multipart-parser";
import { v4 as uuid4 } from "uuid";

const S3 = new S3Client({});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif"]);

export const handler = ApiHandler(async (event) => {
  // @ts-ignore -- multipartParse types are incorrect, but still compatible
  const data = await multipartParse(event);
  const file = data.files[0];

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing file" }),
    };
  }

  if (!allowedTypes.has(file.contentType)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid file type" }),
    };
  }

  if (file.content.length > 5 * 1024 * 1024) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "File too large" }),
    };
  }

  const command = new Upload({
    client: S3,
    params: {
      Bucket: Bucket.public.bucketName,
      Key: uuid4(),
      Body: file.content,
      ContentType: file.contentType,
    },
  });
  const result = await command.done();

  return {
    statusCode: 200,
    body: JSON.stringify({ key: `/images/${result.Key}` }),
  };
});
