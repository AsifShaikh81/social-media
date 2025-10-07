import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit
// we will use this imagekit in userController where we are updating user data
// because there we are uploading profile and cover photo to imagekit and getting url of that image
// after that we will store that url in our db
// we are using imagekit because it provides automatic image optimization and transformation

//why we are using imagekit?
// we cannot upload img directly to db because it will increase the size of db
// so we upload img to imagekit and get the url of that image and store that url in db
// whenever we want to display that image we will use that url to fetch the image from imagekit