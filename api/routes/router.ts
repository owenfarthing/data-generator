'use strict';

// Router for /api/ routes

// external imports
import express from 'express';
import path from 'path';

// internal imports
import downloads from '../route-handlers/downloadRouteHandler';
import mockSchemas from '../route-handlers/mockSchemaRouteHandler';
import processes from '../route-handlers/processRouteHandler';
import schemas from '../route-handlers/schemaRouteHandler';

const router = express.Router();

router.use('/public', express.static(path.join(process.cwd(), 'public')));

// routes
router.get('/downloads', downloads.getDownloads);
router.get('/me/downloads/:id', downloads.getDownload);
router.get('/me/processes/:id', processes.getProcess);
router.get('/mock/schemas/schema/:id', mockSchemas.getSchema);
router.get('/mock/schemas/:type', mockSchemas.getSchemas);
router.get('/schemas/databricks', schemas.getDatabricksSchemas);
router.get('/schemas/postgres', schemas.getPostgresSchemas);
router.get('/tables/databricks/:schema', schemas.getDatabricksTables);
router.get('/tables/postgres/:schema', schemas.getPostgresTables);
router.get('/tables/databricks/:schema/:table', schemas.getDatabricksTable);
router.get('/tables/postgres/:schema/:table', schemas.getPostgresTable);

router.post('/downloads', downloads.getDownloadsById);
router.post('/me/downloads/:id/download', downloads.downloadSchema);
router.post('/me/schemas/:id/stream', mockSchemas.streamSchemaToDatabase);
router.post('/me/schemas/:id/export', mockSchemas.streamSchemaToExport);
router.post('/mock/schemas', mockSchemas.createSchema);

router.put('/mock/schemas/:id', mockSchemas.saveSchema);

router.delete('/mock/schemas/:id', mockSchemas.deleteSchema);

module.exports = {
	router
};