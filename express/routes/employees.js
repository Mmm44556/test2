
const express = require('express');
let router = express.Router();

const UserRepository = require('../models/user');
const EmployeeService = require('../services/Employees')
const EmployeeController = require('../controllers/employees');
const AuthenticationService = require('../services/Authentication.js');
const AuthenticationController = require('../controllers/authentication.js');


const authenticationService = new AuthenticationService(new UserRepository());
const authenticationController = new AuthenticationController(authenticationService);
const employeeService = new EmployeeService(new UserRepository());
const employeeController = new EmployeeController(employeeService);

/**
 * 用戶資料BREAD
 */
router.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.header('Cache-Control', 'no-store');

  next();
});

router.get('/employees?', employeeController.browse);
router.get('/employees/:id', employeeController.read);
router.put('/employees/:id', employeeController.update);
router.patch('/employees/:id', employeeController.edit);
router.post('/employees', employeeController.add);
router.delete('/employees/:id', employeeController.delete);







module.exports = router;