/* eslint no-console:off */
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export const createPresignedUrlWithClient = async (folder?: string) => {
  const region = process.env.AWS_REGION ?? '';
  const bucket = process.env.AWS_BUCKET ?? '';
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? '';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? '';

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const key = `${folder ? `${folder}/` : ''}${uuidv4()}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return {
    presignedUrl: await getSignedUrl(client, command, { expiresIn: 3600 }),
    url,
  };
};

export const getPresignedUrlWithClient = async (key: string) => {
  const REGION = process.env.AWS_REGION ?? '';
  const BUCKET = process.env.AWS_BUCKET ?? '';
  const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? '';
  const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? '';

  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const putFileWithPresignedUrl = async (url: string, file: Blob) =>
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
