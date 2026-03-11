const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'portfolio',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Use multer to parse the multipart form data
    const uploadMiddleware = upload.array('files', 10); // Allow up to 10 files

    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Base options
      const options = {
        overwrite: true,
      };

      // Special handling for different file types
      if (file.mimetype === 'application/pdf') {
        options.resource_type = 'raw';
        options.folder = 'portfolio/documents';
        // For raw files, we MUST include the extension in public_id so the URL has it
        options.public_id = `${Date.now()}_${file.originalname}`;
      } else {
        // For images, we strip extension and let Cloudinary handle format
        const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
        options.public_id = `${Date.now()}_${nameWithoutExt}`;

        if (file.mimetype.startsWith('image/')) {
          options.resource_type = 'image';
          options.folder = 'portfolio/images';
          options.transformation = [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }
          ];
        }
      }

      // Log options for debugging
      console.log(`[DEBUG] Uploading file: ${file.originalname}`);
      console.log(`[DEBUG] Upload options:`, JSON.stringify(options, null, 2));

      const result = await uploadToCloudinary(file.buffer, options);

      console.log(`[DEBUG] Cloudinary Result for ${file.originalname}:`, JSON.stringify(result, null, 2));

      return {
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: uploadResults,
      message: `Successfully uploaded ${uploadResults.length} file(s)`,
    });

  } catch (error) {
    console.error('Upload error:', error);

    if (error.message.includes('File too large')) {
      return res.status(400).json({ success: false, error: 'File size too large. Maximum 10MB allowed.' });
    }

    if (error.message.includes('Only images and PDF files are allowed')) {
      return res.status(400).json({ success: false, error: 'Only images and PDF files are allowed.' });
    }

    res.status(500).json({
      success: false,
      error: 'Upload failed',
      details: error.message
    });
  }
}
