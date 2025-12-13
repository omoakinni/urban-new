const invModel = require("../models/inventory-model")
const utilities = require("../utilities")


const invCont = {}

// TASK 1: management view
invCont.buildManagement = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

// TASK 2: show add-classification form
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: ""
  })
}

// TASK 2: process classification insert
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    const nav = await utilities.getNav() // must rebuild nav to include new classification
    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the classification could not be added.")
  const nav = await utilities.getNav()
  res.status(500).render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name
  })
}

// TASK 3: show add-inventory form
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    // sticky defaults
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  })
}

// TASK 3: process inventory insert (sticky on errors handled by validation middleware)
invCont.addInventory = async (req, res) => {
  const vehicleData = req.body
  const result = await invModel.addInventory(vehicleData)

  if (result) {
    req.flash("notice", "New inventory item added successfully.")
    const nav = await utilities.getNav()
    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  }

  req.flash("notice", "Sorry, the inventory item could not be added.")
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(vehicleData.classification_id)

  res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    ...vehicleData // keeps stickiness
  })
}

module.exports = invCont