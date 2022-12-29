const multer = require("multer");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const imageUpload = () => {
  const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
  const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 5 * 1024 * 1024, // keep images size < 25 MB
    },

    fileFilter: (req, file, callback) => {
      if (imageMimeTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(null, false);
        throw new Error(
          "Unsupported image type, please pick a valid image type."
        );
      }
    },
  });

  return uploader;
};

const uploadFileUtility = async (file, folder, fileName) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${folder}/${fileName}`);
  await uploadBytes(storageRef, file.buffer);
  let downloadUrl = "";
  await getDownloadURL(storageRef).then(async (url) => {
    downloadUrl = url;
  });

  return downloadUrl;
};

const deleteFileUtility = async (imageUrl) => {
  const storage = getStorage();
  const storageRef = ref(storage);
  await deleteObject(storageRef);
};

module.exports = { uploadFileUtility, deleteFileUtility, imageUpload };
