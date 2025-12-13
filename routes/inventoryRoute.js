// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Add classification form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory form
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router