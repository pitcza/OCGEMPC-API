const express = require('express');
// const cors = require('cors');
const router = express.Router();
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const {
  permission,
  can,
} = require('../middleware/permissionMiddleware');
const permissionController = require('../controllers/permissionController');
const userRoleController = require('../controllers/userRoleController');
const rolePermissionController = require('../controllers/rolePermissionController');
const staffLogController = require('../controllers/staffLogController');
const loanController = require('../controllers/loanController');
const makerController = require('../controllers/makerController');
const insuranceController = require('../controllers/insuranceController');

const {ifcUpload, imageUpload} = require('../utils/multerConfig');

const authorize = require('../middleware/authorizationMiddleware');
router.use(authorize);
const permit = require('../middleware/permissionMiddleware');

// CRUD Routes for User
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getCurrentUser);
router.post('/addUser', userController.addUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);
router.put('/update-profile', userController.updateProfile);
router.post('/reset-password', userController.resetPassword);
router.post(
  '/confirm-reset-password',
  userController.confirmResetPassword
);

// CRUD Routes for Role
router.get('/roles', roleController.getRoles);
router.get('/role/:id', roleController.getRoleById);
router.post('/create-role', roleController.createRole);
router.put('/update-role/:id', roleController.updateRole);
router.delete('/delete-role/:id', roleController.deleteRole);

// CRUD Routes for Permissions
router.get('/permissions', permissionController.getPermissions);
router.get('/permission/:id', permissionController.getPermissionById);
router.post(
  '/create-permission',
  permissionController.createPermission
);
//router.put('/update-permission/:id', permissionController.updatePermission);
//router.delete('/delete-permission/:id', permissionController.deletePermission);

// CRUD Routes for Role Permissions
router.get(
  '/rolePermissions',
  rolePermissionController.getRolePermission
);
router.get(
  '/rolePermission/:id',
  rolePermissionController.getRolePermissionById
);
router.post(
  '/create-rolePermission',
  rolePermissionController.createRolePermission
);
router.put(
  '/update-rolePermission/:id',
  rolePermissionController.updateRolePermission
);
router.delete(
  '/delete-rolePermission/:id',
  rolePermissionController.deleteRolePermission
);

// CRUD Routes for User Roles
router.get('/userRoles', userRoleController.getUserRoles);
router.delete(
  '/delete-userRole/:id',
  userRoleController.deleteUserRole
);

// Staff Log Route
router.get('/staffLogs', staffLogController.getAllStaffLogs);
router.delete('/delete-log/:id', staffLogController.deleteStaffLog);
router.post('/mass-delete-logs/', staffLogController.massDeleteLogs);

// Maker Routes
router.post('/makers/check-duplicate', makerController.checkDuplicateMaker)
router.get('/makers', makerController.getAllMakers);
router.get('/maker/:id', makerController.getMakerById);
router.post('/create-maker', makerController.createMaker);
router.put('/update-maker/:id', makerController.updateMaker);
router.delete('/delete-maker', makerController.deleteMaker);


// comaker routes
router.get('/comakers', makerController.getAllComakers);
router.get('/comaker/:id', makerController.getComakerById);
router.post('/create-comaker', makerController.createComaker);
router.put('/update-comaker/:id', makerController.updateComaker);
router.delete('/delete-comaker', makerController.deleteComaker);

// Loan Routes
router.get('/loans', loanController.getAllLoans);
router.get('/loan/:id', loanController.getLoanById);
router.get('/loan/maker/:id', loanController.getLoanByMakerId);
router.post('/create-loan', loanController.createLoan);
router.put('/update-loan/:id', loanController.updateLoan);
router.delete('/delete-loan/:id', loanController.deleteLoan);
router.post('/approve-loan/:id', loanController.approveLoan);
router.post('/decline-loan/:id', loanController.declineLoan);

// loan amortization routes
router.patch('/amortization/:id/status', loanController.updateAmortizationStatus);

// Dashboard Routes 
router.get('/total-monthly-applications', loanController.getApplicationsbyMonth);
router.get('/total-loan-amount', loanController.getTotalLoanAmountThisMonth);
router.get('/active-loans', loanController.getTotalActiveLoans);
router.get('/paid-loans', loanController.getTotalPaidLoans);
router.get('/loans-this-month', loanController.getTotalApplicationsThisMonth);
router.get('/loans-per-status', loanController.getApplicationsPerStatus);
router.get('/recent-payments', loanController.getMostRecentPayments);

// Insurance Routes
router.get('/insurances', insuranceController.getAllInsurances);
router.get('/insurance/:id', insuranceController.getInsuranceById);
router.post('/create-insurance', insuranceController.createInsurance);
router.put('/update-insurance/:id', insuranceController.updateInsurance);
router.delete('/delete-insurance/:id', insuranceController.deleteInsurance);

module.exports = router;
