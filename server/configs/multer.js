import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({ storage });
// we will use this upload in route where we want to upload files
// like profile and cover photo

// we created disk storage because we want to store file in disk
// after that we will convert it into buffer and upload to imagekit
// after uploading we will get url of that image and store that url in db

//why we are using multer?
/* Multer is used in Node.js to simplify file uploads from web forms by handling the multipart/form-data requests. It acts as a middleware, parsing these requests to extract and store files on the server, making it easier to process images, documents, and other media files submitted through a web application */