const documentService = require("../services/document.service");
const catchAsync = require("../utils/catchAsync");

const uploadDocument = catchAsync(async (req, res) => {
  const document = await documentService.uploadDocument(
    req.validated.params.merchantId,
    req.validated.body,
    req.user
  );

  res.status(201).json({
    success: true,
    data: document
  });
});

const listDocuments = catchAsync(async (req, res) => {
  const documents = await documentService.listDocuments(req.validated.params.merchantId);

  res.status(200).json({
    success: true,
    data: documents
  });
});

const verifyDocument = catchAsync(async (req, res) => {
  const document = await documentService.verifyDocument(
    req.validated.params.merchantId,
    req.validated.params.documentId,
    req.user
  );

  res.status(200).json({
    success: true,
    data: document
  });
});

module.exports = {
  uploadDocument,
  listDocuments,
  verifyDocument
};
