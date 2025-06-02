const multer = require('multer');
const path = require('path');

// Set  file storage for multer
const loanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'F:\\OCGEMPC_API\\uploads\\loan-applications\\');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

// Set thumbnail file storage for multer
const loanInsurances = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'F:\\OCGEMPC_API\\uploads\\loan-insurances\\');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// File filter for images/videos only
const loanFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|docx|csv|xlsx/;
  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, CSV and XLSX Files are allowed!"));
  }
};

const imageFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;

  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};


// Set multer options
const ifcUpload = multer({
  storage: loanStorage,
  fileFilter: loanFilter,
  limits: { fileSize: 100000000 } // 100MB file size limit
});

const imageUpload = multer({
  storage: loanInsurances,
  fileFilter: loanFilter,
  limits: { fileSize: 5000000 } // 50MB file size limit
});

module.exports = {
  ifcUpload, imageUpload
};
