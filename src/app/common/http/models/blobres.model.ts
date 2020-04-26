export class BlobRes {
  status: number;
  return_code: number;
  return_message: string;
  data: {
    data: Blob,
    type: string
  };
}
